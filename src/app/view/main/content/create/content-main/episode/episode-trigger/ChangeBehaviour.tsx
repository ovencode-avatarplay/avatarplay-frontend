// 파일 경로: components/ChangeBehaviour.tsx

import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box } from '@mui/material';
import styles from './ChangeBehaviour.module.css'; // CSS 모듈 임포트
import { ArrowBackIos } from '@mui/icons-material';

interface ChangeBehaviourProps {
    open: boolean;
    onClose: () => void;
}

const ChangeBehaviour: React.FC<ChangeBehaviourProps> = ({ open, onClose }) => {
    return (
        <Dialog fullScreen open={open} onClose={onClose} classes={{ paper: styles.modal }}>

            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ChangeBehaviour;
