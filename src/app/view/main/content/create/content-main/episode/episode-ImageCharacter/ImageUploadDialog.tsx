import React, {useEffect} from 'react';
import {Drawer} from '@mui/material';
import styles from './ImageUploadDrawer.module.css';

interface Props {
  isOpen: boolean; // 다이얼로그 오픈 여부
  onClose: () => void; // 다이얼로그 닫기 콜백
  onFileSelect: (file: File) => void; // 선택된 파일을 부모로 전달
  type: number;
}

const ImageUploadDialog: React.FC<Props> = ({isOpen, onClose, onFileSelect}) => {
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
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelect(file); // 파일 선택 시 부모로 전달
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
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelect(file); // 파일 선택 시 부모로 전달
      }
    };
    input.click();
    onClose();
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelect(file); // 파일 선택 시 부모로 전달
      }
    };
    input.click();
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        className: styles.drawer,
      }}
      BackdropProps={{
        sx: {
          background: 'rgba(0, 0, 0, 0.70)',
        },
      }}
    >
      {isMobile ? (
        <div className={styles.drawerContainer}>
          <div className={styles.handleArea}>
            <div className={styles.handle} />
          </div>
          <button className={styles.drawerItem} onClick={handlePhotoLibrary}>
            Photo Library
          </button>
          <button className={styles.drawerItem} onClick={handleTakePhoto}>
            Take Photo
          </button>
          <button className={styles.drawerItem} onClick={handleChooseFile}>
            Choose File
          </button>
        </div>
      ) : null}
    </Drawer>
  );
};

export default ImageUploadDialog;
