import { useEffect, useRef, useState } from 'react';
import styles from './CallingScreen.module.css';
import { FaPhone } from 'react-icons/fa';

type Props = {
    onAccept?: () => void;
    onDeny?: () => void;
    isHangOn? : boolean;
  };
  

export default function CallingScreen({ onAccept, onDeny, isHangOn } : Props) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [visible, setVisible] = useState(true);
    
    useEffect(() => {
        // Audio 객체 생성
        audioRef.current = new Audio('/audio/ringtone.mp3');
        audioRef.current.loop = true;
        audioRef.current.play().catch((err) => {
          console.warn('Autoplay blocked:', err);
        });

        const timeout = setTimeout(() => {
            if(audioRef.current)
            {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            }
            setVisible(false);
          }, 10000); // 10초 후 정지

        return () => {
            // 컴포넌트 언마운트 시 정지
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
            }
          };
    },[]);

    useEffect(() => {
        if(isHangOn)
        {
            const timeout = setTimeout(() => {
                if(audioRef.current)
                {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                }
                setVisible(false);
              }, 5000); // 10초 후 정지
        }
    }, [isHangOn])
    return (
    <>
    <div className={styles.container} style={{display: visible ? 'block' : 'none'}}>
      <div className={styles['preloader']}>
        <div className={styles['sk-spinner-pulse']}></div>
      </div>
      <img src="https://goo.gl/ZcRKXD" className={styles.iphone} />
      <div className={styles.phone}>
        <img src="https://goo.gl/9tRtQe" className={styles.bg} />
        <div className={styles.caption}>
          <h3>Incoming call</h3>
          <img src="https://goo.gl/9tRtQe" />
          <h4>라온</h4>
          <p>+000 000 0000</p>
          <div className={styles.content}>
            <ul>
              <li className={styles.deny} onClick={onDeny}><FaPhone /></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}