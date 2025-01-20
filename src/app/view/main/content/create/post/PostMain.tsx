import React, {useEffect, useState} from 'react';
import ContentDashboardHeader from '../content-main/content-dashboard/ContentDashboardHeader';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import styles from './PostMain.module.css';
import {BoldPlay, CircleClose, LineUpload} from '@ui/Icons';
import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import TriggerImageGrid from '../content-main/episode/episode-trigger/TriggerImageGrid';
import ReactPlayer from 'react-player';
import {stat} from 'fs';
import PostImageGrid from './PostImageGrid';
import {FeedInfo, sendCreateFeed} from '@/app/NetWork/ShortsNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CustomPopup from '@/components/layout/shared/CustomPopup';

interface Props {}
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
const PostMain: React.FC<Props> = () => {
  const router = useRouter();
  const [text, setText] = useState(''); // 입력된 텍스트 상태
  const [warnPopup, setWarnPopup] = useState<boolean>(false); // 입력된 텍스트 상태
  const [publishPopup, setPublishPopup] = useState<boolean>(false); // 입력된 텍스트 상태
  const maxLength = 500; // 최대 문자 수
  const [isOpenSelectDrawer, setIsOpenSelectDrawer] = useState<boolean>(false);

  const [isOpenMediaDrawer, setIsOpenMediaDrawer] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState<string | null>(null);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= maxLength) {
      setText(event.target.value); // 입력된 텍스트 업데이트
    }
  };
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image'); // State for media type
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  useEffect(() => {}, [mediaUrls]);
  useEffect(() => {
    setMediaUrls([]); // 미디어 URL 초기화
  }, [mediaType]);

  const [loading, setLoading] = useState(false);
  const {label, hint, accept} = mediaTypeConfig[mediaType];

  const handleInit = () => {
    setMediaUrls([]);
    setText('');
  };
  // 파일 선택 시 처리
  const handleOnFileSelect = async (files: File[]) => {
    try {
      // MediaState 설정
      let state = MediaState.None;
      if (mediaType == 'image') state = MediaState.FeedImage;
      if (mediaType == 'video') state = MediaState.FeedVideo;

      // 업로드 요청 객체 생성
      const req: MediaUploadReq = {
        mediaState: state, // 적절한 MediaState 설정
      };

      if (state === MediaState.FeedImage) {
        req.imageList = files;
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

        // 상태 업데이트: 새로운 이미지 추가
        setMediaUrls(prevUrls => {
          const combinedUrls = [...prevUrls, ...validImageUrls];
          return combinedUrls.slice(0, 9); // 최대 9장 제한
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
    {
      name: 'Take a photo or video',
      onClick: () => {
        handleTakeMedia();
      },
    },
    {
      name: 'Media library',
      onClick: () => {
        handleMediaLibrary();
      },
    },
    {
      name: 'File folder',
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
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
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
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
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
        handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
      }
    };
    input.click();
  };

  const createFeed = async () => {
    let state = 0;
    if (mediaType == 'image') state = 1;
    if (mediaType == 'video') state = 2;

    if (mediaUrls.length == 0) {
      setWarnPopup(true);
      return;
    }

    const feedInfo: FeedInfo = {
      id: 0,
      urlLinkKey: 0,
      mediaState: state, // 예시 값
      mediaUrlList: mediaUrls,
      description: text,
      hashTag: '',
      likeCount: 0,
      commentCount: 0,
      isLike: false,
      isDisLike: false,
      isBookmark: false,
      playTime: '', // 예시 값
      characterProfileId: 0,
      characterProfileName: '',
      characterProfileUrl: '',
      createAt: '',
    };
    setLoading(true);
    const result = await sendCreateFeed(feedInfo);
    setLoading(false);
    if (result.resultCode === 0) {
      setPublishPopup(true);
      console.log('Feed created successfully:', result.data);
    } else {
      console.error('Failed to create feed:', result.resultMessage);
    }
  };

  return (
    <div className={styles.box}>
      <ContentDashboardHeader
        title="Title"
        onClose={() => {
          pushLocalizedRoute('/main/homefeed', router);
        }}
        onCreate={() => {}}
      ></ContentDashboardHeader>

      <div className={styles.container}>
        <div className={styles.label}>Photo / Video</div>
        <div
          className={styles.inputBox}
          onClick={() => {
            setIsOpenMediaDrawer(true);
          }}
        >
          <div className={styles.uploadIcon}>
            <img src={LineUpload.src} alt="upload-icon" />
          </div>
          <div className={styles.hintText}>Upload</div>
        </div>
        {/* 이미지 그리드 */}
        {mediaType === 'image' && (
          <div>
            <PostImageGrid
              imageUrls={mediaUrls}
              onRemove={handleMediaRemove} // 인덱스를 기반으로 삭제
            />
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
              muted={true}
              url={mediaUrls[0]} // 첫 번째 URL 사용
              playing={isPlaying} // 재생 상태
              width="100%" // 비율 유지하며 너비 자동 조정
              height="100%" // 비율 유지하며 높이 자동 조정
              style={{
                borderRadius: '8px',
              }}
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
                handleMediaRemove(0);
              }}
            >
              <img src={CircleClose.src}></img>
            </button>
          </div>
        )}
        <div className={styles.infoText}>Photo 0/9 or Video 0/1</div>

        <div className={styles.label} style={{marginTop: '28px'}}>
          Description
        </div>

        <div className={styles.inputArea}>
          <textarea placeholder="Text..." className={styles.textArea} value={text} onChange={handleTextChange} />
          <div className={styles.charCount}>
            {text.length}/{maxLength}
          </div>
        </div>
      </div>
      <div className={styles.contentBottom}>
        <div
          className={styles.setupButtons}
          onClick={() => {
            createFeed();
          }}
        >
          Publish
        </div>
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

export default PostMain;
