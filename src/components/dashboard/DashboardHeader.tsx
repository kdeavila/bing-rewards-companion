import React from "react";
import { AppBar, Toolbar, Typography, Chip } from "@mui/material";
import TimerIcon from "@mui/icons-material/Timer";
import TrophyIcon from "@mui/icons-material/EmojiEvents";

interface DashboardHeaderProps {
  cooldown: number;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ cooldown }) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: "1px solid #dadce0",
        bgcolor: "white",
        color: "text.primary",
      }}
    >
      <Toolbar>
        <TrophyIcon sx={{ mr: 2, color: "#fbbc05" }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, fontWeight: 500, letterSpacing: -0.5 }}
        >
          Rewards Companion
        </Typography>
        <Chip
          icon={<TimerIcon />}
          label={cooldown > 0 ? `${cooldown}s` : "Ready"}
          color={cooldown > 0 ? "primary" : "secondary"}
          variant="outlined"
          sx={{ fontWeight: "bold" }}
        />
      </Toolbar>
    </AppBar>
  );
};
