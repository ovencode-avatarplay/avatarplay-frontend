// 파일 경로: components/WriteTriggerName.tsx

import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Button, TextField, DialogActions } from '@mui/material';

interface WriteTriggerNameProps {
    open: boolean;
    onClose: () => void;
    onSave: (name: string) => void; // 저장 버튼 클릭 시 호출될 함수
}

const WriteTriggerName: React.FC<WriteTriggerNameProps> = ({ open, onClose, onSave }) => {
    const [triggerName, setTriggerName] = useState<string>(''); // 입력 필드 상태 관리

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTriggerName(event.target.value); // 입력값 업데이트
    };

    const handleSave = () => {
        onSave(triggerName); // 저장 버튼 클릭 시 입력된 name을 전달
        onClose(); // 모달 닫기
    };

    return (
        <Dialog
            open={open}
            onClose={(event, reason) => {
                if (reason !== 'backdropClick') {
                    onClose();
                }
            }}
            disableEscapeKeyDown
        >
            <DialogTitle>Write Trigger Name</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Trigger Name"
                    type="text"
                    fullWidth
                    value={triggerName}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave} variant="contained" color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WriteTriggerName;
