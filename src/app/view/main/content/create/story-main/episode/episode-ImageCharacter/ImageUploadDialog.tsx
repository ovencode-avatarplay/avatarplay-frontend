import React, {useEffect} from 'react';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {MediaState} from '@/app/NetWork/ProfileNetwork';

interface Props {
  isOpen: boolean; // 다이얼로그 오픈 여부
  onClose: () => void; // 다이얼로그 닫기 콜백
  onFileSelect: (file: File) => void; // 선택된 파일을 부모로 전달
  mediaType?: MediaState;
}

const ImageUploadDialog: React.FC<Props> = ({isOpen, onClose, onFileSelect, mediaType}) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  const getAcceptType = (): string => {
    switch (mediaType) {
      case MediaState.Image:
        return 'image/*';
      case MediaState.Video:
        return 'video/*';
      case MediaState.Audio:
        return 'audio/*';
      default:
        return '*/*';
    }
  };

  const acceptType = getAcceptType();

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
    input.accept = acceptType;
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        onFileSelect(file); // 파일 선택 시 부모로 전달
      }
    };
    input.click();
    onClose();
  };

  const uploadImageItems: SelectDrawerItem[] = [
    // {
    //   name: 'Take a photo',
    //   onClick: () => {
    //     handleTakePhoto();
    //   },
    // },
    {
      name: 'Workroom',
      onClick: () => {
        handlePhotoLibrary();
      },
    },
    {
      name: 'My device',
      onClick: () => {
        handleChooseFile();
      },
    },
  ];

  return (
    <>
      {isMobile ? <SelectDrawer isOpen={isOpen} onClose={onClose} items={uploadImageItems} selectedIndex={0} /> : null}
    </>
  );
};

export default ImageUploadDialog;
