// 파일 경로: components/SelectTriggerType.tsx

import React, { useState } from 'react';
import { useDispatch } from 'react-redux'; // Redux 디스패치를 사용
import { Dialog, DialogTitle, DialogContent, RadioGroup, FormControlLabel, Radio, IconButton, Box, DialogActions, Button } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { MainData, MainDataA, MainDataB, MainDataC, MainDataD, SubDataB, CoversationData, TriggerSubDataType } from '@/types/apps/dataTypes'; // MainData 및 SubDataB 타입들 임포트
import { addDataPair } from '@/redux-store/slices/triggerContent';

interface SelectTriggerTypeProps {
    open: boolean;
    onClose: () => void;
    triggerName: string; // 전달된 name을 받을 prop
}

const triggerTypes = [
    { label: 'Intimacy', value: 'triggerValueIntimacy' },
    { label: 'Keyword', value: 'triggerValueKeyword' },
    { label: 'Chat Count', value: 'triggerValueChatCount' },
    { label: 'Idle Elapsed Time', value: 'triggerValueTimeMinute' },
];

const SelectTriggerType: React.FC<SelectTriggerTypeProps> = ({ open, onClose, triggerName }) => {
    const [selectedTrigger, setSelectedTrigger] = useState<string>('triggerValueIntimacy'); // 초기 선택값
    const dispatch = useDispatch(); // Redux dispatch 사용

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTrigger(event.target.value); // 선택된 트리거 유형 업데이트
    };

    // MainData를 선택된 trigger에 따라 생성하는 함수
    // MainData를 선택된 trigger에 따라 생성하는 함수
    const createMainData = (): MainData => {
        switch (selectedTrigger) {
            case 'triggerValueIntimacy':
                return { value: 0 } as MainDataA; // Intimacy 타입 MainData
            case 'triggerValueKeyword':
                return { value: ['keyword1', 'keyword2'] } as MainDataB; // Keyword 타입 MainData
            case 'triggerValueChatCount':
                return { value: 0 } as MainDataC; // Chat Count 타입 MainData
            case 'triggerValueTimeMinute':
                return { value: 0 } as MainDataD; // Idle Elapsed Time 타입 MainData
            default:
                return { value: 0 } as MainDataA; // 기본값 Intimacy
        }
    };


    // SubDataB 기본값 생성
    const createSubDataB = (): SubDataB => {
        const defaultConversationData: CoversationData[] = [
            { question: 'Default Question 1', answer: 'Default Answer 1' },
            { question: 'Default Question 2', answer: 'Default Answer 2' },
        ];

        return {
            key: TriggerSubDataType.ChangePrompt,
            value: 'Default Prompt',
            coversationDataList: defaultConversationData,
        };
    };

    // Save 버튼 클릭 시 처리 로직
    const handleSave = () => {
        const mainData = createMainData(); // 선택된 트리거에 맞는 MainData 생성
        const subData = createSubDataB(); // 기본 SubDataB 생성

        // Redux에 데이터 저장
        dispatch(addDataPair({
            name: triggerName, // 부모 컴포넌트에서 전달받은 트리거 이름
            main: mainData,
            sub: subData, // 기본값으로 SubDataB 사용
        }));

        onClose(); // 모달 닫기
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}

            disableAutoFocus={true}
            disableEnforceFocus={true} // disableAutoFocus 대신 사용
        >
            <DialogTitle>Select Trigger Type</DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <p>Trigger Name: {triggerName}</p>
                </Box>
                <RadioGroup value={selectedTrigger} onChange={handleChange}>
                    {triggerTypes.map((trigger) => (
                        <Box key={trigger.value} display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                            <FormControlLabel
                                value={trigger.value}
                                control={<Radio />}
                                label={trigger.label}
                            />
                            <IconButton edge="end" aria-label="info">
                                <InfoIcon />
                            </IconButton>
                        </Box>
                    ))}
                </RadioGroup>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SelectTriggerType;
