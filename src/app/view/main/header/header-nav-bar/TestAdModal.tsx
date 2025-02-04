import React from 'react';
import styles from './TestAdModal.module.css';

interface testAddProps {
  isOpen: boolean;
  onClose: () => void;
  iframeSrc?: string;
}

const TestAdModal: React.FC<testAddProps> = ({isOpen, onClose, iframeSrc}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <iframe
          id="my-chips-iframe"
          src="https://sdk.mychips.io/content?content_id=5710c01b-23a6-43a6-9c87-2c6dc8341716&user_id=&gender=&age="
          style={{height: '100%'}}
        ></iframe>
      </div>
    </div>
  );
};

export default TestAdModal;
