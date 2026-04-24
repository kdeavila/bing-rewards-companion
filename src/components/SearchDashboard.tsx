import React, { useState, useEffect, useRef } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, useColorScheme } from "@mui/material/styles";

import { googleTheme, type ThemeMode } from "../theme/google";
import { useDashboardTopics } from "../hooks/useDashboardTopics";
import { useSearchAutomation, type SearchMode } from "../hooks/useSearchAutomation";
import { ProgressTracker } from "./dashboard/ProgressTracker";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardActions } from "./dashboard/DashboardActions";
import { FloatingSearchStatus } from "./dashboard/FloatingSearchStatus";
import { TopicsSection } from "./dashboard/TopicsSection";
import { HelpFab } from "./dashboard/HelpFab";

const SearchDashboardContent: React.FC = () => {
  const { mode: colorMode, setMode, systemMode } = useColorScheme();
  const [showFloatingStatus, setShowFloatingStatus] = useState(false);
  const modeRef = useRef<SearchMode>("daily");
  const effectiveMode = colorMode === "system" ? systemMode : colorMode;
  const themeMode: ThemeMode = effectiveMode === "dark" ? "dark" : "light";

  const { topics, loading, isMoreLoading, canLoadMore, loadTopics } = useDashboardTopics(modeRef);

  const toggleThemeMode = () => {
    setMode(themeMode === "dark" ? "light" : "dark");
  };

  const {
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
  } = useSearchAutomation(topics);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    const onScroll = () => {
      setShowFloatingStatus(globalThis.scrollY > 260);
    };

    onScroll();
    globalThis.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      globalThis.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    void loadTopics();
  }, [mode, loadTopics]);

  return (
    <Box
      sx={{ flexGrow: 1, bgcolor: "background.default", minHeight: "100vh" }}
    >
      <DashboardHeader
        cooldown={cooldown}
        themeMode={themeMode}
        onToggleTheme={toggleThemeMode}
      />

      <Container maxWidth="md" sx={{ mt: 4, pb: 10 }}>
        <ProgressTracker
          dailyCount={dailyCount}
          dailyGoal={dailyGoal}
          bingStarCount={bingStarCount}
          bingStarGoal={bingStarGoal}
          mode={mode}
        />

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
          canLoadMore={canLoadMore}
          mode={mode}
          onManualSearch={handleManualSearch}
          onLoadMore={() => {
            void loadTopics(true);
          }}
        />
      </Container>

      <FloatingSearchStatus
        open={showFloatingStatus}
        dailyCount={dailyCount}
        dailyGoal={dailyGoal}
        bingStarCount={bingStarCount}
        bingStarGoal={bingStarGoal}
        cooldown={cooldown}
        mode={mode}
        isAutoSearching={isAutoSearching}
        onBackToTop={() => {
          globalThis.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      <HelpFab />
    </Box>
  );
};

export const SearchDashboard: React.FC = () => {
  return (
    <ThemeProvider
      theme={googleTheme}
      defaultMode="system"
      disableTransitionOnChange
    >
      <CssBaseline enableColorScheme />
      <SearchDashboardContent />
    </ThemeProvider>
  );
};
