import React, {useState} from 'react';
import {Drawer, DrawerProps} from '@mui/material';

import styles from './CustomDrawer.module.css';

interface CustomDrawerProps extends Omit<DrawerProps, 'onClose' | 'open'> {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({open, onClose, children, ...rest}) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(currentY - startY, 0); // 음수 방지
      setTranslateY(distance);
    }
  };

  const handleTouchEnd = () => {
    const threshold = 100; // 닫히는 기준 거리
    if (translateY > threshold) {
      onClose(); // 기준 거리 이상이면 Drawer 닫기
    } else {
      setTranslateY(0); // 기준 거리 미만이면 원위치로
    }
    setStartY(null);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        className: styles.drawerContainer,
        style: {
          transform: `translateY(${translateY}px)`,
          transition: startY === null ? 'transform 0.3s ease' : 'none',
          maxHeight: 'calc((var(--vh, 1vh) * 100) - 111px)',
        },
      }}
      {...rest}
    >
      <div
        className={styles.touchArea}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.handleArea}>
          <div className={styles.handle} />
        </div>
        <div className={styles.contentArea}>{children}</div>
      </div>
    </Drawer>
  );
};

export default CustomDrawer;