import { Box, Typography } from '@mui/material';
import { CRITICAL_HIT_COOLDOWN } from '../../constants/fight';

export default function HealthIndicator({ fighter, fighterState }) {
    const healthPercentage = (fighterState.health / fighterState.maxHealth) * 100;
    const healthBarWidth = `${Math.max(healthPercentage, 0)}%`;
    const indicatorClassName = fighterState.isBlockActive
        ? 'arena___fighter-indicator arena___fighter-indicator--blocking'
        : 'arena___fighter-indicator';
    const criticalHitBarClassName = fighterState.isCriticalHitAvailable
        ? 'arena___critical-hit-bar'
        : 'arena___critical-hit-bar arena___critical-hit-bar--cooldown';

    return (
        <Box className={indicatorClassName}>
            <Typography className="arena___fighter-name">{fighter.name}</Typography>
            <Box className="arena___health-indicator">
                <Box className="arena___health-bar" sx={{ width: healthBarWidth }} />
            </Box>
            <Box className="arena___critical-hit-indicator">
                <Box
                    className={criticalHitBarClassName}
                    sx={{ animationDuration: `${CRITICAL_HIT_COOLDOWN}ms` }}
                />
            </Box>
        </Box>
    );
}
