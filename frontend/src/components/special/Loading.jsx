import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';

export default function Loading() {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            flexDirection="column"
        >
            <CircularProgress size={60} thickness={5} />
            <Typography variant="h6" style={{ marginTop: 20 }}>
                Loading your chart...
            </Typography>
        </Box>
    );
};
