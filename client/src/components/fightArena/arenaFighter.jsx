import { Box } from '@mui/material';

const DEFAULT_LEFT_FIGHTER_IMAGE = 'https://media.giphy.com/media/kdHa4JvihB2gM/giphy.gif';
const DEFAULT_RIGHT_FIGHTER_IMAGE = 'https://i.pinimg.com/originals/46/4b/36/464b36a7aecd988e3c51e56a823dbedc.gif';

export default function ArenaFighter({ fighter, position }) {
    const defaultImage = position === 'right' ? DEFAULT_RIGHT_FIGHTER_IMAGE : DEFAULT_LEFT_FIGHTER_IMAGE;
    const image = fighter.source || defaultImage;

    return (
        <Box className={`arena___fighter arena___${position}-fighter`}>
            <img src={image} alt={fighter.name} title={fighter.name} />
        </Box>
    );
}
