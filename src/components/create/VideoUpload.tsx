import React, {useState} from 'react';
import styles from './VideoUpload.module.css'; // 필요 시 새로운 스타일 정의
import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import LoadingOverlay from '@/components/create/LoadingOverlay';

interface Props {
  setVideoUrl: (url: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onChoose?: () => void;
}

const VideoUpload: React.FC<Props> = ({setVideoUrl, isOpen, onClose, onChoose}) => {
  const [videoUrl, setInternalVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOnFileSelect = async (file: File) => {
    try {
      setLoading(true);
      const req: MediaUploadReq = {
        mediaState: UploadMediaState.TriggerVideo,
        file,
      };
      const response = await sendUpload(req);

      if (response?.data) {
        const url: string = response.data.url;
        setVideoUrl(url);
        setInternalVideoUrl(url);
      } else {
        console.error('Video upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = false;
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        handleOnFileSelect(file);
        if (onChoose) onChoose();
      }
    };
    input.click();
  };

  const selectVisibilityItems: SelectDrawerItem[] = [
    {
      name: 'My device',
      onClick: () => {
        handleChooseFile();
      },
    },
    {
      name: 'Workroom',
      onClick: () => {
        // TODO: Workroom 영상 업로드
        console.log('TODO : Workroom');
        handleChooseFile();
      },
    },
  ];

  return (
    <div className={styles.box}>
      <SelectDrawer items={selectVisibilityItems} isOpen={isOpen} onClose={onClose} selectedIndex={0} />
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default VideoUpload;
