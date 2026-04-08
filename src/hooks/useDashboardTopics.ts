import { useCallback, useRef, useState, type RefObject } from "react";

import { fetchBingStarTopics, fetchDailyTopics } from "../lib/api";
import type { SearchMode } from "./useSearchAutomation";
import type { TrendingTopic } from "../types";

const BING_STAR_INITIAL_SIZE = 25;
const BING_STAR_LOAD_MORE_SIZE = 15;

const keyForTopic = (topic: TrendingTopic) => topic.id || topic.title.trim().toLowerCase();

export const useDashboardTopics = (modeRef: RefObject<SearchMode>) => {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const [hasLoadedExtraBatch, setHasLoadedExtraBatch] = useState(false);
  const hasLoadedExtraBatchRef = useRef(false);
  const pageRef = useRef(0);
  const overflowRef = useRef<TrendingTopic[]>([]);

  const appendUniqueTopics = useCallback((incoming: TrendingTopic[]) => {
    setTopics((prev) => {
      const seen = new Set(prev.map(keyForTopic));
      const uniqueIncoming = incoming.filter((topic) => {
        const key = keyForTopic(topic);
        if (seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });

      if (uniqueIncoming.length === 0) {
        return prev;
      }

      return [...prev, ...uniqueIncoming];
    });
  }, []);

  const loadTopics = useCallback(async (isLoadMore = false) => {
    const mode = modeRef.current ?? "daily";

    if (isLoadMore && mode !== "bing_star") {
      return;
    }

    if (isLoadMore && hasLoadedExtraBatchRef.current) {
      return;
    }

    if (isLoadMore) {
      setIsMoreLoading(true);
    } else {
      setLoading(true);
      pageRef.current = 0;
      overflowRef.current = [];
      hasLoadedExtraBatchRef.current = false;
      setHasLoadedExtraBatch(false);
    }

    try {
      if (mode === "daily") {
        const data = await fetchDailyTopics();
        setTopics(data);
        return;
      }

      if (!isLoadMore) {
        const firstBatch = await fetchBingStarTopics(0, BING_STAR_INITIAL_SIZE);
        setTopics(firstBatch);
        pageRef.current = 1;
        return;
      }

      while (overflowRef.current.length < BING_STAR_LOAD_MORE_SIZE) {
        const nextPageData = await fetchBingStarTopics(pageRef.current, BING_STAR_INITIAL_SIZE);
        pageRef.current += 1;

        if (nextPageData.length === 0) {
          break;
        }

        overflowRef.current = [...overflowRef.current, ...nextPageData];
      }

      const chunk = overflowRef.current.slice(0, BING_STAR_LOAD_MORE_SIZE);
      overflowRef.current = overflowRef.current.slice(BING_STAR_LOAD_MORE_SIZE);
      appendUniqueTopics(chunk);
      if (chunk.length > 0) {
        hasLoadedExtraBatchRef.current = true;
        setHasLoadedExtraBatch(true);
      }
    } catch (error) {
      console.error("Failed to load topics", error);
    } finally {
      setLoading(false);
      setIsMoreLoading(false);
    }
  }, [appendUniqueTopics, modeRef]);

  return {
    topics,
    loading,
    isMoreLoading,
    canLoadMore: !hasLoadedExtraBatch,
    loadTopics,
  };
};
