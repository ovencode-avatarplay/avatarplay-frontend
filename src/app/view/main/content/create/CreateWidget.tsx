import React, {useState} from 'react';

import Link from 'next/link';

import styles from './CreateWidget.module.css';
import {getLocalizedLink} from '@/utils/UrlMove';
import {LineCharacter, LineEdit, LineStory} from '@ui/Icons';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateWidget: React.FC<Props> = ({open, onClose}) => {
  const [startY, setStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(currentY - startY, 0);
      setTranslateY(distance);
    }
  };

  const handleTouchEnd = () => {
    const threshold = 100;
    if (translateY > threshold) {
      onClose();
    } else {
      setTranslateY(0);
    }
    setStartY(null);
  };

  const handleClickCharacter = () => {
    onClose;
  };

  const handleClickStory = () => {
    onClose;
  };

  const handleClickPost = () => {
    onClose;
  };

  return (
    <CustomDrawer open={open} onClose={onClose}>
      <div
        className={styles.widgetBox}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.drawerArea}>
          <div className={styles.drawerTitle}>Select Profile</div>
          <div className={styles.buttonArea}>
            <Link href={getLocalizedLink('/create/post')} passHref>
              <button className={`${styles.drawerButton} ${styles.drawerButtonTop}`} onClick={onClose}>
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineEdit.src} />
                  <div className={styles.buttonText}>Feed</div>
                </div>
              </button>
            </Link>
            <Link href={getLocalizedLink('/create/character2')} passHref>
              <button className={`${styles.drawerButton} ${styles.drawerButtonMid}`} onClick={onClose}>
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineCharacter.src} />
                  <div className={styles.buttonText}>Character</div>
                </div>
              </button>
            </Link>
            <Link href={getLocalizedLink('/create/story')} passHref>
              <button className={`${styles.drawerButton} ${styles.drawerButtonBot}`} onClick={onClose}>
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineStory.src} />
                  <div className={styles.buttonText}>Content</div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default CreateWidget;
