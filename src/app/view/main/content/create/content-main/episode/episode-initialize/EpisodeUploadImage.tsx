import React, {useEffect, useState} from 'react';

import styles from './EpisodeUploadImage.module.css';

import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import ImageUploadDialog from '../episode-ImageCharacter/ImageUploadDialog';
import LoadingOverlay from '@/components/create/LoadingOverlay';

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
        mediaState: MediaState.CharacterImage,
        file: file,
      };
      const response = await sendUpload(req);
      if (response?.data) {
        const imgUrl: string = response.data.url;

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
          <img className={styles.buttonIcon} alt="Upload Icon" />
          <div className={styles.buttonText}>Upload</div>
        </button>
        <div className={styles.uploadedImageArea}>
          <img className={styles.uploadedImage} src={imgUrl} alt="Uploaded" />
          <button className={styles.deleteButton} onClick={handleDeleteImage}>
            <img className={styles.buttonIcon} alt="Delete Icon" />{' '}
          </button>
        </div>
      </div>

      <ImageUploadDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} onFileSelect={handleFileSelection} />
    </>
  );
};

export default EpisodeUploadImage;