import React from 'react';
import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';

interface ConfirmationDialogProps {
  open: boolean;
  title?: string; // 다이얼로그 제목
  content?: string; // 다이얼로그 내용
  confirmText?: string; // 확인 버튼 텍스트
  cancelText?: string; // 취소 버튼 텍스트
  onClose: () => void; // 닫기 핸들러
  onConfirm: () => void; // 확인 핸들러
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  title = 'Are you sure?', // 기본값 설정
  content = 'Please confirm your action.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => onConfirm();
  const handleCancel = () => onClose();

  return (
    <Dialog open={open} onClose={() => onClose()}>
      {title && <DialogTitle>{title}</DialogTitle>}
      {content && (
        <DialogContent>
          <Typography>{content}</Typography>
        </DialogContent>
      )}
      <DialogActions>
        <Button onClick={handleCancel} color="primary">
          {cancelText}
        </Button>
        <Button onClick={handleConfirm} color="error">
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
