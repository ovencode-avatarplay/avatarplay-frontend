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
  onChange: (value: string, type: ConversationTalkType) => void; // 추가
}

const InputCard: React.FC<InputCardProps> = ({defaultValue, defalutType, onDelete, onChange}) => {
  const [isHeadset, setIsHeadset] = useState(defalutType === ConversationTalkType.Action);

  const toggleIcon = () => {
    setIsHeadset(prev => {
      const newIsHeadset = !prev;
      // 상태가 변경될 때 onChange도 호출
      onChange(defaultValue, newIsHeadset ? ConversationTalkType.Action : ConversationTalkType.Speech);
      return newIsHeadset;
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const talkType = isHeadset ? ConversationTalkType.Action : ConversationTalkType.Speech;
    onChange(e.target.value, talkType);
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
        onChange={handleChange} // 수정된 handleChange 함수 사용
      />
      <IconButton onClick={onDelete}>
        <DeleteForeverIcon />
      </IconButton>
    </Card>
  );
};

export default InputCard;
