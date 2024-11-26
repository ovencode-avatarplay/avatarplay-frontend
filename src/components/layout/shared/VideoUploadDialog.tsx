import React, {useEffect} from 'react';
import {Dialog, DialogContent, MenuItem} from '@mui/material';

interface Props {
  isOpen: boolean; // 다이얼로그 오픈 여부
  onClose: () => void; // 다이얼로그 닫기 콜백
  onFileSelect: (file: File) => void; // 선택된 비디오 파일을 부모로 전달
}

const VideoUploadDialog: React.FC<Props> = ({isOpen, onClose, onFileSelect}) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isMobile && isOpen) {
      // 모바일이 아닌 경우 바로 handleChooseFile 실행
      handleChooseFile();
    }
  }, [isMobile, isOpen]);

  // 비디오 파일 선택 핸들러
  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*'; // 비디오 파일만 선택 가능하도록 설정
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file && file.type.startsWith('video/')) {
        // 비디오 파일인지 확인
        onFileSelect(file); // 부모 컴포넌트로 비디오 파일 전달
      } else {
        alert('Please select a valid video file.');
      }
    };
    input.click();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent dividers>
        {isMobile ? (
          <MenuItem onClick={handleChooseFile}>Choose Video File</MenuItem>
        ) : (
          <MenuItem onClick={handleChooseFile}>Choose Video File</MenuItem>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoUploadDialog;
