import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    Typography,
    IconButton,
    Select,
    MenuItem,
    TextField,
    SelectChangeEvent,
} from '@mui/material';
import { ArrowBackIos } from '@mui/icons-material';
import styles from './ChangeBehaviour.module.css';
import { useDispatch } from 'react-redux';
import { updateDataPair } from '@/redux-store/slices/EpisodeInfo';
import { DataPair, MainData, SubData, TriggerMainDataType, TriggerSubDataType } from '@/types/apps/dataTypes';

interface ChangeBehaviourProps {
    open: boolean;
    onClose: () => void;
    item: DataPair;
}

const ChangeBehaviour: React.FC<ChangeBehaviourProps> = ({ open, onClose, item }) => {
    const dispatch = useDispatch();
    const [selectedMainData, setSelectedMainData] = useState<MainData>(
        item.main || { key: TriggerMainDataType.triggerValueIntimacy, value: 0 }  // 초기값 설정
    );

    const [selectedSubData, setSelectedSubData] = useState<SubData>(
        item.sub || { key: TriggerSubDataType.ChangePrompt, value: '', coversationDataList: [] }  // 초기값 설정
    );


    // SubData 타입에 맞는 기본값을 반환하는 함수
    const getInitialSubData = (key: TriggerSubDataType): SubData => {
        switch (key) {
            case TriggerSubDataType.actionEpisodeChangeId:
                return { key: TriggerSubDataType.actionEpisodeChangeId, value: 0 };
            case TriggerSubDataType.actionIntimacyPoint:
                return { key: TriggerSubDataType.actionIntimacyPoint, value: 0, max_value: 0 };
            case TriggerSubDataType.ChangePrompt:
                return { key: TriggerSubDataType.ChangePrompt, value: '', coversationDataList: [] };
            default:
                throw new Error('Invalid SubData type');
        }
    };

    // MainData 변경 핸들러
    const handleMainDataChange = (event: SelectChangeEvent<TriggerMainDataType>) => {
        const selectedKey = event.target.value as MainData['key'];
        let updatedMainData: MainData;

        switch (selectedKey) {
            case TriggerMainDataType.triggerValueIntimacy:
                updatedMainData = { key: TriggerMainDataType.triggerValueIntimacy, value: 0 };
                break;
            case TriggerMainDataType.triggerValueKeyword:
                updatedMainData = { key: TriggerMainDataType.triggerValueKeyword, value: [] };
                break;
            case TriggerMainDataType.triggerValueChatCount:
                updatedMainData = { key: TriggerMainDataType.triggerValueChatCount, value: 0 };
                break;
            case TriggerMainDataType.triggerValueTimeMinute:
                updatedMainData = { key: TriggerMainDataType.triggerValueTimeMinute, value: 0 };
                break;
            default:
                updatedMainData = selectedMainData;
                break;
        }

        // MainData가 변경될 때 SubData가 유효하지 않으면 기본값으로 초기화
        const subDataOptions = getSubDataOptionsForMainData(selectedKey);
        if (!subDataOptions.some(option => option.key === selectedSubData.key)) {
            setSelectedSubData(getInitialSubData(subDataOptions[0].key));
        }

        setSelectedMainData(updatedMainData);
    };

    // SubData 변경 핸들러
    const handleSubDataChange = (event: SelectChangeEvent<TriggerSubDataType>) => {
        const newSubDataKey = event.target.value as SubData['key'];
        const newSubData = getInitialSubData(newSubDataKey);
        setSelectedSubData(newSubData);
    };

    // MainData에 따라 SubData 옵션을 동적으로 변경하는 함수 (이름 변경)
    const getSubDataOptionsForMainData = (mainDataKey: TriggerMainDataType) => {
        switch (mainDataKey) {
            case TriggerMainDataType.triggerValueIntimacy:
                return [
                    { key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change' },
                    { key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt' },
                ];
            case TriggerMainDataType.triggerValueChatCount:
                return [
                    { key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change' },
                    { key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt' },
                    { key: TriggerSubDataType.actionIntimacyPoint, label: 'Get Intimacy Point' },
                ];
            case TriggerMainDataType.triggerValueKeyword:
                return [
                    { key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change' },
                    { key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt' },
                    { key: TriggerSubDataType.actionIntimacyPoint, label: 'Get Intimacy Point' },
                ];
            case TriggerMainDataType.triggerValueTimeMinute:
                return [
                    { key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt' },
                    { key: TriggerSubDataType.actionIntimacyPoint, label: 'Get Intimacy Point' },
                ];
            default:
                return [
                    { key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt' },
                ];
        }
    };

    // SubData 초기값을 설정하는 useEffect
    useEffect(() => {
        // if (!selectedSubData.key) {
        //     const subDataOptions = getSubDataOptionsForMainData(selectedMainData.key);
        //     if (subDataOptions.length > 0) {
        //         setSelectedSubData(getInitialSubData(subDataOptions[0].key));
        //     }
        // }
        setSelectedSubData(getInitialSubData(TriggerSubDataType.ChangePrompt));
    }, [selectedMainData]);

    // 닫기 버튼 클릭 시 상태 업데이트 후 닫기
    const handleClose = () => {
        const updatedPair = {
            ...item,
            main: selectedMainData,
            sub: selectedSubData,
        };

        dispatch(updateDataPair({ index: updatedPair.id, pair: updatedPair }));

        onClose();
    };

    const renderTargetValueField = (selectedKey: MainData['key']) => {
        switch (selectedKey) {
            case TriggerMainDataType.triggerValueIntimacy:
            case TriggerMainDataType.triggerValueChatCount:
            case TriggerMainDataType.triggerValueTimeMinute:
                return (
                    <TextField
                        className={styles.input}
                        variant="outlined"
                        label="Target Value"
                        type="number"
                        value={typeof selectedMainData.value === 'number' ? selectedMainData.value : 0} // 숫자 값으로 처리
                        onChange={(e) =>
                            setSelectedMainData({
                                key: selectedMainData.key,
                                value: Number(e.target.value), // 숫자로 변환
                            } as MainData)
                        }
                    />
                );
            case TriggerMainDataType.triggerValueKeyword:
                return (
                    <TextField
                        className={styles.input}
                        variant="outlined"
                        label="Target Keywords"
                        value={Array.isArray(selectedMainData.value) ? selectedMainData.value.join(', ') : ''} // 문자열 배열로 처리
                        onChange={(e) => {
                            const keywords = e.target.value.split(',').map((keyword) => keyword.trim());
                            setSelectedMainData({
                                key: selectedMainData.key,
                                value: keywords, // 문자열 배열로 설정
                            } as MainData);
                        }}
                    />
                );
            default:
                return null;
        }
    };


    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            classes={{ paper: styles.modal }}

            disableAutoFocus={true}
            disableEnforceFocus={true} // disableAutoFocus 대신 사용
        >
            <DialogTitle className={styles['modal-header']}>
                <Button onClick={handleClose} className={styles['close-button']}>
                    <ArrowBackIos />
                </Button>
                <span className={styles['modal-title']}>Change Behaviour</span>
            </DialogTitle>
            <DialogContent className={styles.dialogContent}>
                <Box className={styles.container}>
                    <Box className={styles.triggerTypeSection}>
                        <Typography className={styles.label}>Trigger Type</Typography>
                        <div className={styles.topBox}>
                            <Box className={styles.icon} />
                            <Select
                                className={styles.selectBox}
                                value={selectedMainData.key || TriggerMainDataType.triggerValueIntimacy}
                                onChange={handleMainDataChange}
                                variant="outlined"
                            >
                                <MenuItem value={TriggerMainDataType.triggerValueIntimacy}>Intimacy</MenuItem>
                                <MenuItem value={TriggerMainDataType.triggerValueKeyword}>Keyword</MenuItem>
                                <MenuItem value={TriggerMainDataType.triggerValueChatCount}>Chat Count</MenuItem>
                                <MenuItem value={TriggerMainDataType.triggerValueTimeMinute}>Time (Minutes)</MenuItem>
                            </Select>
                        </div>
                    </Box>

                    <Box className={styles.targetValueSection}>
                        {renderTargetValueField(selectedMainData.key)}
                    </Box>
                </Box>

                <Box className={styles.subValueContainer}>
                    <Box className={styles.targetValueSection}>
                        <Typography className={styles.label}>Sub Data</Typography>
                        <Box className={styles.episodeChangeRow}>
                            <Box className={styles.icon} />
                            <Select
                                className={styles.selectBox}
                                value={selectedSubData.key || TriggerSubDataType.ChangePrompt}
                                onChange={handleSubDataChange}
                                variant="outlined"
                            >
                                {getSubDataOptionsForMainData(selectedMainData.key).map(option => (
                                    <MenuItem key={option.key} value={option.key}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            <IconButton className={styles.rightButton}>
                                <ArrowBackIos />
                            </IconButton>
                        </Box>

                        <Box>
                            {(() => {
                                switch (selectedSubData.key) {
                                    case TriggerSubDataType.actionEpisodeChangeId:
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
                                                        <ArrowBackIos />
                                                    </IconButton>
                                                </Box>
                                            </Box>
                                        );
                                    case TriggerSubDataType.actionIntimacyPoint:
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
                                    case TriggerSubDataType.ChangePrompt:
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
                                                        <ArrowBackIos />
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
