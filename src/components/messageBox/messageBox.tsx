import React from 'react';
import styles from './messageBox.module.css';

interface Button {
  label: string;
  onClick: () => void;
  backgroundColor?: string;
  color?: string;
}

interface MessageBoxProps {
  message: string;
  buttons?: Button[];
  onClose: () => void;
  buttonAlign?: 'flex-start' | 'center' | 'flex-end';
}

const MessageBox: React.FC<MessageBoxProps> = ({message, buttons = [], onClose, buttonAlign = 'center'}) => {
  return (
    <div className={styles.overlay}>
      <div
        className={styles.container}
        style={{
          width: message.length > 50 ? '400px' : '300px',
        }}
      >
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons} style={{justifyContent: buttonAlign}}>
          {buttons.map((btn, index) => (
            <button
              key={index}
              className={styles.button}
              style={{
                backgroundColor: btn.backgroundColor || '#007BFF',
                color: btn.color || '#fff',
              }}
              onClick={() => {
                btn.onClick();
                onClose();
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageBox;
