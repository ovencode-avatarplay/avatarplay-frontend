import React, {useRef, useState} from 'react';
import styles from './AudioPreViewer.module.css';
import {LineClose, LineArrowLeft, LineArrowRight, BoldPause, BoldPlay} from '@ui/Icons';
import EmptyState from '@/components/search/EmptyState';

interface Props {
  audioUrl: string;
  onClose: () => void;
}

const AudioPreViewer: React.FC<Props> = ({audioUrl, onClose}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <img src={LineClose.src} className={styles.blackIcon} />
        </button>
        {audioUrl ? (
          <div className={styles.audioContainer}>
            <audio ref={audioRef} className={styles.audioElement} src={audioUrl} controls={false} />
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

export default AudioPreViewer;
