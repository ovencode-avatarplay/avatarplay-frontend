// 파일 경로: components/TriggerTypeTargetValue.tsx

import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';
import styles from './TriggerTypeTargetValue.module.css'; // CSS 모듈 임포트
import AddRoadIcon from '@mui/icons-material/AddRoad';

const TriggerTypeTargetValue: React.FC = () => {
    return (
        <Box className={styles.container}>
            {/* Trigger Type Section */}
            <Box className={styles.triggerTypeSection}>
                <Typography className={styles.label}>Trigger Type</Typography>
                <div className={styles.topBox}>
                    <Box className={styles.icon} /> {/* 트리거 타입 아이콘 */}
                    <Box className={styles.triggerTypeBox}>
                        <Typography className={styles.triggerTypeText}>Intimacy</Typography>
                        <Box className={styles.triggerTypeButton}></Box> {/* 오른쪽 버튼 */}
                    </Box>
                </div>
            </Box>

            {/* Target Value Section */}
            <Box className={styles.targetValueSection}>
                <Typography className={styles.label}>Target Value</Typography>


                <TextField
                    className={styles.input}
                    variant="outlined"
                    value={60} // 기본값 설정
                />

            </Box>
        </Box>
    );
};

export default TriggerTypeTargetValue;
