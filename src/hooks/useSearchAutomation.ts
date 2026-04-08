import { useState, useEffect, useRef } from 'react';
import type { TrendingTopic } from '../types';

type SearchWindowHandle = {
  closed: boolean;
  location: { href: string };
  focus: () => void;
  close: () => void;
};

export type SearchMode = 'daily' | 'bing_star';

const GOALS = {
  daily: 20,      // 60 points (3 pts per search)
  bing_star: 25,  // ~75 points daily to reach monthly bonus goals safely
};

// Different cooldown profiles for "authentic" searches
const COOLDOWNS = {
  daily: { base: 8, variance: 4 },     // 4-12 seconds
  bing_star: { base: 22, variance: 8 }  // 14-30 seconds (for "authentic" feel)
};

const getRandomCooldown = (mode: SearchMode) => {
  const { base, variance } = COOLDOWNS[mode];
  return (base - variance) + Math.floor(Math.random() * (variance * 2 + 1));
};

const generateRandomId = () => Math.random().toString(36).substring(2, 10);

export const useSearchAutomation = (
  topics: TrendingTopic[], 
  onNeedMoreTopics?: () => Promise<void>
) => {
  const [cooldown, setCooldown] = useState(0);
  const [dailyCount, setDailyCount] = useState(0);
  const [isAutoSearching, setIsAutoSearching] = useState(false);
  const [autoSearchIndex, setAutoSearchIndex] = useState(0);
  const [mode, setMode] = useState<SearchMode>('daily');
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const searchTabRef = useRef<SearchWindowHandle | null>(null);

  useEffect(() => {
    const storedCount = localStorage.getItem('bing_rewards_count');
    const storedDate = localStorage.getItem('bing_rewards_date');
    const lastIndex = localStorage.getItem('bing_rewards_last_index');
    const storedMode = localStorage.getItem('bing_rewards_mode') as SearchMode;
    const today = new Date().toDateString();

    if (storedDate === today) {
      setDailyCount(Number(storedCount) || 0);
      setAutoSearchIndex(Number(lastIndex) || 0);
      if (storedMode) setMode(storedMode);
    } else {
      setDailyCount(0);
      setAutoSearchIndex(0);
      localStorage.setItem('bing_rewards_count', '0');
      localStorage.setItem('bing_rewards_date', today);
      localStorage.setItem('bing_rewards_last_index', '0');
    }
  }, []);

  const dailyGoal = GOALS[mode];

  const performSearch = (topic: string, index: number) => {
    const randomId = generateRandomId();
    // More complex URL parameters to simulate different entry points
    const form = mode === 'bing_star' ? 'PRAS01' : 'QBLH';
    const url = `https://www.bing.com/search?q=${encodeURIComponent(topic)}&form=${form}&cvid=${randomId}&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIGCAEQRRg70gEINTI0NmowajSoAgCwAgA&FORM=ANNTA1&PC=U531`;
    
    const popupOpen = (globalThis as {
      open?: (url?: string, target?: string) => SearchWindowHandle | null;
    }).open;
    
    if (!searchTabRef.current || searchTabRef.current.closed) {
      searchTabRef.current = popupOpen?.(url, 'rewards_search_tab') ?? null;
    } else {
      searchTabRef.current.location.href = url;
      searchTabRef.current.focus();
    }

    setCooldown(getRandomCooldown(mode));
    setAutoSearchIndex(index);
    
    const newCount = dailyCount + 1;
    setDailyCount(newCount);
    localStorage.setItem('bing_rewards_count', String(newCount));
    localStorage.setItem('bing_rewards_last_index', String(index));
  };

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldown(prev => prev - 1), 1000);
    } else if (isAutoSearching && cooldown === 0 && !isFetchingMore) {
      const nextIndex = autoSearchIndex + 1;
      
      if (dailyCount < dailyGoal) {
        if (nextIndex < topics.length) {
          const nextTopic = topics[nextIndex];
          if (nextTopic) {
            performSearch(nextTopic.title, nextIndex);
          }
        } else if (onNeedMoreTopics) {
          setIsFetchingMore(true);
          onNeedMoreTopics().finally(() => {
            setIsFetchingMore(false);
          });
        } else {
          setIsAutoSearching(false);
        }
      } else {
        setIsAutoSearching(false);
        if (searchTabRef.current && !searchTabRef.current.closed) {
          searchTabRef.current.close();
        }
      }
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [cooldown, isAutoSearching, autoSearchIndex, topics, dailyCount, dailyGoal, onNeedMoreTopics, isFetchingMore, mode]);

  const startAutoSearch = () => {
    if (topics.length === 0) return;
    setIsAutoSearching(true);
    const startIndex = dailyCount >= dailyGoal ? 0 : autoSearchIndex;
    const effectiveIndex = startIndex < topics.length ? startIndex : 0;
    
    const firstTopic = topics[effectiveIndex];
    if (firstTopic) {
      performSearch(firstTopic.title, effectiveIndex);
    } else {
      setIsAutoSearching(false);
    }
  };

  const stopAutoSearch = () => {
    setIsAutoSearching(false);
    if (searchTabRef.current && !searchTabRef.current.closed) {
      searchTabRef.current.close();
    }
  };

  const handleManualSearch = (topic: string) => {
    if (cooldown > 0 || isAutoSearching) return;
    const topicIndex = topics.findIndex(t => t.title === topic);
    performSearch(topic, topicIndex >= 0 ? topicIndex : autoSearchIndex);
  };

  const switchMode = (newMode: SearchMode) => {
    setMode(newMode);
    localStorage.setItem('bing_rewards_mode', newMode);
  };

  const resetDaily = () => {
    setDailyCount(0);
    setAutoSearchIndex(0);
    localStorage.setItem('bing_rewards_count', '0');
    localStorage.setItem('bing_rewards_last_index', '0');
  };

  return {
    cooldown,
    dailyCount,
    dailyGoal,
    isAutoSearching,
    autoSearchIndex,
    mode,
    startAutoSearch,
    stopAutoSearch,
    handleManualSearch,
    switchMode,
    resetDaily
  };
};
