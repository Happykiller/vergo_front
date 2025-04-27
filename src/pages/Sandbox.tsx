// src\pages\Sandbox.tsx
import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Grid2, Typography, Paper, Button } from '@mui/material';

import { FlashMessage, useFlashStore, Input } from '@happykiller/sunny-ui';

export const Sandbox: React.FC = () => {
  const flash = useFlashStore();
  const [input, setInput] = React.useState({ value: '', valid: true });
  const [ite, setIte] = React.useState(0);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Sandbox</Typography>

      <Grid2 container spacing={4}>
        <Grid2
          size={{
            xs: 12,
            md: 6,
          }}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6">FlashMessage</Typography>
            <Button 
              type="submit"
              variant="contained"
              size="small"
              onClick={(e) => { 
                e.preventDefault();
                setIte(ite+1);
                flash.success(`#${ite} Flash success :)`);
              }}
            >Trigger Flash</Button>
            <FlashMessage icons={{ close: <CloseIcon fontSize="small" /> }} />
          </Paper>
        </Grid2>

        <Grid2
          size={{
            xs: 12,
            md: 6,
          }}>
          <Paper elevation={3} style={{ padding: '1rem' }}>
            <Typography variant="h6">Input</Typography>
            <Input
              label="Sandbox Input"
              entity={input}
              onChange={setInput}
              require
              tooltip="Enter something"
            />
          </Paper>
        </Grid2>

      </Grid2>
    </Box>
  );
};
