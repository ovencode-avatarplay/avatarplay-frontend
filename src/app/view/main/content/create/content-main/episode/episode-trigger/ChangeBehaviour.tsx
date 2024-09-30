import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, Box, Typography, IconButton, Select, MenuItem, TextField, SelectChangeEvent } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import styles from './ChangeBehaviour.module.css';
import { useDispatch } from 'react-redux'; // Redux Dispatch 추가
import { updateDataPair } from '@/redux-store/slices/triggerContent';
import { DataPair, MainData, SubData, MainDataA, MainDataB, MainDataC, MainDataD } from '@/types/apps/dataTypes';


interface ChangeBehaviourProps {
    open: boolean;
    onClose: () => void;
    item: DataPair; // DataPair 타입 추가
    index: number; // 배열의 index를 받아서 업데이트에 사용
}

const ChangeBehaviour: React.FC<ChangeBehaviourProps> = ({ open, onClose, item, index }) => {
    const dispatch = useDispatch(); // Redux dispatch 사용
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
                updatedMainData = selectedMainData; // 기존 값을 유지
                break;
        }

        setSelectedMainData(updatedMainData);
    };

    // SubData의 UI 렌더링 함수
    const renderSubDataField = (subData: SubData) => {
        const [selectedSubData, setSelectedSubData] = useState<SubData>(subData); // 선택된 SubData 상태

        // 콤보박스 선택 시 SubData 변경 핸들러
        const handleSubDataChange = (event: SelectChangeEvent<string>) => {
            const newSubDataKey = event.target.value as SubData['key'];
            let newSubData: SubData;

            // 선택된 SubData의 key에 따라 새로운 SubData 생성
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
                    newSubData = subData; // 기존 SubData 유지
                    break;
            }

            // 선택된 SubData를 상태에 저장
            setSelectedSubData(newSubData);

            // item의 sub을 직접 수정하지 않고, 새로운 객체를 만들어 저장
            const updatedItem = {
                ...item, // 기존 item의 프로퍼티들 복사
                sub: newSubData // sub만 새로운 값으로 대체
            };

            // 필요한 경우 updatedItem을 저장하는 로직을 추가하세요 (Redux나 다른 상태관리로 반영)
            console.log('Updated Item:', updatedItem);
        };

        return (
            <Box className={styles.episodeContainer}>
                {/* 상단 공통 Episode Change 레이아웃 */}
                <Box className={styles.episodeChangeRow}>
                    <Box className={styles.icon} /> {/* 왼쪽 이미지 아이콘 */}
                    <Select
                        className={styles.selectBox}
                        value={selectedSubData.key}  // 현재 선택된 SubData의 key
                        onChange={handleSubDataChange} // 콤보박스 변경 시 핸들러
                        variant="outlined"
                    >
                        {/* SubData 옵션들 추가 */}
                        <MenuItem value="actionEpisodeChangeId">Episode Change</MenuItem>
                        <MenuItem value="actionIntimacyPoint">Get Intimacy Point</MenuItem>
                        <MenuItem value="ChangePrompt">Change Prompt</MenuItem>
                    </Select>
                    <IconButton className={styles.rightButton}>
                        <ArrowForwardIos />
                    </IconButton>
                </Box>

                {/* 하단 타입별 레이아웃 */}
                <Box>
                    {(() => {
                        switch (selectedSubData.key) {
                            case 'actionEpisodeChangeId':
                                return (
                                    <Box className={styles.destinationContainer}>
                                        <Typography className={styles.destinationLabel}>Destination Episode</Typography>
                                        <Box className={styles.destinationDetails}>
                                            <Box className={styles.destinationIcon} /> {/* 하단 이미지 아이콘 */}
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
        );
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
                                onChange={handleMainDataChange} // 핸들러 업데이트
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
                        {renderSubDataField(selectedSubData)}
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ChangeBehaviour;
