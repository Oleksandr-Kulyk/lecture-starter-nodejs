import { Box } from '@mui/material';
import useFight from '../../hooks/useFight';
import ArenaFighter from './arenaFighter';
import HealthIndicator from './healthIndicator';
import './style.css';

export default function FightArena({ firstFighter, secondFighter }) {
    const { firstFighterState, secondFighterState } = useFight(firstFighter, secondFighter);

    return (
        <Box className="arena___root">
            <Box className="arena___fight-status">
                <HealthIndicator fighter={firstFighter} fighterState={firstFighterState} />
                <Box className="arena___versus-sign">VS</Box>
                <HealthIndicator fighter={secondFighter} fighterState={secondFighterState} />
            </Box>
            <Box className="arena___battlefield">
                <ArenaFighter fighter={firstFighter} position="left" />
                <ArenaFighter fighter={secondFighter} position="right" />
            </Box>
        </Box>
    );
}
