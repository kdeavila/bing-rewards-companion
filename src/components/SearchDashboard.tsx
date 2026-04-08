import React, { useState, useEffect, useCallback, useRef } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { ThemeProvider } from "@mui/material/styles";

import { fetchTrendingTopics } from "../lib/api";
import { googleTheme } from "../theme/google";
import { useSearchAutomation } from "../hooks/useSearchAutomation";
import { ProgressTracker } from "./dashboard/ProgressTracker";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardActions } from "./dashboard/DashboardActions";
import { TopicsSection } from "./dashboard/TopicsSection";
import { HelpFab } from "./dashboard/HelpFab";
import type { TrendingTopic } from "../types";

export const SearchDashboard: React.FC = () => {
  const [topics, setTopics] = useState<TrendingTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [isMoreLoading, setIsMoreLoading] = useState(false);
  const pageRef = useRef(0);

  const loadTopics = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
      setIsMoreLoading(true);
    } else {
      setLoading(true);
    }

    try {
      const nextPage = isLoadMore ? pageRef.current + 1 : 0;
      const data = await fetchTrendingTopics(nextPage);

      if (isLoadMore) {
        setTopics((prev) => [...prev, ...data]);
      } else {
        setTopics(data);
      }

      pageRef.current = nextPage;
      setPage(nextPage);
    } catch (error) {
      console.error("Failed to load topics", error);
    } finally {
      setLoading(false);
      setIsMoreLoading(false);
    }
  }, []);

  const handleNeedMoreTopics = useCallback(() => loadTopics(true), [loadTopics]);

  const {
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
    resetDaily,
  } = useSearchAutomation(topics, handleNeedMoreTopics);

  useEffect(() => {
    void loadTopics();
  }, [loadTopics]);

  return (
    <ThemeProvider theme={googleTheme}>
      <Box
        sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
      >
        <DashboardHeader cooldown={cooldown} />

        <Container maxWidth="md" sx={{ mt: 4, pb: 10 }}>
          <ProgressTracker dailyCount={dailyCount} dailyGoal={dailyGoal} />

          <DashboardActions
            loading={loading}
            cooldown={cooldown}
            isAutoSearching={isAutoSearching}
            hasTopics={topics.length > 0}
            mode={mode}
            onStartAutoSearch={startAutoSearch}
            onStopAutoSearch={stopAutoSearch}
            onRefreshTopics={() => {
              void loadTopics(false);
            }}
            onSwitchMode={switchMode}
            onReset={resetDaily}
          />

          {isAutoSearching && (
            <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
              Mode: <strong>{mode === 'daily' ? 'Daily Search' : 'Bing Star Bonus'}</strong>.{" "}
              Currently searching: <strong>{topics[autoSearchIndex]?.title}</strong>. 
              Next search in {cooldown}s.
            </Alert>
          )}

          <TopicsSection
            topics={topics}
            loading={loading}
            isAutoSearching={isAutoSearching}
            autoSearchIndex={autoSearchIndex}
            cooldown={cooldown}
            isMoreLoading={isMoreLoading}
            onManualSearch={handleManualSearch}
            onLoadMore={() => {
              void loadTopics(true);
            }}
          />
        </Container>

        <HelpFab />
      </Box>
    </ThemeProvider>
  );
};
