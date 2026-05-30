import { Box, Typography } from '@mui/material';

export default function HealthIndicator({ fighter }) {
    return (
        <Box className="arena___fighter-indicator">
            <Typography className="arena___fighter-name">{fighter.name}</Typography>
            <Box className="arena___health-indicator">
                <Box className="arena___health-bar" />
            </Box>
        </Box>
    );
}
