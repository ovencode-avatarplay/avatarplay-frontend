// EpisodeConversationTemplate.tsx
import React from 'react';
import styles from './EpisodeConversationTemplate.module.css'; // CSS Module import
import { Dialog, DialogTitle, Button, Box, Card, CardContent } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CardSlider from './CardSlider'; // 카드 슬라이더 import



interface EpisodeConversationTemplateProps {
    open: boolean; // 모달 열림 상태
    closeModal: () => void; // closeModal prop 추가
}

const EpisodeConversationTemplate: React.FC<EpisodeConversationTemplateProps> = ({ open, closeModal }) => {
    return (
        <Dialog
            closeAfterTransition={false}
            open={open}
            onClose={closeModal}
            fullScreen
            classes={{ paper: styles['modal-body'] }}
            disableAutoFocus={true}
            disableEnforceFocus={true} // disableEnforceFocus 속성 사용
        >
            <DialogTitle className={styles['modal-header']}>
                <Button onClick={closeModal} className={styles['close-button']}>
                    <ArrowBackIosIcon />
                </Button>
                <span className={styles['modal-title']}>EpisodeConversationTemplate</span>
            </DialogTitle>

            <CardSlider /> {/* 카드 슬라이더 추가 */}

            <Box className={styles['box-button']}>
                <Button className={styles['button-add']} variant="outlined" onClick={() => { }}>
                    Add Conversation
                </Button>
            </Box>
        </Dialog >
    );
}

export default EpisodeConversationTemplate;
