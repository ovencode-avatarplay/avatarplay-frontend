import React, {useState} from 'react';
import styles from './VideoUpload.module.css'; // 필요 시 새로운 스타일 정의
import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import UploadFromWorkroom from '@/app/view/studio/workroom/UploadFromWorkroom';
import {MediaState} from '@/app/NetWork/ProfileNetwork';

interface Props {
  setContentVideoUrl: (url: string) => void;
  setContentVideoUrls?: (urls: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  onChoose?: () => void;
  multiple?: boolean;
  uploadType?: UploadMediaState;
}

const VideoUpload: React.FC<Props> = ({
  setContentVideoUrl,
  setContentVideoUrls,
  isOpen,
  onClose,
  onChoose,
  multiple = false,
  uploadType = UploadMediaState.ContentVideo,
}) => {
  const [videoUrl, setVideoUrl] = useState(''); // 비디오 업로드가 성공했는지 확인하기위해 비디오 하나를 내부에서 체크

  const [loading, setLoading] = useState(false);
  const [workroomOpen, setWorkroomOpen] = useState<boolean>(false);

  const handleOnFileSelect = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setLoading(true);

    try {
      const fileArray = Array.from(files);

      const req: MediaUploadReq = {
        mediaState: uploadType,
        fileList: fileArray,
      };

      const response = await sendUpload(req);
      const uploadInfos = response?.data?.mediaUploadInfoList;

      if (uploadInfos && uploadInfos.length > 0) {
        const uploadResults = uploadInfos.map(info => info.url).filter((url): url is string => !!url);

        setVideoUrl(uploadResults[0]);
        if (uploadResults.length > 0) {
          if (uploadResults.length > 1) {
            setContentVideoUrls?.(uploadResults);
          } else {
            setContentVideoUrl(uploadResults[0]);
          }
        } else {
          alert('파일 업로드는 성공했지만 URL이 없습니다.');
        }
      } else {
        alert('업로드에 실패했습니다.');
      }
    } catch (error) {
      console.error('전체 업로드 실패:', error);
      alert('파일 업로드 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleOnWorkroomItemSelect = (url: string) => {
    setVideoUrl(url);
    setContentVideoUrl(url);
    if (onChoose) onChoose();
    setWorkroomOpen(false);
  };

  const handleOnWorkroomItemSelectMultiple = (urls: string[]) => {
    setVideoUrl(urls[0]);
    setContentVideoUrls?.(urls || []);
    if (onChoose) onChoose();
    setWorkroomOpen(false);
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.multiple = multiple ?? false;
    input.onchange = event => {
      const files = (event.target as HTMLInputElement).files;
      if (files) {
        handleOnFileSelect(files);
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
        multiple={multiple}
        onSelectMultiple={handleOnWorkroomItemSelectMultiple}
        mediaStateFilter={MediaState.Video}
      />
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default VideoUpload;
