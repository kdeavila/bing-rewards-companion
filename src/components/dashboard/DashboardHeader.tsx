import React from "react";
import AppBar from "@mui/material/AppBar";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import TimerIcon from "@mui/icons-material/Timer";
import TrophyIcon from "@mui/icons-material/EmojiEvents";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

interface DashboardHeaderProps {
  cooldown: number;
  themeMode: "light" | "dark";
  onToggleTheme: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  cooldown,
  themeMode,
  onToggleTheme,
}) => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
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
        <Tooltip title={themeMode === "light" ? "Activar modo oscuro" : "Activar modo claro"}>
          <IconButton onClick={onToggleTheme} color="inherit" sx={{ mr: 1 }}>
            {themeMode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Tooltip>
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
