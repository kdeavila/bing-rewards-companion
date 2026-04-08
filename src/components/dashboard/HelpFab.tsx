import React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import InfoIcon from "@mui/icons-material/InfoOutlined";

export const HelpFab: React.FC = () => {
  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20 }}>
      <Tooltip title="Allow popups for this site to use automation">
        <Fab color="info" size="small">
          <InfoIcon />
        </Fab>
      </Tooltip>
    </Box>
  );
};
