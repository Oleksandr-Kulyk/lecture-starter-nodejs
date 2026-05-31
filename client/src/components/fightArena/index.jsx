import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import useFight from '../../hooks/useFight';
import { createFight } from '../../services/domainRequest/fightRequest';
import ArenaFighter from './arenaFighter';
import HealthIndicator from './healthIndicator';
import WinnerModal from './winnerModal';
import './style.css';

export default function FightArena({ firstFighter, secondFighter, onFightEnd }) {
    const { firstFighterState, secondFighterState, winner, log } = useFight(firstFighter, secondFighter);
    const isFightSavedRef = useRef(false);
    const winnerPosition = winner?.id === secondFighter.id ? 'right' : 'left';

    useEffect(() => {
        if (!winner || isFightSavedRef.current) {
            return;
        }

        isFightSavedRef.current = true;

        createFight({
            fighter1: firstFighter.id,
            fighter2: secondFighter.id,
            log
        });
    }, [firstFighter.id, secondFighter.id, winner, log]);

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
            <WinnerModal
                winner={winner}
                winnerPosition={winnerPosition}
                onClose={onFightEnd}
            />
        </Box>
    );
}
