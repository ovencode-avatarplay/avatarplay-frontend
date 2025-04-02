import {LineArrowLeft, BoldCircleX, LineUpload} from '@ui/Icons';
import React from 'react';
import styles from './ProfileCreate.module.scss';

type Props = {};

const ProfileCreate = (props: Props) => {
  return (
    <>
      <header className={styles.header}>
        <img className={styles.iconBack} src={LineArrowLeft.src} alt="" />
        <div className={styles.title}>Title</div>
      </header>
      <main className={styles.main}>
        <section className={styles.photoVideoSection}>
          <div className={styles.label}>Photo / Video</div>
          <div className={styles.uploadWrap}>
            <img src={LineUpload.src} alt="" />
            <span>Upload</span>
          </div>
          <div className={styles.description}>Photo 0/9 or Video 0/1</div>
        </section>
        <section className={styles.uploadedSection}>
          <ul className={styles.imageList}>
            <li className={styles.item}>
              <img className={styles.imgProfile} src="/images/profile_sample/img_sample_profile1.png" alt="" />
              <img src={BoldCircleX.src} alt="" className={styles.iconRemove} />
            </li>
            <li className={styles.item}>
              <img className={styles.imgProfile} src="/images/profile_sample/img_sample_profile1.png" alt="" />
              <img src={BoldCircleX.src} alt="" className={styles.iconRemove} />
            </li>
            <li className={styles.item}>
              <img className={styles.imgProfile} src="/images/profile_sample/img_sample_profile1.png" alt="" />
              <img src={BoldCircleX.src} alt="" className={styles.iconRemove} />
            </li>
            <li className={styles.item}>
              <img className={styles.imgProfile} src="/images/profile_sample/img_sample_profile1.png" alt="" />
              <img src={BoldCircleX.src} alt="" className={styles.iconRemove} />
            </li>
            <li className={styles.item}>
              <img className={styles.imgProfile} src="/images/profile_sample/img_sample_profile1.png" alt="" />
              <img src={BoldCircleX.src} alt="" className={styles.iconRemove} />
            </li>
          </ul>
          <div className={styles.description}>
            Photo <span className={styles.bold}>0/9</span>
          </div>
        </section>

        <section className={styles.uploadedSection}>
          <ul className={styles.imageList}>
            <li className={styles.item}>
              <video className={styles.imgProfile} src="/images/profile_sample/video_sample_upload1.mp4" />
              <img src={BoldCircleX.src} alt="" className={styles.iconRemove} />
              <img src="/ui/profile/icon_profile_create_play.svg" alt="" className={styles.iconPlay} />
            </li>
          </ul>
          <div className={styles.description}>
            Video <span className={styles.bold}>0/9</span>
          </div>
        </section>

        <section className={styles.DescriptionSection}>
          <div className={styles.label}>Description</div>
          <div className={styles.textareaWrap}>
            <textarea>
              Create a stunning and realistic image of a woman with vibrant and colorful hair a character with unique
              and eye-catching hair colors.
            </textarea>
            <div className={styles.textCount}>250/500</div>
          </div>
        </section>
        <button className={styles.publish}>Publish</button>
      </main>
      <footer></footer>
    </>
  );
};

export default ProfileCreate;
