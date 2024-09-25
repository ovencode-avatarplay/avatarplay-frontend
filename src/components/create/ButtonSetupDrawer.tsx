import React from 'react';
import Style from './ButtonSetupDrawer.module.css'
import { Button, Typography } from '@mui/material';

interface Props {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

const ButtonSetupDrawer: React.FC<Props> = ({ icon, label, onClick }) => {
  return (
    <Button className={Style.setupButton} onClick={onClick}>
      {icon}
      <Typography>{label}</Typography>
    </Button>
  );
};

export default ButtonSetupDrawer;
