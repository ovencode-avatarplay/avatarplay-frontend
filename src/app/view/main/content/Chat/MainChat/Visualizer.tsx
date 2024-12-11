import React, {useState, useEffect, useRef} from 'react';
import {AudioVisualizer} from 'react-audio-visualize';
import styles from './Visualizer.module.css'; // CSS 모듈 경로
import {Pause, Play} from '@ui/chatting';

interface VisualizerProps {
  url: string; // 오디오 URL을 prop으로 받음
}

const Visualizer: React.FC<VisualizerProps> = ({url}) => {
  const [blob, setBlob] = useState<Blob>();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0); // 오디오 전체 길이
  const visualizerRef = useRef<HTMLDivElement>(null); // 감싸는 div에 참조

  useEffect(() => {
    const fetchAudio = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch audio from URL: ${response.statusText}`);
        }
        const audioBlob = await response.blob();
        setBlob(audioBlob);

        const audioUrl = URL.createObjectURL(audioBlob);
        const audioElement = new Audio(audioUrl);
        setAudio(audioElement);

        audioElement.addEventListener('loadedmetadata', () => {
          setDuration(audioElement.duration); // 전체 길이 설정
        });
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    };

    if (url) {
      fetchAudio();
    }
  }, [url]);

  useEffect(() => {
    if (audio) {
      const updateTime = () => {
        setCurrentTime(audio.currentTime);
      };

      const handleAudioEnded = () => {
        setIsPlaying(false); // 재생 상태를 멈춤으로 설정
      };

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('ended', handleAudioEnded);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('ended', handleAudioEnded);
      };
    }
  }, [audio]);

  const togglePlayPause = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // 클릭으로 재생 위치 변경
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (audio && duration && visualizerRef.current) {
      const rect = visualizerRef.current.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audio.currentTime = newTime; // 오디오 재생 위치 설정
      setCurrentTime(newTime);
    }
  };

  // 드래그 기능 추가
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.buttons !== 1) return; // 왼쪽 버튼만 반응
    handleClick(event);
  };
  // 시간 형식 변환 (초 → MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  return (
    <div>
      {blob ? (
        <div className={styles.box}>
          <div
            ref={visualizerRef}
            onClick={handleClick}
            onMouseMove={handleMouseMove} // 드래그 동작 처리
          >
            <AudioVisualizer
              blob={blob}
              width={182}
              height={24}
              barWidth={3}
              gap={2}
              barColor={'rgba(0, 0, 0, 0)'}
              barPlayedColor={'rgba(177, 181, 195, 0.66)'}
              currentTime={currentTime}
            />
          </div>
          <div className={styles.curTime}>{formatTime(currentTime)}</div>
          <button className={styles.playButton} onClick={togglePlayPause}>
            <img src={isPlaying ? Pause.src : Play.src} className={styles.icon} />
          </button>
        </div>
      ) : (
        <p>Loading audio...</p>
      )}
    </div>
  );
};

export default Visualizer;
