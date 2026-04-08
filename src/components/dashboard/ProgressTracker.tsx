import React from 'react';
import Box from '@mui/material/Box';
import { Paper, Typography, LinearProgress } from '@mui/material';

interface ProgressTrackerProps {
  dailyCount: number;
  dailyGoal: number;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ dailyCount, dailyGoal }) => {
  const progress = (dailyCount / dailyGoal) * 100;

  return (
    <Paper elevation={0} sx={{ p: 3, mb: 4, border: '1px solid #dadce0', borderRadius: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1" color="text.secondary">
          Daily Goal: {dailyCount} / {dailyGoal} searches
        </Typography>
        <Typography variant="subtitle2" color={progress >= 100 ? "success.main" : "primary.main"}>
          {Math.round(progress)}% Complete
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={Math.min(progress, 100)} 
        sx={{ height: 10, borderRadius: 5, bgcolor: '#e8eaed' }}
      />
    </Paper>
  );
};
