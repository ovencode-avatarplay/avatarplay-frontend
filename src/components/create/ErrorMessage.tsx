import React from 'react';
import styles from './ErrorMessage.module.css'; // 필요한 CSS 파일

interface ErrorMessageProps {
  message: string; // 표시할 에러 메시지
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({message}) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorMessage}>
        <div className={styles.errorIcon}></div>
        <span className={styles.errorText}>{message}</span>
      </div>
    </div>
  );
};

export default ErrorMessage;
