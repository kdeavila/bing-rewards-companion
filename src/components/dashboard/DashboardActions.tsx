import React from "react";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
import RefreshIcon from "@mui/icons-material/Refresh";
import PlayIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import DeleteIcon from "@mui/icons-material/DeleteSweep";
import InfoIcon from "@mui/icons-material/InfoOutlined";
import type { SearchMode } from "../../hooks/useSearchAutomation";

interface DashboardActionsProps {
  loading: boolean;
  cooldown: number;
  isAutoSearching: boolean;
  hasTopics: boolean;
  mode: SearchMode;
  onStartAutoSearch: () => void;
  onStopAutoSearch: () => void;
  onRefreshTopics: () => void;
  onSwitchMode: (mode: SearchMode) => void;
  onReset: () => void;
}

export const DashboardActions: React.FC<DashboardActionsProps> = ({
  loading,
  cooldown,
  isAutoSearching,
  hasTopics,
  mode,
  onStartAutoSearch,
  onStopAutoSearch,
  onRefreshTopics,
  onSwitchMode,
  onReset,
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, mb: 4, alignItems: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={(_, newMode) => newMode && onSwitchMode(newMode as SearchMode)}
          disabled={isAutoSearching}
          size="small"
        >
          <ToggleButton value="daily" sx={{ px: 3 }}>Daily Points (60pts)</ToggleButton>
          <ToggleButton value="bing_star" sx={{ px: 3 }}>Bing Star (Monthly Bonus)</ToggleButton>
        </ToggleButtonGroup>
        
        <Tooltip title={mode === 'daily' ? "Standard search for daily points (60pts goal)." : "Slow, authentic searches to help reach the 2100 monthly bonus goal."}>
          <InfoIcon color="info" />
        </Tooltip>
      </Box>

      <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
        {!isAutoSearching ? (
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayIcon />}
            onClick={onStartAutoSearch}
            disabled={loading || cooldown > 0 || !hasTopics}
            sx={{ px: 4, borderRadius: 2 }}
          >
            Start {mode === 'daily' ? 'Daily' : 'Bing Star'} Automation
          </Button>
        ) : (
          <Button
            variant="outlined"
            size="large"
            color="error"
            startIcon={<StopIcon />}
            onClick={onStopAutoSearch}
            sx={{ px: 4, borderRadius: 2 }}
          >
            Stop Automation
          </Button>
        )}
        
        <Button
          variant="outlined"
          size="large"
          startIcon={<RefreshIcon />}
          onClick={onRefreshTopics}
          disabled={loading || isAutoSearching}
          sx={{ borderRadius: 2 }}
        >
          Refresh Topics
        </Button>

        <Tooltip title="Reset daily progress">
          <IconButton 
            onClick={onReset} 
            disabled={isAutoSearching}
            color="warning"
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

