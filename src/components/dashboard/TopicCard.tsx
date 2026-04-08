import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Divider,
  Box,
  IconButton,
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { TrendingTopic } from "../../types";

interface TopicCardProps {
  topic: TrendingTopic;
  isAutoSearching: boolean;
  isActive: boolean;
  isCompleted: boolean;
  cooldown: number;
  onManualSearch: (topic: string) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
  topic,
  isAutoSearching,
  isActive,
  isCompleted,
  cooldown,
  onManualSearch,
}) => {
  return (
    <Card 
      sx={{   
        width: '100%',
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        border: '1px solid #dadce0',
        transition: '0.2s',
        opacity: isCompleted ? 0.5 : 1,
        bgcolor: isActive ? '#e8f0fe' : 'white'
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="caption"
          color="primary"
          sx={{ fontWeight: "bold", textTransform: "uppercase" }}
        >
          Trending Topic
        </Typography>
        <Typography
          variant="h6"
          component="h2"
          sx={{ my: 1, fontSize: "1.1rem", lineHeight: 1.4 }}
        >
          {topic.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Click to perform this search on Bing and earn points.
        </Typography>
      </CardContent>
      <Divider />
      <Box sx={{ p: 1, display: "flex", justifyContent: "flex-end" }}>
        <IconButton
          color="primary"
          onClick={() => onManualSearch(topic.title)}
          disabled={cooldown > 0 || isAutoSearching}
        >
          <OpenInNewIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
};
