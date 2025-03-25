import React, {useEffect, useRef} from 'react';
import shaka from 'shaka-player/dist/shaka-player.compiled';

interface Props {
  src: string; // .mpd URL
  isMute: boolean;
  isPlaying: boolean;
  onClickPlayPause: (e: React.MouseEvent<HTMLImageElement>) => void;
  isVisible: boolean;
  onProgress: (seconds: number) => void;
  onDuration: (duration: number) => void;
  playIcon: string;
  pauseIcon: string;
}

const ShakaPlayerWrapper: React.FC<Props> = ({
  src,
  isMute,
  isPlaying,
  onClickPlayPause,
  isVisible,
  onProgress,
  onDuration,
  playIcon,
  pauseIcon,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const player = new shaka.Player(video);
    playerRef.current = player;

    player
      .load(src)
      .then(() => {
        const allTracks = player.getVariantTracks();
        const audioTracks = allTracks.filter((t: any) => t.type === 'audio');

        console.log('🔊 All Tracks:', allTracks);
        console.log('🔉 Audio Tracks:', audioTracks);

        // Duration 얻기
        onDuration(video.duration);
      })
      .catch((err: any) => {
        console.error('Error loading video:', err);
      });

    return () => {
      player.destroy();
    };
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMute;

    if (isPlaying) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [isPlaying, isMute]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && isPlaying) {
        onProgress(videoRef.current.currentTime);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div style={{position: 'relative', width: '100%', height: '100%'}}>
      <video
        ref={videoRef}
        width="100%"
        height="calc(100% - 4px)"
        style={{borderRadius: '8px', objectFit: 'contain', backgroundColor: 'black'}}
        playsInline
        controls={false}
      />
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 13,
        }}
      >
        <div className={`${isVisible ? 'fadeAndGrow' : 'fadeOutAndShrink'}`}>
          <img
            src={isPlaying ? pauseIcon : playIcon}
            onClick={onClickPlayPause}
            style={{width: '60px', height: '60px'}}
          />
        </div>
      </div>
    </div>
  );
};

export default ShakaPlayerWrapper;
