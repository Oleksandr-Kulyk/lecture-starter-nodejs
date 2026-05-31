import { useState, useEffect } from 'react';
import { Box, Button, Divider, Paper, Stack, Typography } from '@mui/material';
import { getFighters } from '../../services/domainRequest/fightersRequest';
import { getFights } from '../../services/domainRequest/fightRequest';
import NewFighter from '../newFighter';
import Fighter from '../fighter';
import FightArena from '../fightArena';

export default function Fight({ onArenaVisibleChange }) {
    const [fighters, setFighters] = useState([]);
    const [fighter1, setFighter1] = useState(null);
    const [fighter2, setFighter2] = useState(null);
    const [fights, setFights] = useState([]);
    const [isArenaVisible, setIsArenaVisible] = useState(false);

    const loadFights = async () => {
        const data = await getFights();

        if (data && !data.error) {
            setFights(data);
        }
    };

    useEffect(() => {
        getFighters().then((data) => {
            if (data && !data.error) {
                setFighters(data);
            }
        });
        loadFights();
    }, []);

    useEffect(() => {
        onArenaVisibleChange?.(isArenaVisible);
    }, [isArenaVisible, onArenaVisibleChange]);

    const onCreate = (fighter) => {
        setFighters((prev) => [...prev, fighter]);
    };

    const fighter1List = fighter2 ? fighters.filter((f) => f.id !== fighter2.id) : fighters;
    const fighter2List = fighter1 ? fighters.filter((f) => f.id !== fighter1.id) : fighters;
    const getFighterName = (id) => {
        return fighters.find((fighter) => fighter.id === id)?.name || id;
    };
    const getWinnerId = (fight) => {
        const lastLogItem = fight.log.at(-1);

        if (!lastLogItem) {
            return null;
        }

        return lastLogItem.fighter1Health <= 0 ? fight.fighter2 : fight.fighter1;
    };
    const formatFightDate = (date) => {
        return date ? new Date(date).toLocaleString() : '';
    };

    if (isArenaVisible) {
        return (
            <FightArena
                firstFighter={fighter1}
                secondFighter={fighter2}
                onFightEnd={() => {
                    setIsArenaVisible(false);
                    loadFights();
                }}
            />
        );
    }

    return (
        <Box sx={{ mt: 4 }}>
            <NewFighter onCreated={onCreate} />
            <Paper elevation={2} sx={{ width: '70%', mx: 'auto', mt: 3, display: 'flex', alignItems: 'flex-start' }}>
                <Fighter selectedFighter={fighter1} onFighterSelect={setFighter1} fightersList={fighter1List} />
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, pt: 2 }}>
                    <Button
                        variant="contained"
                        color="secondary"
                        disabled={!fighter1 || !fighter2}
                        onClick={() => setIsArenaVisible(true)}
                    >
                        Start Fight
                    </Button>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Fighter selectedFighter={fighter2} onFighterSelect={setFighter2} fightersList={fighter2List} />
            </Paper>
            <Paper elevation={2} sx={{ width: '70%', mx: 'auto', mt: 3, p: 2, textAlign: 'left' }}>
                <Typography variant="h6" align="center" gutterBottom>Fight History</Typography>
                {fights.length === 0 ? (
                    <Typography variant="body2" align="center">No fights yet</Typography>
                ) : (
                    <Stack spacing={1}>
                        {[...fights].reverse().map((fight) => {
                            const winnerId = getWinnerId(fight);

                            return (
                                <Box key={fight.id} sx={{ borderBottom: '1px solid #e5e4e7', pb: 1 }}>
                                    <Typography variant="subtitle2">
                                        {getFighterName(fight.fighter1)} vs {getFighterName(fight.fighter2)}
                                    </Typography>
                                    <Typography variant="body2">
                                        Winner: {winnerId ? getFighterName(winnerId) : 'Unknown'}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {formatFightDate(fight.createdAt)}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Stack>
                )}
            </Paper>
        </Box>
    );
}
