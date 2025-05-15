import React, {useEffect, useRef, useState} from 'react';
import styles from './VideoPreViewer.module.css';
import {LineClose, BoldPause, BoldPlay, BoldPlayPrevious, BoldPlayNext} from '@ui/Icons';
import EmptyState from '@/components/search/EmptyState';

interface Props {
  videoName?: string;
  videoUrl: string;
  onClose: () => void;
}

const VideoPreViewer: React.FC<Props> = ({videoName, videoUrl, onClose}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const sliderRef = useRef<HTMLInputElement>(null);

  const handlePlayPause = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSkip = (seconds: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
    setCurrentTime(time);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (!sliderRef.current || duration === 0) return;
    const percentage = (currentTime / duration) * 100;
    sliderRef.current.style.background = `linear-gradient(to right, #fff 0%, #fff ${percentage}%, #999 ${percentage}%, #999 100%)`;
  }, [currentTime, duration]);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.headerArea}>
          <h1 className={styles.itemName}>{videoName || ''}</h1>
          <button className={styles.closeButton} onClick={onClose}>
            <img src={LineClose.src} />
          </button>
        </div>
        {videoUrl ? (
          <div className={styles.videoContainer}>
            <video ref={videoRef} className={styles.videoElement} src={videoUrl} controls={false} />
            <div className={styles.controlArea}>
              <div className={styles.sliderArea}>
                <div className={styles.timer}>{formatTime(currentTime)}</div>
                <input
                  ref={sliderRef}
                  type="range"
                  min="0"
                  max={duration}
                  step="0.01"
                  value={currentTime}
                  onChange={handleSliderChange}
                  className={styles.slider}
                />
                <div className={styles.timer}>{formatTime(duration)}</div>
              </div>
              <div className={styles.buttonArea}>
                <button onClick={() => handleSkip(-10)} className={styles.controlButton}>
                  <img src={BoldPlayPrevious.src} alt="10초 뒤로" />
                </button>
                <button onClick={handlePlayPause} className={styles.playButton}>
                  <img src={isPlaying ? BoldPause.src : BoldPlay.src} alt={isPlaying ? 'Pause' : 'Play'} />
                </button>
                <button onClick={() => handleSkip(10)} className={styles.controlButton}>
                  <img src={BoldPlayNext.src} alt="10초 앞으로" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyStateWrapper}>
            <EmptyState stateText="It's Empty!" />
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPreViewer;
