import React, {useState} from 'react';
import styles from './TriggerCreateMedia.module.css';
import {AudioFile, BoldPlay, CircleClose, LineUpload, LineVoicePlay} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import TriggerImageGrid from './TriggerImageGrid';
import {Box, IconButton, Typography} from '@mui/material';
import ReactPlayer from 'react-player';

import PlayCircleIcon from '@mui/icons-material/PlayCircle';
interface TriggerCreateMediaProps {
  mediaType: 'image' | 'video' | 'audio'; // 미디어 타입
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
  audio: {
    label: 'Write Audio File Type',
    hint: 'Write audio file type (e.g., .mp3, .wav, .aac)',
    accept: 'audio/*', // 오디오 파일
  },
};

const TriggerCreateMedia: React.FC<TriggerCreateMediaProps> = ({mediaType}) => {
  const {label, hint, accept} = mediaTypeConfig[mediaType];
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);
  const [mediaUrls, setImageUrls] = useState<string[]>([]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState<string | null>(null);
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  // 파일 선택 시 처리
  const handleOnFileSelect = (files: File[]) => {
    const newImageUrls = files.map(file => URL.createObjectURL(file));
    setImageUrls(prevUrls => {
      // 새로운 이미지 추가 및 최대 9장 제한
      const combinedUrls = [...prevUrls, ...newImageUrls];
      return combinedUrls.slice(0, 9); // 최대 9장까지 제한
    });
  };

  // 이미지 삭제
  const handleMediaRemove = (indexToRemove: number) => {
    setImageUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
  };

  const visibilityItems: SelectDrawerItem[] = [
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

  return (
    <div className={styles.box}>
      {/* 전체 레이아웃 */}
      <div className={styles.container}>
        {/* Label */}
        <div className={styles.label}>
          <span className={styles.labelText}>{label}</span>
        </div>

        {/* Input Frame */}
        <div
          className={styles.inputFrame}
          onClick={() => {
            setIsOpenDrawer(true);
          }}
        >
          <div className={styles.inputBox}>
            <div className={styles.uploadIcon}>
              <img src={LineUpload.src} alt="Upload Icon" />
            </div>
            <span className={styles.uploadText}>Upload</span>
          </div>
        </div>

        {/* Hint */}
        <div className={styles.hint}>{hint}</div>
      </div>
      {/* 이미지 그리드 */}
      {mediaType === 'image' && (
        <TriggerImageGrid
          urls={mediaUrls}
          onClick={handleMediaRemove} // 인덱스를 기반으로 삭제
        />
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

      {mediaType === 'audio' && mediaUrls.length > 0 && (
        <div className={styles.audioContainer}>
          {/* 삭제 버튼 */}
          <button
            className={styles.deleteButton}
            onClick={() => {
              handleMediaRemove(0); // 첫 번째 오디오 파일 삭제
            }}
          >
            <img src={CircleClose.src} alt="Delete" />
          </button>
          <div className={styles.audioContent}>
            {/* 오디오 파일 아이콘 */}
            <div className={styles.iconWrapper}>
              <img src={AudioFile.src}></img>
            </div>
            {/* 파일 이름 */}
            <p className={styles.audioFileName}>
              {mediaUrls[0].split('/').pop()} {/* 파일 이름만 표시 */}
            </p>
          </div>
        </div>
      )}

      <div style={{position: 'relative'}}>
        <SelectDrawer
          items={visibilityItems}
          isOpen={isOpenDrawer}
          onClose={() => setIsOpenDrawer(false)}
          selectedIndex={0}
        />
      </div>
    </div>
  );
};

export default TriggerCreateMedia;
