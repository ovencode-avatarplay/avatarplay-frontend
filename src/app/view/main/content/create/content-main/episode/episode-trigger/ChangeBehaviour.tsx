// 파일 경로: components/ChangeBehaviour.tsx

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import styles from './ChangeBehaviour.module.css'; // CSS 모듈 임포트
import { ArrowBackIos } from '@mui/icons-material';
import { DataPair } from '@/types/apps/dataTypes'; // DataPair 타입 임포트
import TriggerTypeTargetValue from './type-main/TriggerTypeTargetValue'


interface ChangeBehaviourProps {
    open: boolean;
    onClose: () => void;
    item: DataPair; // DataPair 타입 추가
}

const ChangeBehaviour: React.FC<ChangeBehaviourProps> = ({ open, onClose, item }) => {
    return (
        <Dialog fullScreen open={open} onClose={onClose} classes={{ paper: styles.modal }}>
            <DialogTitle className={styles['modal-header']}>
                <Button onClick={onClose} className={styles['close-button']}>
                    <ArrowBackIos />
                </Button>
                <span className={styles['modal-title']}>Change Behaviour</span>
            </DialogTitle>
            <DialogContent>
                <TriggerTypeTargetValue />
            </DialogContent>
        </Dialog>
    );
};

export default ChangeBehaviour;
