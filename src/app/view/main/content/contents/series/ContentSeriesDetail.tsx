'use client';

import {
  BoldAltArrowDown,
  BoldArchive,
  BoldArrowLeft,
  BoldAudioPause,
  BoldAudioPlay,
  BoldDownloadMini,
  BoldLock,
  BoldReward,
  BoldShare,
  BoldStar,
  LineArrowDown,
  LineCheck,
  LineEdit,
} from '@ui/Icons';
import React, {useState} from 'react';
import styles from './ContentSeriesDetail.module.scss';
import cx from 'classnames';
import {SelectBox} from '@/app/view/profile/ProfileBase';
import {TextArea} from '@/app/view/profile/ProfileDetail';
import {getBackUrl, getLocalizedLink} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';

type Props = {};

enum eTabType {
  Episodes,
  About,
}

const ContentSeriesDetail = (props: Props) => {
  const router = useRouter();
  const [data, setData] = useState<{
    indexTab: eTabType;
  }>({
    indexTab: eTabType.Episodes,
  });

  const routerBack = () => {
    // you can get the prevPath like this
    const prevPath = getBackUrl();
    if (!prevPath || prevPath == '') {
      router.replace(getLocalizedLink('/main/homefeed'));
    } else {
      router.replace(prevPath);
    }
  };

  return (
    <>
      <header className={styles.header}>
        <img
          className={styles.btnBack}
          src={BoldArrowLeft.src}
          alt=""
          onClick={() => {
            routerBack();
          }}
        />
        <img className={styles.btnEdit} src={LineEdit.src} alt="" />
      </header>
      <main className={styles.main}>
        <section className={styles.thumbnailWrap}>
          <img src="/images/profile_sample/img_sample_profile1.png" alt="" />
        </section>
        <button className={styles.btnPlayWrap}>
          <img src={BoldAudioPlay.src} alt="" />
          <div className={styles.label}>Play</div>
        </button>
        <section className={styles.infoHeaderSection}>
          <ul className={styles.iconsWrap}>
            <div className={styles.iconWrap}>
              <img src={BoldArchive.src} alt="" />
              <div className={styles.label}>Favorite</div>
            </div>
            <div className={styles.lineVertical}></div>
            <div className={styles.iconWrap}>
              <img src={BoldShare.src} alt="" />
              <div className={styles.label}>Share</div>
            </div>
            <div className={styles.lineVertical}></div>

            <div className={styles.iconWrap}>
              <img src={BoldDownloadMini.src} alt="" />
              <div className={styles.label}>Download</div>
            </div>
            <div className={styles.lineVertical}></div>
            <div className={styles.iconWrap}>
              <img src={BoldReward.src} alt="" />
              <div className={styles.label}>Gift</div>
            </div>
          </ul>
          <div className={styles.genreWrap}> Comedy&nbsp;&nbsp;/&nbsp;&nbsp;Love&nbsp;&nbsp;/&nbsp;&nbsp;Drama</div>
        </section>
        <section className={styles.contentSection}>
          <ul
            className={styles.tabs}
            onClick={async (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
              const target = e.target as HTMLElement;
              const category = target.closest('[data-tab]')?.getAttribute('data-tab');
              if (category) {
                const indexTab = parseInt(category);
                // onTabChange(indexTab);
                data.indexTab = indexTab;
                setData({...data});
              } else {
                return;
              }
            }}
          >
            <li
              className={cx(styles.tab, data.indexTab == eTabType.Episodes && styles.active)}
              data-tab={eTabType.Episodes}
            >
              Episodes
            </li>
            <li className={cx(styles.tab, data.indexTab == eTabType.About && styles.active)} data-tab={eTabType.About}>
              About
            </li>
          </ul>
          <section className={styles.tabContentSection}>
            {data.indexTab == eTabType.Episodes && (
              <>
                <div className={styles.selectSeason}>
                  <SelectBox
                    value={{value: 'Season 1', id: 0}}
                    options={[
                      {value: 'Season 1', id: 0},
                      {value: 'Season 2', id: 1},
                    ]}
                    ArrowComponent={SelectBoxArrowComponent}
                    ValueComponent={SelectBoxValueComponent}
                    OptionComponent={SelectBoxOptionComponent}
                    onChange={async id => {}}
                    customStyles={{
                      menuList: {
                        borderRadius: '10px',
                        border: '1px solid var(--Border-1, #EAECF0)',
                        background: 'var(--White, #FFF)',
                      },
                      option: {
                        padding: 0,
                      },
                      menu: {
                        marginTop: '4px',
                      },
                    }}
                  />
                </div>

                <ul className={styles.episodeList}>
                  <li className={styles.item}>
                    <div className={styles.left}>
                      <div className={styles.imgWrap}>
                        <img className={styles.thumbnail} src="/images/profile_sample/img_sample_profile1.png" alt="" />
                        <img src={BoldLock.src} alt="" className={styles.iconLock} />
                      </div>

                      <div className={styles.name}>1. Pilot</div>
                    </div>
                    <div className={styles.right}>
                      <div className={styles.starWrap}>
                        <img src={BoldStar.src} alt="" className={styles.iconStar} />
                        <div className={styles.count}>12</div>
                      </div>
                    </div>
                  </li>
                  <li className={styles.item}>
                    <div className={styles.left}>
                      <div className={styles.imgWrap}>
                        <img className={styles.thumbnail} src="/images/profile_sample/img_sample_profile1.png" alt="" />
                        <img src={BoldLock.src} alt="" className={styles.iconLock} />
                      </div>

                      <div className={styles.name}>1. Pilot</div>
                    </div>
                    <div className={styles.right}>
                      <div className={styles.starWrap}>
                        <img src={BoldStar.src} alt="" className={styles.iconStar} />
                        <div className={styles.count}>12</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </>
            )}

            {data.indexTab == eTabType.About && (
              <div className={styles.textareaWrap}>
                <TextArea
                  value={
                    "In Ruben Östlund's wickedly funny Palme d'Or winner, social hierarchy is turned upside down, revealing the tawdry relationship between power and beauty. Celebrity model couple, Carl (Harris Dickinson) and Yaya (Charlbi Dean), are invited on a luxury cruise for the uber-rich, helmed by an unhinged boat captain (Woody Harrelson). What first appeared instagrammable ends catastrophically, leaving the survivors stranded on a desert island and fighting for survival."
                  }
                ></TextArea>
              </div>
            )}
          </section>
        </section>
      </main>
      <footer></footer>
    </>
  );
};

export default ContentSeriesDetail;

const SelectBoxArrowComponent = () => <></>;

const SelectBoxValueComponent = (data: any, isSelected?: boolean) => {
  return (
    <div className={styles.labelWrap}>
      <div key={data.id} className={styles.label}>
        {data.value}
      </div>
      <img className={styles.icon} src={LineArrowDown.src} alt="altArrowDown" />
    </div>
  );
};
const SelectBoxOptionComponent = (data: any, isSelected: boolean) => (
  <>
    <div className={styles.optionWrap}>
      <div key={data.id} className={styles.labelOption}>
        {data.value}
      </div>
      {isSelected && <img className={styles.iconCheck} src={LineCheck.src} alt="altArrowDown" />}
    </div>
  </>
);
