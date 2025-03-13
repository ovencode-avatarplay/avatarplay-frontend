import React, {useRef, useState} from 'react';
import styles from './PopupFriendsSuggestion.module.scss';
import {BoldArrowLeft, LineFollow, LineSearch} from '@ui/Icons';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';
import {Dialog} from '@mui/material';
import cx from 'classnames';

type Props = {
  onClose: () => void;
};

const PopupFriendsSuggestion = ({onClose}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<{
    indexTab: number;
  }>({
    indexTab: 0,
  });

  const handleChange = () => {};

  return (
    <>
      <Dialog open={true} onClose={onClose} fullScreen>
        <header className={styles.header}>
          <div className={styles.left}>
            <img
              className={styles.btnBack}
              src={BoldArrowLeft.src}
              alt=""
              onClick={() => {
                onClose();
              }}
            />
            <div className={styles.title}>Suggestion for you</div>
          </div>
          <div className={styles.right}></div>
        </header>
        <main className={styles.main}>
          <div className={styles.searchWrap}>
            <img className={styles.iconSearch} src={LineSearch.src} alt="" />
            <input ref={inputRef} placeholder="Search" onChange={handleChange} />
          </div>

          <div className={styles.shareWrap}>
            <img className={styles.btnAdd} src={LineFollow.src} alt="" />
            <div className={styles.label}>Share Add Friend</div>
          </div>

          <div className={styles.count}>Featured</div>
          <ul className={styles.followList}>
            <li className={styles.item}>
              <div className={styles.left}>
                <img className={styles.thumbnail} src="/images/profile_sample/img_sample_profile1.png" alt="" />
                <div className={styles.infoWrap}>
                  <div className={styles.name}>Sally</div>
                  <div className={styles.role}>Channel</div>
                </div>
              </div>
              <div className={styles.right}>
                <button className={styles.follow}>Follow</button>
              </div>
            </li>
            <li className={styles.item}>
              <div className={styles.left}>
                <img className={styles.thumbnail} src="/images/profile_sample/img_sample_profile1.png" alt="" />
                <div className={styles.infoWrap}>
                  <div className={styles.name}>Sally</div>
                  <div className={styles.role}>Channel</div>
                </div>
              </div>
              <div className={styles.right}>
                <button className={cx(styles.follow, styles.active)}>Follow</button>
              </div>
            </li>
          </ul>
        </main>
        <footer></footer>
      </Dialog>
    </>
  );
};

export default PopupFriendsSuggestion;
