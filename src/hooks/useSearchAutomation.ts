import { useState, useEffect, useRef, useCallback } from 'react';
import type { TrendingTopic } from '../types';

type SearchWindowHandle = {
  closed: boolean;
  location: { href: string };
  focus: () => void;
  close: () => void;
};

export type SearchMode = 'daily' | 'bing_star';

const GOALS = {
  daily: 20, // 60 points (3 pts per search)
  bing_star: 25, // ~75 points daily to reach monthly bonus goals safely
};

// Different cooldown profiles for "authentic" searches
const COOLDOWNS = {
  daily: { base: 8, variance: 4 }, // 4-12 seconds
  bing_star: { base: 22, variance: 8 } // 14-30 seconds (for "authentic" feel)
};

const getRandomCooldown = (mode: SearchMode) => {
  const { base, variance } = COOLDOWNS[mode];
  return (base - variance) + Math.floor(Math.random() * (variance * 2 + 1));
};

const generateRandomId = () => Math.random().toString(36).substring(2, 10);

export const useSearchAutomation = (
  topics: TrendingTopic[]
) => {
  const [cooldowns, setCooldowns] = useState<Record<SearchMode, number>>({ daily: 0, bing_star: 0 });
  const [dailyCount, setDailyCount] = useState(0);
  const [bingStarCount, setBingStarCount] = useState(0);
  const [isAutoSearchingByMode, setIsAutoSearchingByMode] = useState<Record<SearchMode, boolean>>({ daily: false, bing_star: false });
  const [autoSearchIndex, setAutoSearchIndex] = useState(0);
  const [mode, setMode] = useState<SearchMode>('daily');
  const searchTabRef = useRef<SearchWindowHandle | null>(null);

  useEffect(() => {
    const storedDailyCount = localStorage.getItem('bing_rewards_daily_count');
    const storedBingStarCount = localStorage.getItem('bing_rewards_bing_star_count');
    const storedDate = localStorage.getItem('bing_rewards_date');
    const lastIndex = localStorage.getItem('bing_rewards_last_index');
    const storedMode = localStorage.getItem('bing_rewards_mode') as SearchMode;
    const today = new Date().toDateString();

    if (storedDate === today) {
      setDailyCount(Number(storedDailyCount) || 0);
      setBingStarCount(Number(storedBingStarCount) || 0);
      setAutoSearchIndex(Number(lastIndex) || 0);
      if (storedMode) setMode(storedMode);
    } else {
      setDailyCount(0);
      setBingStarCount(0);
      setAutoSearchIndex(0);
      localStorage.setItem('bing_rewards_daily_count', '0');
      localStorage.setItem('bing_rewards_bing_star_count', '0');
      localStorage.setItem('bing_rewards_date', today);
      localStorage.setItem('bing_rewards_last_index', '0');
    }
  }, []);

  const dailyGoal = GOALS.daily;
  const bingStarGoal = GOALS.bing_star;
  const currentCount = mode === 'bing_star' ? bingStarCount : dailyCount;
  const currentGoal = mode === 'bing_star' ? bingStarGoal : dailyGoal;
  const cooldown = cooldowns[mode];
  const isAutoSearching = isAutoSearchingByMode[mode];

  const performSearch = useCallback((topic: string, index: number) => {
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

    setCooldowns(prev => ({ ...prev, [mode]: getRandomCooldown(mode) }));
    setAutoSearchIndex(index);

    if (mode === 'bing_star') {
      setBingStarCount((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem('bing_rewards_bing_star_count', String(newCount));
        return newCount;
      });
    } else {
      setDailyCount((prevCount) => {
        const newCount = prevCount + 1;
        localStorage.setItem('bing_rewards_daily_count', String(newCount));
        return newCount;
      });
    }
    localStorage.setItem('bing_rewards_last_index', String(index));
  }, [mode]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (cooldown > 0) {
      timer = setTimeout(() => setCooldowns(prev => ({ ...prev, [mode]: (prev[mode] ?? 0) - 1 })), 1000);
    } else if (isAutoSearching && cooldown === 0) {
      const nextIndex = autoSearchIndex + 1;

      if (currentCount < currentGoal) {
        if (nextIndex < topics.length) {
          const nextTopic = topics[nextIndex];
          if (nextTopic) {
            performSearch(nextTopic.title, nextIndex);
          }
        } else {
          setIsAutoSearchingByMode(prev => ({ ...prev, [mode]: false }));
        }
      } else {
        setIsAutoSearchingByMode(prev => ({ ...prev, [mode]: false }));
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
  }, [cooldown, isAutoSearching, autoSearchIndex, topics, currentCount, currentGoal, performSearch]);

  const startAutoSearch = () => {
    if (topics.length === 0) return;
    setIsAutoSearchingByMode(prev => ({ ...prev, [mode]: true }));

    const startIndex = currentCount >= currentGoal ? 0 : currentCount;
    const effectiveIndex = startIndex < topics.length ? startIndex : 0;

    const firstTopic = topics[effectiveIndex];
    if (firstTopic) {
      performSearch(firstTopic.title, effectiveIndex);
    } else {
      setIsAutoSearchingByMode(prev => ({ ...prev, [mode]: false }));
    }
  };

  const stopAutoSearch = () => {
    setIsAutoSearchingByMode(prev => ({ ...prev, [mode]: false }));
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
    if (newMode === mode) return;
    // Stop the current mode's auto-search when switching
    setIsAutoSearchingByMode(prev => ({ ...prev, [mode]: false }));
    setCooldowns(prev => ({ ...prev, [mode]: 0 }));
    if (searchTabRef.current && !searchTabRef.current.closed) {
      searchTabRef.current.close();
    }
    setMode(newMode);
    localStorage.setItem('bing_rewards_mode', newMode);
  };

  const resetDaily = () => {
    if (mode === 'bing_star') {
      setBingStarCount(0);
      localStorage.setItem('bing_rewards_bing_star_count', '0');
    } else {
      setDailyCount(0);
      localStorage.setItem('bing_rewards_daily_count', '0');
    }
    setAutoSearchIndex(0);
    localStorage.setItem('bing_rewards_last_index', '0');
  };

  return {
    cooldown,
    dailyCount,
    bingStarCount,
    dailyGoal,
    bingStarGoal,
    currentCount,
    currentGoal,
    isAutoSearching,
    autoSearchIndex,
    mode,
    startAutoSearch,
    stopAutoSearch,
    handleManualSearch,
    switchMode,
    resetDaily,
  };
};
