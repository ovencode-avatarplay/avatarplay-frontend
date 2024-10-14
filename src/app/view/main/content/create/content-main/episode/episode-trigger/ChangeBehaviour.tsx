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
import { updateTriggerInfo } from '@/redux-store/slices/EpisodeInfo';
import { TriggerMainDataType, TriggerSubDataType } from '@/types/apps/dataTypes';
import { TriggerInfo } from '@/types/apps/content/episode/triggerInfo';

interface ChangeBehaviourProps {
    open: boolean;
    onClose: () => void;
    item: TriggerInfo;
}

const ChangeBehaviour: React.FC<ChangeBehaviourProps> = ({ open, onClose, item }) => {
    const dispatch = useDispatch();
    const [triggerInfo, setTriggerInfo] = useState<TriggerInfo>({
        ...item,
        triggerType: item.triggerType || TriggerMainDataType.triggerValueIntimacy,
        actionChangePrompt: item.actionChangePrompt || '',
        actionCoversationList: item.actionCoversationList || [],
    });

    const handleMainDataChange = (event: SelectChangeEvent<number>) => {
        const selectedTriggerType = event.target.value as TriggerMainDataType;
        setTriggerInfo((prev) => ({
            ...prev,
            triggerType: selectedTriggerType,
        }));

        // MainData 변경 시 SubData 유효성 검증 후 초기화
        const subDataOptions = getSubDataOptionsForMainData(selectedTriggerType);
        if (!subDataOptions.some(option => option.key === triggerInfo.triggerActionType)) {
            setTriggerInfo((prev) => ({
                ...prev,
                triggerActionType: subDataOptions[0].key,
                actionChangePrompt: '',
                actionIntimacyPoint: 0,
                actionCoversationList: [],
            }));
        }
    };

    const handleSubDataChange = (event: SelectChangeEvent<number>) => {
        const selectedSubType = event.target.value as TriggerSubDataType;
        setTriggerInfo((prev) => ({
            ...prev,
            triggerActionType: selectedSubType,
        }));
    };

    const getSubDataOptionsForMainData = (mainDataKey: TriggerMainDataType) => {
        switch (mainDataKey) {
            case TriggerMainDataType.triggerValueIntimacy:
                return [
                    { key: TriggerSubDataType.actionEpisodeChangeId, label: 'Episode Change' },
                    { key: TriggerSubDataType.ChangePrompt, label: 'Change Prompt' },
                ];
            case TriggerMainDataType.triggerValueChatCount:
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

    useEffect(() => {
        // 트리거가 변경될 때 SubData 초기화
        const subDataOptions = getSubDataOptionsForMainData(triggerInfo.triggerType);
        if (subDataOptions.length > 0 && !subDataOptions.some(option => option.key === triggerInfo.triggerActionType)) {
            setTriggerInfo((prev) => ({
                ...prev,
                triggerActionType: subDataOptions[0].key,
            }));
        }
    }, [triggerInfo.triggerType]);

    const handleClose = () => {
        dispatch(updateTriggerInfo({ id: triggerInfo.id, info: { ...triggerInfo } }));
        onClose();
    };

    const renderTargetValueField = (triggerType: TriggerMainDataType) => {
        switch (triggerType) {
            case TriggerMainDataType.triggerValueIntimacy:
            case TriggerMainDataType.triggerValueChatCount:
            case TriggerMainDataType.triggerValueTimeMinute:
                return (
                    <TextField
                        className={styles.input}
                        variant="outlined"
                        label="Target Value"
                        type="number"
                        value={triggerInfo.triggerValueIntimacy || 0}
                        onChange={(e) =>
                            setTriggerInfo((prev) => ({
                                ...prev,
                                triggerValueIntimacy: Number(e.target.value),
                            }))
                        }
                    />
                );
            case TriggerMainDataType.triggerValueKeyword:
                return (
                    <TextField
                        className={styles.input}
                        variant="outlined"
                        label="Target Keywords"
                        value={triggerInfo.triggerValueKeyword || ''}
                        onChange={(e) => {
                            setTriggerInfo((prev) => ({
                                ...prev,
                                triggerValueKeyword: e.target.value,
                            }));
                        }}
                    />
                );
            default:
                return null;
        }
    };

    const renderSubDataFields = (triggerActionType: TriggerSubDataType) => {
        switch (triggerActionType) {
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
                            value={triggerInfo.actionIntimacyPoint}
                            onChange={(e) => setTriggerInfo((prev) => ({
                                ...prev,
                                actionIntimacyPoint: Number(e.target.value),
                            }))}
                        />
                        <Typography className={styles.label}>Max Repetition Count</Typography>
                        <TextField
                            className={styles.input}
                            variant="outlined"
                            value={triggerInfo.maxIntimacyCount}
                            onChange={(e) => setTriggerInfo((prev) => ({
                                ...prev,
                                maxIntimacyCount: Number(e.target.value),
                            }))}
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
                            value={triggerInfo.actionChangePrompt}
                            onChange={(e) => setTriggerInfo((prev) => ({
                                ...prev,
                                actionChangePrompt: e.target.value,
                            }))}
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
    };

    return (
        <Dialog
            fullScreen
            open={open}
            onClose={onClose}
            classes={{ paper: styles.modal }}
            disableAutoFocus
            disableEnforceFocus
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
                                value={triggerInfo.triggerType}
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
                        {renderTargetValueField(triggerInfo.triggerType)}
                    </Box>
                </Box>

                <Box className={styles.subValueContainer}>
                    <Box className={styles.targetValueSection}>
                        <Typography className={styles.label}>Sub Data</Typography>
                        <Box className={styles.episodeChangeRow}>
                            <Box className={styles.icon} />
                            <Select
                                className={styles.selectBox}
                                value={triggerInfo.triggerActionType}
                                onChange={handleSubDataChange}
                                variant="outlined"
                            >
                                {getSubDataOptionsForMainData(triggerInfo.triggerType).map(option => (
                                    <MenuItem key={option.key} value={option.key}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </Select>
                            <IconButton className={styles.rightButton}>
                                <ArrowBackIos />
                            </IconButton>
                        </Box>
                        {renderSubDataFields(triggerInfo.triggerActionType)}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeBehaviour;
