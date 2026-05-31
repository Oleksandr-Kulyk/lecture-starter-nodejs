import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { getFighterImage } from "./arenaFighter";

export default function WinnerModal({ winner, winnerPosition, onClose }) {
  if (!winner) {
    return null;
  }

  return (
    <Dialog open={Boolean(winner)} onClose={onClose}>
            <DialogTitle sx={{ textAlign: 'center' }}>Winner</DialogTitle>
      <DialogContent className="winner-modal___body">
        <img
          className="winner-modal___image"
          src={getFighterImage(winner, winnerPosition)}
          alt={winner.name}
          title={winner.name}
        />
        <Typography className="winner-modal___name">{winner.name}</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
