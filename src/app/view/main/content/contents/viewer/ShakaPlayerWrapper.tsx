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
    const allTracks = player.getVariantTracks(); // 모든 트랙
    const audioTracks = allTracks.filter((t: any) => t.language); // 언어 정보가 있는 트랙 = 오디오
    console.log('🎧 Audio Tracks:', audioTracks);

    player.load(src).then(() => {
      onDuration(video.duration);
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
