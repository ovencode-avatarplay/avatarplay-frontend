import React, {useEffect, useState} from 'react';
import styles from './MediaUpload.module.css';
import {BoldPlay, editCircle, LineUpload} from '@ui/Icons';
import {UploadMediaState} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import ReactPlayer from 'react-player';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import getLocalizedText from '@/utils/getLocalizedText';
import ImageUpload from '@/components/create/ImageUpload';
import VideoUpload from '@/components/create/VideoUpload';

interface Props {
  title?: string;
  setContentMediaUrls: (urls: string[]) => void;
  defaultImage?: string;
  triggerWarning?: boolean;
  uploadImageType?: UploadMediaState;
  uploadVideoType?: UploadMediaState;
  imageMultiple?: boolean;
  videoMultiple?: boolean;
}
const mediaTypeConfig = {
  image: {
    label: 'Write Image File Type',
    hint: 'Write image file type (e.g., .png, .jpg, .jpeg)',
    accept: 'image/*', // 이미지 파일
  },
  video: {
    label: 'Write Video File Type',
    hint: 'Write video file type (e.g., .mp4, .mov, .avi)',
    accept: 'video/*', // 비디오 파일
  },
};
const MediaUpload: React.FC<Props> = ({
  title = getLocalizedText('createchannel001_label_002'),
  setContentMediaUrls,
  defaultImage,
  triggerWarning = false,
  uploadImageType = UploadMediaState.ContentImage,
  uploadVideoType = UploadMediaState.ContentVideo,
  imageMultiple = false,
  videoMultiple = false,
}) => {
  const [warnPopup, setWarnPopup] = useState<boolean>(false); // 입력된 텍스트 상태
  const [publishPopup, setPublishPopup] = useState<boolean>(false); // 입력된 텍스트 상태
  const [isOpenSelectDrawer, setIsOpenSelectDrawer] = useState<boolean>(false);
  const [isOpenMediaDrawer, setIsOpenMediaDrawer] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState<string | null>(null);
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const [mediaType, setMediaType] = useState<'image' | 'video'>('image'); // State for media type
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [isDefault, setIsDefault] = useState(false);

  const videoExtensions = ['mp4', 'webm', 'ogg']; // 비디오 확장자 목록
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']; // 이미지 확장자 목록

  const getFileExtension = (url?: string) => url?.split('.').pop()?.toLowerCase() || '';

  const isVideo = (url?: string) => videoExtensions.includes(getFileExtension(url));
  const isImage = (url?: string) => imageExtensions.includes(getFileExtension(url));

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (defaultImage == undefined) return;
    if (isVideo(defaultImage)) setMediaType('video');
    setMediaUrls([defaultImage]); // defaultImage를 0번 인덱스로 설정
    setIsDefault(true);
  }, [defaultImage]); // defaultImage가 변경될 때만 실행

  useEffect(() => {}, [mediaUrls]);
  useEffect(() => {
    if (isDefault == false) {
      setMediaUrls([]); // 미디어 URL 초기화
      setIsDefault(false);
    }
  }, [mediaType]);

  useEffect(() => {
    setContentMediaUrls(mediaUrls);
  }, [mediaUrls]);

  const [loading, setLoading] = useState(false);

  const handleInit = () => {
    setMediaUrls([]);
  };

  const mediaVisibilityItems: SelectDrawerItem[] = [
    {
      name: 'Select Image',
      onClick: () => {
        setMediaType('image');
        setIsOpenSelectDrawer(true);
      },
    },
    {
      name: 'Select Video',
      onClick: () => {
        setMediaType('video');
        setIsOpenSelectDrawer(true);
      },
    },
  ];

  const thumbnailText = title;
  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <div className={styles.label}>{thumbnailText}</div>

        {mediaUrls.length === 0 && (
          <div
            className={`${styles.inputBox} ${triggerWarning ? styles.isEssentialWarning : ''}`}
            onClick={() => {
              setIsOpenMediaDrawer(true);
            }}
          >
            <div className={styles.uploadIcon}>
              <img src={LineUpload.src} alt="upload-icon" />
            </div>
            <div className={styles.hintText}>{getLocalizedText('common_button_upload')}</div>
          </div>
        )}
        {mediaType === 'image' && mediaUrls.length > 0 && (
          <div className={styles.imageContainer}>
            <img src={mediaUrls[0]} alt="uploaded-image" className={styles.uploadedImage} />
            <button
              className={styles.deleteButton}
              onClick={() => {
                setIsOpenMediaDrawer(true);
              }}
            >
              <img src={editCircle.src} alt="Delete" />
            </button>
          </div>
        )}

        {mediaType === 'video' && mediaUrls.length > 0 && (
          <div
            className={styles.mediaVideo}
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false);
              }
            }}
          >
            <ReactPlayer
              className={styles.reactPlayer} // 추가
              muted={true}
              url={mediaUrls[0]} // 첫 번째 URL 사용
              playing={isPlaying} // 재생 상태
              width="100%"
              height="100%"
              style={{borderRadius: '8px'}}
              onDuration={(duration: number) => setVideoDuration(formatDuration(duration))} // 영상 길이 설정
            />
            {!isPlaying && (
              <button
                className={styles.playButton}
                onClick={() => setIsPlaying(true)} // 재생 시작
              >
                <img src={BoldPlay.src} alt="Play" />
              </button>
            )}
            <button
              className={styles.deleteButton}
              onClick={() => {
                setIsOpenMediaDrawer(true);
              }}
            >
              <img src={editCircle.src} alt="Delete" />
            </button>
          </div>
        )}
      </div>

      <div style={{position: 'relative'}}>
        <SelectDrawer
          items={mediaVisibilityItems}
          isOpen={isOpenMediaDrawer}
          onClose={() => setIsOpenMediaDrawer(false)}
          selectedIndex={0}
        />
      </div>
      <LoadingOverlay loading={loading} />
      {warnPopup && (
        <CustomPopup
          type="alert"
          title="Alert"
          description="No media added"
          buttons={[
            {
              label: 'Ok',
              onClick: () => {
                setWarnPopup(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
      {publishPopup && (
        <CustomPopup
          type="alert"
          title="Alert"
          description="Publish"
          buttons={[
            {
              label: 'Ok',
              onClick: () => {
                handleInit();
                setPublishPopup(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
      {mediaType === 'image' && (
        <ImageUpload
          isOpen={isOpenSelectDrawer}
          onClose={() => {
            setIsOpenSelectDrawer(false);
          }}
          setContentImageUrl={string => {
            setMediaUrls(prev => [...prev, string]);
          }}
          onChoose={() => {
            setIsOpenSelectDrawer(false);
          }}
          uploadType={uploadImageType}
          multiple={imageMultiple}
        />
      )}
      {mediaType === 'video' && (
        <VideoUpload
          isOpen={isOpenSelectDrawer}
          onClose={() => {
            setIsOpenSelectDrawer(false);
          }}
          setContentVideoUrl={string => {
            setMediaUrls(prev => [...prev, string]);
          }}
          onChoose={() => {
            setIsOpenSelectDrawer(false);
          }}
          uploadType={uploadVideoType}
          multiple={videoMultiple}
        />
      )}
      <LoadingOverlay loading={isLoading} />
    </div>
  );
};

export default MediaUpload;
