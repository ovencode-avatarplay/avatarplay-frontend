import React, {useEffect, useState} from 'react';

import styles from './EpisodeUploadImage.module.css';

import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import ImageUploadDialog from '../episode-ImageCharacter/ImageUploadDialog';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import {BoldCircleX, LineUpload} from '@ui/Icons';
import UploadedImageArea from './UploadedImageArea';

interface Props {
  imgUrl: string;
  setImgUrl: (url: string) => void;
}

const EpisodeUploadImage: React.FC<Props> = ({imgUrl, setImgUrl}) => {
  const [isLoading, setLoading] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleOnClickUploadButton = () => {
    setDialogOpen(true);
  };

  const handleFileSelection = async (file: File) => {
    setLoading(true);
    try {
      const req: MediaUploadReq = {
        mediaState: UploadMediaState.CharacterImage,
        fileList: [file],
      };
      const response = await sendUpload(req);
      if (response?.data) {
        const imgUrl: string = response.data.mediaUploadInfoList[0].url;

        setImgUrl(imgUrl);
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setImgUrl('');
  };

  return (
    <>
      <LoadingOverlay loading={isLoading} />
      <div className={styles.uploadImageArea}>
        <button className={styles.uploadButton} onClick={handleOnClickUploadButton}>
          <img src={LineUpload.src} className={`${styles.buttonIcon} ${styles.blackIcon}`} alt="Upload Icon" />
          <div className={styles.buttonText}>Upload</div>
        </button>

        <UploadedImageArea imgUrl={imgUrl} onDelete={handleDeleteImage} />
      </div>

      <ImageUploadDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} onFileSelect={handleFileSelection} />
    </>
  );
};

export default EpisodeUploadImage;
