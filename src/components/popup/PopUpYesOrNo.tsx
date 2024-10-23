import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';

interface PopUpYesOrNoProps {
  title: string;
  question: string;
  onYes: () => void;
  onNo: () => void;
  open: boolean;
}

const PopUpYesOrNo: React.FC<PopUpYesOrNoProps> = ({title, question, onYes, onNo, open}) => {
  return (
    <Dialog open={open} onClose={onNo}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{question}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onNo} color="primary">
          No
        </Button>
        <Button onClick={onYes} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PopUpYesOrNo;
