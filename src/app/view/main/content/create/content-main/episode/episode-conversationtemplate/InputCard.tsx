import React, { useState } from 'react';
import { Card, IconButton, TextField } from '@mui/material';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import HeadsetIcon from '@mui/icons-material/Headset';
import styles from './InputCard.module.css';

interface InputCardProps {
    defaultValue: string;
    onDelete: () => void;
}

const InputCard: React.FC<InputCardProps> = ({ defaultValue, onDelete }) => {
    const [isHeadset, setIsHeadset] = useState(false);

    // 아이콘을 토글하는 함수
    const toggleIcon = () => {
        setIsHeadset((prev) => !prev);
    };

    return (
        <Card className={styles.rowContent}>
            <IconButton onClick={toggleIcon}>
                {isHeadset ? <HeadsetIcon /> : <PhoneInTalkIcon />}
            </IconButton>
            <TextField
                hiddenLabel
                id="filled-hidden-label-small"
                defaultValue={defaultValue}
                variant="filled"
                size="small"
            />
            <IconButton onClick={onDelete}>
                <DeleteForeverIcon />
            </IconButton>
        </Card>
    );
};

export default InputCard;
