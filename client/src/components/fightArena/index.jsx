import { Box } from '@mui/material';
import ArenaFighter from './arenaFighter';
import HealthIndicator from './healthIndicator';
import './style.css';

export default function FightArena({ firstFighter, secondFighter }) {
    return (
        <Box className="arena___root">
            <Box className="arena___fight-status">
                <HealthIndicator fighter={firstFighter} />
                <Box className="arena___versus-sign">VS</Box>
                <HealthIndicator fighter={secondFighter} />
            </Box>
            <Box className="arena___battlefield">
                <ArenaFighter fighter={firstFighter} position="left" />
                <ArenaFighter fighter={secondFighter} position="right" />
            </Box>
        </Box>
    );
}
