import React, { useEffect, useRef } from 'react'; 
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Avatar, TextField } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore'; 
import { setUserId } from '@/redux-store/slices/userInfo'; 

interface UserInfoModalProps {
  open: boolean; 
  onClose: () => void; 
}

const UserInfoModal: React.FC<UserInfoModalProps> = ({ open, onClose }) => {
  const dispatch = useDispatch();
  const { userId, name, userImage, userDescription } = useSelector((state: RootState) => state.user);
  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setUserId(event.target.value));
  };

  // 사용자 ID 입력창에 포커스를 주기 위한 ref 생성
  const userIdInputRef = useRef<HTMLInputElement | null>(null);

  // 모달이 열릴 때 포커스 주기
  useEffect(() => {
    if (open) {
      // setTimeout을 사용하여 모달이 열린 후에 포커스를 주기
      setTimeout(() => {
        userIdInputRef.current?.focus();
      }, 0);
    }
  }, [open]); // open 상태가 변경될 때마다 실행

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>유저 정보</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Avatar alt="User Profile" src={userImage} style={{ marginRight: '16px' }} />
          <div>
            <h3>{name}</h3>
            <p style={{ whiteSpace: 'pre-line' }}>나에대한 짧막 설명</p>
          </div>
        </div>
        <TextField
          label="사용자 ID"
          value={userId}
          onChange={handleUserIdChange}
          fullWidth
          margin="normal"
          inputRef={userIdInputRef}
        />
        <TextField
          label="유저 설명"
          value={userDescription}
          multiline
          rows={8}
          variant="outlined"
          fullWidth
          margin="normal"
          inputProps={{ maxLength: 200 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>저장 및 닫기</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserInfoModal;
