import React, {useState} from 'react';
import styles from './ImageUpload.module.css';
import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import LoadingOverlay from '@/components/create/LoadingOverlay';

interface Props {
  setContentImageUrl: (url: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onChoose?: () => void;
  onGalleryChoose?: () => void;
}

const ImageUpload: React.FC<Props> = ({setContentImageUrl, isOpen, onClose, onChoose, onGalleryChoose}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOnFileSelect = async (file: File) => {
    try {
      setLoading(true);
      const req: MediaUploadReq = {
        mediaState: UploadMediaState.ContentImage,
        file,
      };
      const response = await sendUpload(req);

      if (response?.data) {
        const url: string = response.data.url;
        setContentImageUrl(url);
        setImageUrl(url);
      } else {
        console.error('Image upload failed.');
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
    input.accept = 'image/*';
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
        // TODO : Workroom
        console.log('TODO : Workroom');
        handleChooseFile();
      },
    },
    {
      name: 'Gallery',
      onClick: () => {
        if (onGalleryChoose) onGalleryChoose();
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

export default ImageUpload;
