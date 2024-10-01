import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box, Typography, IconButton, Select, MenuItem, TextField, SelectChangeEvent } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import styles from './ChangeBehaviour.module.css';
import { useDispatch } from 'react-redux';
import { updateDataPair } from '@/redux-store/slices/triggerContent';
import { DataPair, MainData, SubData, MainDataA, MainDataB, MainDataC, MainDataD } from '@/types/apps/dataTypes';

interface ChangeBehaviourProps {
    open: boolean;
    onClose: () => void;
    item: DataPair;
    index: number;
}

const ChangeBehaviour: React.FC<ChangeBehaviourProps> = ({ open, onClose, item, index }) => {
    const dispatch = useDispatch();
    const [selectedMainData, setSelectedMainData] = useState<MainData>(item.main);
    const [selectedSubData, setSelectedSubData] = useState<SubData>(item.sub);

    // MainData 변경 핸들러
    const handleMainDataChange = (event: SelectChangeEvent<string>) => {
        const selectedKey = event.target.value as MainData['key'];
        let updatedMainData: MainData;

        switch (selectedKey) {
            case 'triggerValueIntimacy':
                updatedMainData = { key: 'triggerValueIntimacy', value: 0 } as MainDataA;
                break;
            case 'triggerValueKeyword':
                updatedMainData = { key: 'triggerValueKeyword', value: [] } as MainDataB;
                break;
            case 'triggerValueChatCount':
                updatedMainData = { key: 'triggerValueChatCount', value: 0 } as MainDataC;
                break;
            case 'triggerValueTimeMinute':
                updatedMainData = { key: 'triggerValueTimeMinute', value: 0 } as MainDataD;
                break;
            default:
                updatedMainData = selectedMainData;
                break;
        }

        setSelectedMainData(updatedMainData);
    };

    // SubData 변경 핸들러
    const handleSubDataChange = (event: SelectChangeEvent<string>) => {
        const newSubDataKey = event.target.value as SubData['key'];
        let newSubData: SubData;

        switch (newSubDataKey) {
            case 'actionEpisodeChangeId':
                newSubData = { key: 'actionEpisodeChangeId', value: 0 };
                break;
            case 'actionIntimacyPoint':
                newSubData = { key: 'actionIntimacyPoint', value: 0, max_value: 0 };
                break;
            case 'ChangePrompt':
                newSubData = { key: 'ChangePrompt', value: '', coversationDataList: [] };
                break;
            default:
                newSubData = selectedSubData;
                break;
        }

        setSelectedSubData(newSubData);

        // item.sub을 업데이트
        const updatedItem = {
            ...item,
            sub: newSubData
        };

        console.log('Updated Item:', updatedItem); // 필요하면 Redux로 바로 저장할 수 있음
    };

    // MainData에 따라 SubData 옵션을 동적으로 변경하는 함수
    const getSubDataOptions = () => {
        switch (selectedMainData.key) {
            case 'triggerValueIntimacy':
                return [
                    { key: 'actionEpisodeChangeId', label: 'Episode Change' },
                    { key: 'ChangePrompt', label: 'Change Prompt' }
                ];
            case 'triggerValueChatCount':
                return [
                    { key: 'actionEpisodeChangeId', label: 'Episode Change' },
                    { key: 'ChangePrompt', label: 'Change Prompt' },
                    { key: 'actionIntimacyPoint', label: 'Get Intimacy Point' }
                ];
            case 'triggerValueKeyword':
                return [
                    { key: 'actionEpisodeChangeId', label: 'Episode Change' },
                    { key: 'ChangePrompt', label: 'Change Prompt' },
                    { key: 'actionIntimacyPoint', label: 'Get Intimacy Point' }
                ];
            case 'triggerValueTimeMinute':
                return [
                    { key: 'ChangePrompt', label: 'Change Prompt' },
                    { key: 'actionIntimacyPoint', label: 'Get Intimacy Point' }
                ];
            default:
                return [];
        }
    };

    // 닫기 버튼 클릭 시 상태 업데이트 후 닫기
    const handleClose = () => {
        const updatedPair = {
            ...item,
            main: selectedMainData,
            sub: selectedSubData
        };

        // Redux에 업데이트 액션 디스패치
        dispatch(updateDataPair({ index, pair: updatedPair }));

        // 모달 닫기
        onClose();
    };

    return (
        <Dialog fullScreen open={open} onClose={onClose} classes={{ paper: styles.modal }}>
            <DialogTitle className={styles['modal-header']}>
                <Button onClick={handleClose} className={styles['close-button']}>
                    <ArrowBackIos />
                </Button>
                <span className={styles['modal-title']}>Change Behaviour</span>
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
                {/* MainData UI */}
                <Box className={styles.container}>
                    <Box className={styles.triggerTypeSection}>
                        <Typography className={styles.label}>Trigger Type</Typography>
                        <div className={styles.topBox}>
                            <Box className={styles.icon} />
                            <Select
                                className={styles.selectBox}
                                value={selectedMainData.key}
                                onChange={handleMainDataChange}
                                variant="outlined"
                            >
                                <MenuItem value="triggerValueIntimacy">Intimacy</MenuItem>
                                <MenuItem value="triggerValueKeyword">Keyword</MenuItem>
                                <MenuItem value="triggerValueChatCount">Chat Count</MenuItem>
                                <MenuItem value="triggerValueTimeMinute">Time (Minutes)</MenuItem>
                            </Select>
                        </div>
                    </Box>

                    {/* MainData에 따른 Target Value 필드 */}
                    <Box className={styles.targetValueSection}>
                        {/* 선택된 MainData의 Target Value 필드 */}
                    </Box>
                </Box>

                {/* SubData UI */}
                <Box className={styles.subValueContainer}>
                    <Box className={styles.targetValueSection}>
                        <Typography className={styles.label}>Sub Data</Typography>
                        <Box className={styles.episodeChangeRow}>
                            <Box className={styles.icon} /> {/* 왼쪽 이미지 아이콘 */}
                            <Select
                                className={styles.selectBox}
                                value={selectedSubData.key}
                                onChange={handleSubDataChange}
                                variant="outlined"
                            >
                                {/* MainData에 따른 SubData 옵션들을 렌더링 */}
                                {getSubDataOptions().map(option => (
                                    <MenuItem key={option.key} value={option.key}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            <IconButton className={styles.rightButton}>
                                <ArrowForwardIos />
                            </IconButton>
                        </Box>

                        {/* SubData 타입에 따른 UI */}
                        <Box>
                            {(() => {
                                switch (selectedSubData.key) {
                                    case 'actionEpisodeChangeId':
                                        return (
                                            <Box className={styles.destinationContainer}>
                                                <Typography className={styles.destinationLabel}>Destination Episode</Typography>
                                                <Box className={styles.destinationDetails}>
                                                    <Box className={styles.destinationIcon} />
                                                    <Box>
                                                        <Typography className={styles.chapter}>Chapter.1</Typography>
                                                        <Typography className={styles.episode}>Ep.2 Wanna go out?</Typography>
                                                    </Box>
                                                    <IconButton className={styles.rightButton}>
                                                        <ArrowForwardIos />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        );
                                    case 'actionIntimacyPoint':
                                        return (
                                            <Box className={styles.intimacyContainer}>
                                                <Typography className={styles.label}>Get Point</Typography>
                                                <TextField
                                                    className={styles.input}
                                                    variant="outlined"
                                                    value={selectedSubData.value}
                                                    onChange={(e) => setSelectedSubData({ ...selectedSubData, value: Number(e.target.value) })}
                                                />
                                                <Typography className={styles.label}>Max Repetition Count</Typography>
                                                <TextField
                                                    className={styles.input}
                                                    variant="outlined"
                                                    value={selectedSubData.max_value}
                                                    onChange={(e) => setSelectedSubData({ ...selectedSubData, max_value: Number(e.target.value) })}
                                                />
                                            </Box>
                                        );
                                    case 'ChangePrompt':
                                        return (
                                            <Box className={styles.promptContainer}>
                                                <Typography className={styles.label}>Prompt Description</Typography>
                                                <TextField
                                                    className={styles.input}
                                                    variant="outlined"
                                                    value={selectedSubData.value}
                                                    onChange={(e) => setSelectedSubData({ ...selectedSubData, value: e.target.value })}
                                                />
                                                <Typography className={styles.label}>Guide Preset (Optional)</Typography>
                                                <Box className={styles.conversationTemplate}>
                                                    <IconButton className={styles.rightButton}>
                                                        <ArrowForwardIos />
                                                    </IconButton>
                                                    <Typography className={styles.conversationLabel}>Conversation Template</Typography>
                                                </Box>
                                            </Box>
                                        );
                                    default:
                                        return null;
                                }
                            })()}
                        </Box>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeBehaviour;
