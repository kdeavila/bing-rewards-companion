import React from "react";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import AddIcon from "@mui/icons-material/Add";

import { TopicCard } from "./TopicCard";
import type { TrendingTopic } from "../../types";

interface TopicsSectionProps {
  topics: TrendingTopic[];
  loading: boolean;
  isAutoSearching: boolean;
  autoSearchIndex: number;
  cooldown: number;
  isMoreLoading: boolean;
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
  onManualSearch,
  onLoadMore,
}) => {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={8}>
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

      <Box display="flex" justifyContent="center" mt={6}>
        <Button
          variant="text"
          startIcon={isMoreLoading ? <CircularProgress size={20} /> : <AddIcon />}
          onClick={onLoadMore}
          disabled={isMoreLoading || isAutoSearching}
          sx={{ color: "text.secondary", fontWeight: 500 }}
        >
          {isMoreLoading ? "Loading more topics..." : "Load more searches"}
        </Button>
      </Box>
    </Box>
  );
};
