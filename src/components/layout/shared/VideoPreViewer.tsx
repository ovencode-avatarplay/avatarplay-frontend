import React, {useRef, useState} from 'react';
import styles from './VideoPreViewer.module.css';
import {LineClose, LineArrowLeft, LineArrowRight, BoldPause, BoldPlay} from '@ui/Icons';
import EmptyState from '@/components/search/EmptyState';

interface Props {
  videoUrl: string;
  onClose: () => void;
}

const VideoPreViewer: React.FC<Props> = ({videoUrl, onClose}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

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

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={LineClose.src} className={styles.blackIcon} />
        </button>
        {videoUrl ? (
          <div className={styles.videoContainer}>
            <video ref={videoRef} className={styles.videoElement} src={videoUrl} controls={true} />
            <div className={styles.controls}>
              <button onClick={() => handleSkip(-10)} className={styles.controlButton}>
                <img src={LineArrowLeft.src} alt="10초 뒤로" />
              </button>
              <button onClick={handlePlayPause} className={styles.controlButton}>
                <img src={isPlaying ? BoldPause.src : BoldPlay.src} alt={isPlaying ? 'Pause' : 'Play'} />
              </button>
              <button onClick={() => handleSkip(10)} className={styles.controlButton}>
                <img src={LineArrowRight.src} alt="10초 앞으로" />
              </button>
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
