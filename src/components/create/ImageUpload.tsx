import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import styles from './ImageUpload.module.css';
import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import UploadFromWorkroom from '@/app/view/studio/workroom/UploadFromWorkroom';
import {MediaState} from '@/app/NetWork/ProfileNetwork';

interface Props {
  setContentImageUrl: (url: string) => void;
  setContentImageUrls?: (urls: string[]) => void;
  isOpen: boolean;
  onClose: () => void;
  onChoose?: () => void;
  onGalleryChoose?: () => void;
  multiple?: boolean;
}

const ImageUpload: React.FC<Props> = ({
  setContentImageUrl,
  setContentImageUrls,
  isOpen,
  onClose,
  onChoose,
  onGalleryChoose,
  multiple = false,
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [workroomOpen, setWorkroomOpen] = useState<boolean>(false);

  const handleOnFileSelect = async (files: FileList) => {
    try {
      setLoading(true);
      const uploadResults: string[] = [];

      for (const file of Array.from(files)) {
        const req: MediaUploadReq = {
          mediaState: UploadMediaState.ContentImage,
          file,
        };
        const response = await sendUpload(req);
        if (response?.data?.url) {
          uploadResults.push(response.data.url);
        }
      }

      if (uploadResults.length > 0) {
        setImageUrl(uploadResults[0]);
        setContentImageUrl?.(uploadResults[0]);
        setContentImageUrls?.(uploadResults);
      } else {
        console.error('Image upload failed.');
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOnWorkroomItemSelect = (url: string) => {
    setContentImageUrl(url);
    setImageUrl(url);
    if (onChoose) onChoose();
    setWorkroomOpen(false);
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
            if (imageUrl !== '') {
              onClose();
            }
          } else {
            onClose();
          }
        }}
        selectedIndex={0}
      />
      {ReactDOM.createPortal(
        <UploadFromWorkroom
          open={workroomOpen}
          onClose={() => setWorkroomOpen(false)}
          onSelect={handleOnWorkroomItemSelect}
          mediaStateFilter={MediaState.Image}
        />,
        document.body,
      )}
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default ImageUpload;
