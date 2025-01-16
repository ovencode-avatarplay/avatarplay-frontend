import React, {useEffect} from 'react';
import {Dialog, DialogContent, MenuItem} from '@mui/material';

interface Props {
  isOpen: boolean; // 다이얼로그 오픈 여부
  onClose: () => void; // 다이얼로그 닫기 콜백
  onFileSelect: (files: File[]) => void; // 선택된 파일을 부모로 전달 (배열)
}

const ImagesUploadDialog: React.FC<Props> = ({isOpen, onClose, onFileSelect}) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  useEffect(() => {
    if (!isMobile && isOpen) {
      // 모바일이 아닌 경우 바로 handleChooseFile 실행
      handleChooseFile();
    }
  }, [isMobile, isOpen]);

  const handlePhotoLibrary = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true; // 여러 이미지 선택 가능
    input.onchange = event => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        onFileSelect(Array.from(files)); // 선택된 파일들을 배열로 부모로 전달
      }
    };
    input.click();
    onClose();
  };

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // 후면 카메라
    input.multiple = true; // 여러 이미지 선택 가능
    input.onchange = event => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        onFileSelect(Array.from(files)); // 선택된 파일들을 배열로 부모로 전달
      }
    };
    input.click();
    onClose();
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true; // 여러 이미지 선택 가능
    input.onchange = event => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        onFileSelect(Array.from(files)); // 선택된 파일들을 배열로 부모로 전달
      }
    };
    input.click();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogContent dividers>
        {isMobile ? (
          <>
            <MenuItem onClick={handlePhotoLibrary}>Photo Library</MenuItem>
            <MenuItem onClick={handleTakePhoto}>Take Photo</MenuItem>
            <MenuItem onClick={handleChooseFile}>Choose File</MenuItem>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ImagesUploadDialog;
