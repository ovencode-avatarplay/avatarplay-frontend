import React from 'react';
import ContentDashboardHeader from '../content-main/content-dashboard/ContentDashboardHeader';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import styles from './PostMain.module.css';

interface Props {}

const PostMain: React.FC<Props> = () => {
  const router = useRouter();

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
        <div className={styles.label}>Upload</div>
        <div className={styles.inputBox} onClick={handleUpload}>
          <div className={styles.uploadIcon}></div>
          <div className={styles.hintText}>Upload</div>
        </div>
        <div className={styles.infoText}>Photo 0/9 or Video 0/1</div>
      </div>
    </div>
  );
};

export default PostMain;
