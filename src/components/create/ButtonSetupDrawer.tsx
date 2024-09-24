import React from 'react';
import { Button, Typography } from '@mui/material';

interface Props {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ButtonSetupDrawer: React.FC<Props> = ({ icon, label, onClick }) => {
  return (
    <Button className="setup-button" onClick={onClick}>
      {icon}
      <Typography>{label}</Typography>
    </Button>
  );
};

export default ButtonSetupDrawer;
