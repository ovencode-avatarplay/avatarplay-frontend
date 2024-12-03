import React, {useState} from 'react';
import {Card, IconButton, TextField} from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HeadsetIcon from '@mui/icons-material/Headset';
import styles from './InputCard.module.css';
import {ConversationTalkType} from '@/types/apps/DataTypes';

interface InputCardProps {
  defaultValue: string;
  defalutType: ConversationTalkType;
  onDelete: () => void;
  onChange: (value: string, type: ConversationTalkType) => void;
}

const InputCard: React.FC<InputCardProps> = ({defaultValue, defalutType, onDelete, onChange}) => {
  const [isHeadset, setIsHeadset] = useState(defalutType === ConversationTalkType.Action);
  const [value, setValue] = useState(defaultValue);

  const toggleIcon = () => {
    setIsHeadset(prev => {
      const newIsHeadset = !prev;
      onChange(value, newIsHeadset ? ConversationTalkType.Action : ConversationTalkType.Speech);
      return newIsHeadset;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    const talkType = isHeadset ? ConversationTalkType.Action : ConversationTalkType.Speech;
    onChange(newValue, talkType);
  };

  return (
    <Card className={styles.rowContent}>
      <IconButton onClick={toggleIcon}>{isHeadset ? <HeadsetIcon /> : <PhoneInTalkIcon />}</IconButton>
      <TextField
        hiddenLabel
        id="filled-hidden-label-small"
        value={value}
        variant="filled"
        size="small"
        onChange={handleChange}
        autoFocus // 포커스를 유지하려면 autoFocus 속성을 추가
      />
      <IconButton onClick={onDelete}>
        <DeleteForeverIcon />
      </IconButton>
    </Card>
  );
};

export default InputCard;
