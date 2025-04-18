import React, {useEffect, useState} from 'react';
import styles from './MediaUpload.module.css';
import {BoldPlay, CircleClose, editCircle, LineUpload} from '@ui/Icons';
import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import ReactPlayer from 'react-player';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import getLocalizedText from '@/utils/getLocalizedText';

interface Props {
  title?: string;
  setContentMediaUrls: (urls: string[]) => void;
  defaultImage?: string;
  triggerWarning?: boolean;
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

  const [loading, setLoading] = useState(false);
  const {label, hint, accept} = mediaTypeConfig[mediaType];

  const handleInit = () => {
    setMediaUrls([]);
  };
  // 파일 선택 시 처리
  const handleOnFileSelect = async (files: File[]) => {
    try {
      // MediaState 설정
      let state = UploadMediaState.None;
      if (mediaType == 'image') state = UploadMediaState.ContentImage;
      if (mediaType == 'video') state = UploadMediaState.ContentVideo;

      // 업로드 요청 객체 생성
      const req: MediaUploadReq = {
        mediaState: state, // 적절한 MediaState 설정
      };

      if (state === UploadMediaState.ContentImage) {
        req.file = files[0];
      } else {
        req.file = files[0];
      }
      // 파일 업로드 API 호출
      const response = await sendUpload(req);

      if (response?.data) {
        const imgUrl: string = response.data.url; // 업로드된 메인 이미지 URL
        const additionalUrls: string[] = response.data.imageUrlList || []; // 추가 이미지 URL 리스트

        console.log('Uploaded Image URL:', imgUrl); // 업로드 결과 로그 출력
        console.log('Additional Image URLs:', additionalUrls); // 추가 이미지 결과 로그 출력

        // Redux 상태 업데이트를 위한 URL 리스트 생성
        const validImageUrls = [imgUrl, ...additionalUrls].filter(url => url !== null);
        setContentMediaUrls(validImageUrls);
        // 상태 업데이트: 새로운 이미지 추가
        setMediaUrls(prevUrls => {
          const combinedUrls = [...validImageUrls];
          return combinedUrls.slice(0, 1); // 최대 9장 제한
        });

        console.log('Updated Trigger Info with Media URLs:', validImageUrls);
      } else {
        console.error('Failed to upload files:', files.map(file => file.name).join(', '));
      }
    } catch (error) {
      console.error('Error during file upload:', error);
    }
  };

  // 이미지 삭제
  const handleMediaRemove = (indexToRemove: number) => {
    setMediaUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
  };

  const selectVisibilityItems: SelectDrawerItem[] = [
    // {
    //   name: 'Take a photo',
    //   onClick: () => {
    //     handleTakePhoto();
    //   },
    // },
    {
      name: 'Workroom',
      onClick: () => {
        handleMediaLibrary();
      },
    },
    {
      name: 'My device',
      onClick: () => {
        handleChooseFile();
      },
    },
  ];

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

  const handleMediaLibrary = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept; // mediaType에 따라 파일 형식 설정
    input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
    input.onchange = event => {
      const files = Array.from((event.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 1) : files); // 이미지일 경우 최대 9개 제한
      }
    };
    input.click();
  };

  const handleTakeMedia = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept; // mediaType에 따라 파일 형식 설정
    input.capture = 'environment'; // 후면 카메라 (이미지/비디오)
    input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
    input.onchange = event => {
      const files = Array.from((event.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 1) : files); // 이미지일 경우 최대 9개 제한
      }
    };
    input.click();
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept; // mediaType에 따라 파일 형식 설정
    input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
    input.onchange = event => {
      const files = Array.from((event.target as HTMLInputElement).files || []);
      if (files.length > 0) {
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 1) : files); // 이미지일 경우 최대 9개 제한
      }
    };
    input.click();
  };

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
          items={selectVisibilityItems}
          isOpen={isOpenSelectDrawer}
          onClose={() => setIsOpenSelectDrawer(false)}
          selectedIndex={0}
        />
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
    </div>
  );
};

export default MediaUpload;
