import React, {useState} from 'react';
import {Card, IconButton, TextField} from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HeadsetIcon from '@mui/icons-material/Headset';
import styles from './InputCard.module.css';

interface InputCardProps {
  defaultValue: string;
  onDelete: () => void;
  onChange: (value: string) => void; // 추가
}

const InputCard: React.FC<InputCardProps> = ({defaultValue, onDelete, onChange}) => {
  const [isHeadset, setIsHeadset] = useState(false);

  const toggleIcon = () => {
    setIsHeadset(prev => !prev);
  };

  return (
    <Card className={styles.rowContent}>
      <IconButton onClick={toggleIcon}>{isHeadset ? <HeadsetIcon /> : <PhoneInTalkIcon />}</IconButton>
      <TextField
        hiddenLabel
        id="filled-hidden-label-small"
        defaultValue={defaultValue}
        variant="filled"
        size="small"
        onChange={e => onChange(e.target.value)} // 텍스트 변경 시 부모로 값 전달
      />
      <IconButton onClick={onDelete}>
        <DeleteForeverIcon />
      </IconButton>
    </Card>
  );
};

export default InputCard;
