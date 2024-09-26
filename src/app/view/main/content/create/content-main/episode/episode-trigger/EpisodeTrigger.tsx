import React from 'react';
import styles from './EpisodeTrigger.module.css'; // CSS Module import
import { Dialog, DialogContent, DialogTitle, Button, Card, CardContent, Typography, CardActions } from '@mui/material';
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
            <DialogTitle className={styles['modal-header']}>
                <Button onClick={closeModal} className={styles['close-button']}>
                    <ArrowBackIosIcon />
                </Button>
                <span className={styles['modal-title']}>Trigger Setup</span>
            </DialogTitle>
            <DialogContent className={styles['modal-content']}>

                <Card sx={{ minWidth: 275 }}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                            Word of the Day
                        </Typography>
                        <Typography variant="h5" component="div">
                            asdadas
                        </Typography>
                        <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>adjective</Typography>
                        <Typography variant="body2">
                            well meaning and kindly.
                            <br />
                            {'"a benevolent smile"'}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small">Learn More</Button>
                    </CardActions>
                </Card>

            </DialogContent>
        </Dialog>
    );
};

export default EpisodeTrigger;
