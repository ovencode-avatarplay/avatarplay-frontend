import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import styles from './ImageUpload.module.css';
import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import LoadingOverlay from '@/components/create/LoadingOverlay';
// import UploadFromWorkroom from '@/app/view/studio/workroom/UploadFromWorkroom';
import {MediaState} from '@/app/NetWork/ProfileNetwork';

interface Props {
  setContentImageUrl: (url: string) => void;
  setContentImageUrls?: (urls: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  onChoose?: () => void;
  onGalleryChoose?: () => void;
  multiple?: boolean;
  uploadType?: UploadMediaState;
}

const ImageUpload: React.FC<Props> = ({
  setContentImageUrl,
  setContentImageUrls,
  isOpen,
  onClose,
  onChoose,
  onGalleryChoose,
  multiple = false,
  uploadType = UploadMediaState.Content,
}) => {
  const [imageUrl, setImageUrl] = useState(''); // 이미지 업로드가 성공했는지 확인하기위해 이미지 하나를 내부에서 체크
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

        const firstUrl = uploadResults[0];
        setImageUrl(firstUrl);
        if (uploadResults.length > 0) {
          if (uploadResults.length > 1) {
            setContentImageUrls?.(uploadResults);
          } else {
            setContentImageUrl?.(firstUrl);
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
    setImageUrl(url);
    setContentImageUrl(url);
    if (onChoose) onChoose();
    setWorkroomOpen(false);
    onClose();
  };

  const handleOnWorkroomItemSelectMultiple = (urls: string[]) => {
    setImageUrl(urls[0]);
    setContentImageUrls?.(urls || []);
    if (onChoose) onChoose();
    setWorkroomOpen(false);
    onClose();
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = multiple ?? false;
    input.onchange = event => {
      const files = (event.target as HTMLInputElement).files;
      if (files && files.length > 0) {
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
    // {
    //   name: 'Workroom',
    //   blockAutoClose: true,
    //   onClick: () => {
    //     setWorkroomOpen(true);
    //   },
    // },
  ];

  return (
    <div className={styles.box}>
      <SelectDrawer
        items={selectVisibilityItems}
        isOpen={isOpen && !workroomOpen}
        onClose={() => {
          if (workroomOpen) {
            if (imageUrl !== '') {
              onClose();
            }
          } else {
            onClose();
          }
        }}
        selectedIndex={0}
      />
      {/* {ReactDOM.createPortal(
        <UploadFromWorkroom
          open={workroomOpen}
          onClose={() => setWorkroomOpen(false)}
          onSelect={handleOnWorkroomItemSelect}
          multiple={multiple}
          onSelectMultiple={handleOnWorkroomItemSelectMultiple}
          mediaStateFilter={MediaState.Image}
        />,
        document.body,
      )} */}
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default ImageUpload;
