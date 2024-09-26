import React from 'react';
import styles from './EpisodeTrigger.module.css'; // CSS Module import
import { Dialog, DialogContent, DialogTitle, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
interface EpisodeTriggerProps {
    open: boolean; // 모달 열림 상태
    closeModal: () => void; // closeModal prop 추가
}

const EpisodeTrigger: React.FC<EpisodeTriggerProps> = ({ open, closeModal }) => {
    return (
        <Dialog
            open={open}
            onClose={closeModal}
            fullScreen
            classes={{ paper: styles['modal-body'] }} // CSS Module 적용
        >
            <DialogTitle>
                <Button onClick={closeModal} className={styles['close-button']}>
                    <ArrowBackIosIcon></ArrowBackIosIcon>
                </Button>
                <span className={styles['modal-header']}>Modal Title</span>

            </DialogTitle>
            <DialogContent className={styles['modal-content']}>
                <p>Modal Content Goes Here</p>
            </DialogContent>
        </Dialog>
    );
};

export default EpisodeTrigger;
