import React, {useRef, useState} from 'react';
import styles from './PopupFriends.module.scss';
import {BoldArrowLeft, LineFollow, LineSearch} from '@ui/Icons';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';
import {Dialog} from '@mui/material';
import cx from 'classnames';
import PopupFriendsSuggestion from './PopupFriendsSuggestion';

type Props = {
  onClose: () => void;
};

const PopupFriends = ({onClose}: Props) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<{
    indexTab: number;
    isOpenPopupFriendsSuggestion: boolean;
  }>({
    indexTab: 0,
    isOpenPopupFriendsSuggestion: false,
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
            <div className={styles.title}>Friends</div>
          </div>
          <div className={styles.right}>
            <img
              className={styles.btnAdd}
              src={LineFollow.src}
              alt=""
              onClick={() => {
                data.isOpenPopupFriendsSuggestion = true;
                setData({...data});
              }}
            />
          </div>
        </header>
        <main className={styles.main}>
          <div className={styles.tabHeaderWrap}>
            <div className={styles.line}></div>
            <div
              className={styles.tabHeader}
              onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                const target = e.target as HTMLElement;
                const category = target.closest('[data-tab]')?.getAttribute('data-tab');
                if (category) {
                  data.indexTab = parseInt(category);
                }
                setData({...data});
              }}
            >
              <div className={cx(styles.tab, data.indexTab == 0 && styles.active)} data-tab={0}>
                Follower
              </div>
              <div className={cx(styles.tab, data.indexTab == 1 && styles.active)} data-tab={1}>
                Following
              </div>
            </div>
          </div>

          <div className={styles.searchWrap}>
            <img className={styles.iconSearch} src={LineSearch.src} alt="" />
            <input ref={inputRef} placeholder="Search" onChange={handleChange} />
          </div>

          <div className={styles.count}>All 28</div>
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
      {data.isOpenPopupFriendsSuggestion && (
        <PopupFriendsSuggestion
          onClose={() => {
            data.isOpenPopupFriendsSuggestion = false;
            setData({...data});
          }}
        />
      )}
    </>
  );
};

export default PopupFriends;
