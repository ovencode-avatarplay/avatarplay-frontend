import React, { useState } from 'react';
import ContentDashboardHeader from '../content-main/content-dashboard/ContentDashboardHeader';
import { pushLocalizedRoute } from '@/utils/UrlMove';
import { useRouter } from 'next/navigation';
import styles from './PostMain.module.css';
import { LineUpload } from '@ui/Icons';

interface Props {}

const PostMain: React.FC<Props> = () => {
  const router = useRouter();
  const [text, setText] = useState(''); // 입력된 텍스트 상태
  const maxLength = 500; // 최대 문자 수
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= maxLength) {
      setText(event.target.value); // 입력된 텍스트 업데이트
    }
  };
  const handleUpload = () => {
    console.log('File uploaded!');
    // 파일 업로드 처리 로직 추가
  };

  return (
    <div className={styles.box}>
      <ContentDashboardHeader
        title="Title"
        onClose={() => {
          pushLocalizedRoute('/main/homefeed', router);
        }}
        onCreate={() => {}}
      ></ContentDashboardHeader>

      <div className={styles.container}>
        <div className={styles.label}>Photo / Video</div>
        <div className={styles.inputBox} onClick={handleUpload}>
          <div className={styles.uploadIcon}>
            <img src={LineUpload.src} alt="upload-icon" />
          </div>
          <div className={styles.hintText}>Upload</div>
        </div>
        <div className={styles.infoText}>Photo 0/9 or Video 0/1</div>

        <div className={styles.label} style={{marginTop: '28px'}}>Description</div>
    
        <div className={styles.inputArea}>
          <textarea
            placeholder="Text..."
            className={styles.textArea}
            value={text}
            onChange={handleTextChange}
          />
          <div className={styles.charCount}>
            {text.length}/{maxLength}
          </div>
        </div>

      </div>
      <div className={styles.contentBottom}>
        <div className={styles.setupButtons} onClick={() => {}}>
          Confirm
        </div>
      </div>
    </div>
  );
};

export default PostMain;
