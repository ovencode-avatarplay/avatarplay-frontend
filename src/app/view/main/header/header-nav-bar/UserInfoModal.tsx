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
  const { userId, profileName, profileDescription } = useSelector((state: RootState) => state.user);

  const handleUserIdChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newUserId = event.target.value;
    console.log( 'newUserId', newUserId)
    dispatch(setUserId(newUserId));
    // 로컬 스토리지에 사용자 ID 저장
    localStorage.setItem('userId', newUserId);
  };

  // 사용자 ID 입력창에 포커스를 주기 위한 ref 생성
  const userIdInputRef = useRef<HTMLInputElement | null>(null);

  // 모달이 열릴 때 포커스 주기
  useEffect(() => {
    if (open) {
      setTimeout(() => {
        userIdInputRef.current?.focus();
      }, 0);
    }
  }, [open]); 

  // 페이지가 로드될 때 로컬 스토리지에서 사용자 ID 가져오기
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      dispatch(setUserId(savedUserId));
    }
  }, [dispatch]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>유저 정보</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Avatar alt="User Profile" src={"임시이미지파일"} style={{ marginRight: '16px' }} />
          <div>
            <h3>{profileName}</h3>
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
          value={profileDescription}
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
