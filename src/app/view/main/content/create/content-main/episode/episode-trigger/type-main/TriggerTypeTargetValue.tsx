// 파일 경로: components/TriggerTypeTargetValue.tsx

import React, { useState } from 'react';
import { Box, Typography, TextField, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import styles from './TriggerTypeTargetValue.module.css'; // CSS 모듈 임포트
import { DataPair, MainData, MainDataA, MainDataB, MainDataC, MainDataD } from '@/types/apps/dataTypes'; // DataPair 타입 임포트

interface TriggerTypeTargetValueProps {
    item: DataPair; // DataPair 타입 추가
}

const TriggerTypeTargetValue: React.FC<TriggerTypeTargetValueProps> = ({ item }) => {
    const [selectedMainData, setSelectedMainData] = useState<MainData>(item.main);

    // MainData의 key 목록 정의
    const mainDataOptions = [
        { label: 'Intimacy', key: 'triggerValueIntimacy' },
        { label: 'Keyword', key: 'triggerValueKeyword' },
        { label: 'Chat Count', key: 'triggerValueChatCount' },
        { label: 'Time (Minutes)', key: 'triggerValueTimeMinute' }
    ];

    // 콤보박스 선택 이벤트 핸들러
    const handleMainDataChange = (event: SelectChangeEvent<string>) => {
        const selectedKey = event.target.value;
        const newMainData: MainData = (() => {
            switch (selectedKey) {
                case 'triggerValueIntimacy':
                    return { key: 'triggerValueIntimacy', value: 0 } as MainDataA;
                case 'triggerValueKeyword':
                    return { key: 'triggerValueKeyword', value: [] } as MainDataB;
                case 'triggerValueChatCount':
                    return { key: 'triggerValueChatCount', value: 0 } as MainDataC;
                case 'triggerValueTimeMinute':
                    return { key: 'triggerValueTimeMinute', value: 0 } as MainDataD;
                default:
                    return item.main;
            }
        })();
        setSelectedMainData(newMainData);
    };

    // 선택된 MainData에 따른 Target Value 필드
    const renderTargetValueField = (mainData: MainData) => {
        switch (mainData.key) {
            case 'triggerValueIntimacy':
            case 'triggerValueChatCount':
            case 'triggerValueTimeMinute':
                return (
                    <TextField
                        className={styles.input}
                        variant="outlined"
                        label="Target Value"
                        type="number"
                        value={mainData.value}
                        onChange={(e) => setSelectedMainData({ ...mainData, value: Number(e.target.value) })}
                    />
                );
            case 'triggerValueKeyword':
                return (
                    <TextField
                        className={styles.input}
                        variant="outlined"
                        label="Target Keywords"
                        value={mainData.value.join(', ')} // 배열을 문자열로 변환하여 표시
                        onChange={(e) => setSelectedMainData({ ...mainData, value: e.target.value.split(',') })}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Box className={styles.container}>
            {/* Trigger Type Section */}
            <Box className={styles.triggerTypeSection}>
                <Typography className={styles.label}>Trigger Type</Typography>
                <div className={styles.topBox}>
                    <Box className={styles.icon} /> {/* 트리거 타입 아이콘 */}
                    <Select
                        className={styles.selectBox}
                        value={selectedMainData.key}
                        onChange={handleMainDataChange}
                        variant="outlined"                    >
                        {mainDataOptions.map(option => (
                            <MenuItem key={option.key} value={option.key}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </div>
            </Box>

            {/* Target Value Section */}
            <Box className={styles.subValueSection}>
                {renderTargetValueField(selectedMainData)}
            </Box>
        </Box>
    );
};

export default TriggerTypeTargetValue;
