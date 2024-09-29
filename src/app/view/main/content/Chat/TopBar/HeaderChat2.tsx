import React from 'react';
import styles from '@chats/Styles/StyleChat2.module.css';

const TopBar: React.FC = () => {
    
  return (
    <div className={styles.topBar}>
      <button className={styles.backButton}>뒤로가기</button>
      <img src="대화상대_이미지_URL" alt="대화상대" className={styles.avatar} />
      <div className={styles.userInfo}>
        <span className={styles.username}>대화상대 이름</span>
        <span className={styles.description}>대화상대 설명</span>
      </div>
      <button className={styles.toggleBackground}>배경 보기/숨기기</button>
      <button className={styles.moreButton}>≡</button>
    </div>
  );
};

export default TopBar;