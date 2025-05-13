import React, {useState} from 'react';
import styles from './VideoUpload.module.css'; // 필요 시 새로운 스타일 정의
import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import UploadFromWorkroom from '@/app/view/studio/workroom/UploadFromWorkroom';
import {MediaState} from '@/app/NetWork/ProfileNetwork';

interface Props {
  setVideoUrl: (url: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onChoose?: () => void;
}

const VideoUpload: React.FC<Props> = ({setVideoUrl, isOpen, onClose, onChoose}) => {
  const [videoUrl, setInternalVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [workroomOpen, setWorkroomOpen] = useState<boolean>(false);

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

  const handleOnWorkroomItemSelect = (url: string) => {
    setVideoUrl(url);
    setInternalVideoUrl(url);
    if (onChoose) onChoose();
    setWorkroomOpen(false);
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
      blockAutoClose: true,
      onClick: () => {
        setWorkroomOpen(true);
      },
    },
  ];

  return (
    <div className={styles.box}>
      <SelectDrawer
        items={selectVisibilityItems}
        isOpen={isOpen}
        onClose={() => {
          if (workroomOpen) {
            if (videoUrl !== '') {
              onClose();
            }
          } else {
            onClose();
          }
        }}
        selectedIndex={0}
      />
      <UploadFromWorkroom
        open={workroomOpen}
        onClose={() => setWorkroomOpen(false)}
        onSelect={handleOnWorkroomItemSelect}
        multiple={false}
        mediaStateFilter={MediaState.Video}
      />
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default VideoUpload;
