import React, {useState} from 'react';
import {Drawer, DrawerProps} from '@mui/material';

import styles from './CustomDrawer.module.css';

interface CustomDrawerProps extends Omit<DrawerProps, 'onClose' | 'open'> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  containerStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  customTitle?: string;
}

const CustomDrawer: React.FC<CustomDrawerProps> = ({
  open,
  onClose,
  children,
  title,
  containerStyle,
  contentStyle,
  customTitle,
  ...rest
}) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const [isTouching, setIsTouching] = useState(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    console.log('handleTouchStart', e.touches[0].clientY);
    setStartY(e.touches[0].clientY);
    setIsTouching(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (startY !== null && isTouching) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(currentY - startY, 0); // 음수 방지
      setTranslateY(distance);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (isTouching) {
      const threshold = 100; // 닫히는 기준 거리
      if (translateY > threshold) {
        onClose(); // 기준 거리 이상이면 Drawer 닫기
        console.log('close');
      } else {
        setTranslateY(0); // 기준 거리 미만이면 원위치로
      }
      setStartY(null);
    }
    setIsTouching(false);
    console.log('handleTouchEnd', translateY);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      ModalProps={{
        style: {zIndex: 3000}, // 원하는 값으로 변경
      }}
      PaperProps={{
        className: styles.drawerContainer,
        style: {
          maxHeight: 'var(--body-height)',
          ...containerStyle,
          transform: `translateY(${translateY}px)`,
          transition: startY === null ? 'transform 0.3s ease' : 'none',
        },
      }}
      {...rest}
    >
      <div className={styles.touchArea}>
        <div
          className={styles.handleArea}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={styles.handle} />
        </div>
        {title && title !== '' && <div className={`${styles.titleArea} ${customTitle}`}>{title}</div>}
        <div className={styles.contentArea} style={contentStyle}>
          {children}
        </div>
      </div>
    </Drawer>
  );
};

export default CustomDrawer;
