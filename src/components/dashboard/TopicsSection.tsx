import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";

import { TopicCard } from "./TopicCard";
import type { SearchMode } from "../../hooks/useSearchAutomation";
import type { TrendingTopic } from "../../types";

interface TopicsSectionProps {
  topics: TrendingTopic[];
  loading: boolean;
  isAutoSearching: boolean;
  autoSearchIndex: number;
  cooldown: number;
  isMoreLoading: boolean;
  canLoadMore: boolean;
  mode: SearchMode;
  onManualSearch: (topic: string) => void;
  onLoadMore: () => void;
}

export const TopicsSection: React.FC<TopicsSectionProps> = ({
  topics,
  loading,
  isAutoSearching,
  autoSearchIndex,
  cooldown,
  isMoreLoading,
  canLoadMore,
  mode,
  onManualSearch,
  onLoadMore,
}) => {
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Trending Topics
      </Typography>

      <Grid container spacing={3}>
        {topics.map((topic, index) => (
          <Grid key={`${topic.id}-${index}`} size={{ xs: 12 }}>
            <TopicCard
              topic={topic}
              isAutoSearching={isAutoSearching}
              isActive={isAutoSearching && index === autoSearchIndex}
              isCompleted={index < autoSearchIndex}
              cooldown={cooldown}
              onManualSearch={onManualSearch}
            />
          </Grid>
        ))}
      </Grid>

      {mode === "bing_star" && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <Button
            variant="text"
            startIcon={isMoreLoading ? <CircularProgress size={20} /> : <AddIcon />}
            onClick={onLoadMore}
            disabled={isMoreLoading || isAutoSearching || !canLoadMore}
            sx={{ color: "text.secondary", fontWeight: 500 }}
          >
            {isMoreLoading
              ? "Loading more topics..."
              : canLoadMore
                ? "Load 15 more topics"
                : "Extra topics already loaded"}
          </Button>
        </Box>
      )}
    </Box>
  );
};
