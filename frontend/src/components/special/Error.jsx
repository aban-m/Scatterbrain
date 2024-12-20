import React from 'react';
import { Button, Typography, Container } from '@mui/material';

const Error = () => {
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <Container
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                backgroundColor: '#f5f5f5',
                textAlign: 'center'
            }}
        >
            <Typography variant="h4" color="error" gutterBottom>
                Something went wrong!
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
                Please try reloading the page.
            </Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={handleReload}
                style={{ marginTop: '20px' }}
            >
                Reload
            </Button>
        </Container>
    );
};

export default Error;
