import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import TimerIcon from "@mui/icons-material/Timer";
import NorthIcon from "@mui/icons-material/North";

import type { SearchMode } from "../../hooks/useSearchAutomation";

interface FloatingSearchStatusProps {
  open: boolean;
  dailyCount: number;
  dailyGoal: number;
  bingStarCount: number;
  bingStarGoal: number;
  cooldown: number;
  mode: SearchMode;
  isAutoSearching: boolean;
  onBackToTop: () => void;
}

export const FloatingSearchStatus: React.FC<FloatingSearchStatusProps> = ({
  open,
  dailyCount,
  dailyGoal,
  bingStarCount,
  bingStarGoal,
  cooldown,
  mode,
  isAutoSearching,
  onBackToTop,
}) => {
  const count = mode === 'bing_star' ? bingStarCount : dailyCount;
  const goal = mode === 'bing_star' ? bingStarGoal : dailyGoal;
  const progress = Math.min((count / goal) * 100, 100);

  return (
    <Slide direction="up" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={6}
        sx={{
          position: "fixed",
          right: 16,
          bottom: 88,
          width: { xs: "calc(100% - 32px)", sm: 360 },
          p: 2,
          borderRadius: 3,
          zIndex: 1300,
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.25 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {mode === "daily" ? "Daily Points" : "Bing Star"}
          </Typography>
          <Chip
            size="small"
            icon={<TimerIcon />}
            label={cooldown > 0 ? `${cooldown}s` : "Ready"}
            color={cooldown > 0 ? "primary" : "default"}
            variant="outlined"
          />
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Progress: {dailyCount} / {dailyGoal} searches
          {isAutoSearching ? " (running)" : ""}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4, mb: 1.5, bgcolor: "action.hover" }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button size="small" startIcon={<NorthIcon />} onClick={onBackToTop}>
            Back to top
          </Button>
        </Box>
      </Paper>
    </Slide>
  );
};
