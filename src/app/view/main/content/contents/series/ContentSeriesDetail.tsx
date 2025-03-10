'use client';
import parse from 'html-react-parser';
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
import React, {useEffect, useState} from 'react';
import styles from './ContentSeriesDetail.module.scss';
import cx from 'classnames';
import {SelectBox} from '@/app/view/profile/ProfileBase';
import {TextArea} from '@/app/view/profile/ProfileDetail';
import {getBackUrl, getLocalizedLink} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {
  GetContentReq,
  GetContentRes,
  GetSeasonEpisodesReq,
  GetSeasonEpisodesRes,
  sendGetContent,
  sendGetSeasonEpisodes,
} from '@/app/NetWork/ContentNetwork';
import SharePopup from '@/components/layout/shared/SharePopup';

type Props = {
  id: number;
};

enum eTabType {
  Episodes,
  About,
}

const ContentSeriesDetail = ({id}: Props) => {
  const router = useRouter();
  const [data, setData] = useState<{
    indexTab: eTabType;
    dataContent: GetContentRes | null;
    dataEpisodes: GetSeasonEpisodesRes | null;
    season: number;
    isShareOpened: boolean;
  }>({
    indexTab: eTabType.Episodes,
    dataContent: null,
    dataEpisodes: null,
    season: 0,
    isShareOpened: false,
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

  useEffect(() => {
    refreshInfo();
  }, []);

  const refreshInfo = async () => {
    const dataGetContent: GetContentReq = {
      contentId: id,
    };
    const resGetContent = await sendGetContent(dataGetContent);
    const seasonNo = 1;
    console.log('resGetContnet', resGetContent.data);

    if (resGetContent?.data) {
      data.dataContent = resGetContent?.data;
    }
    const dataGetSeasonEpisodesReq: GetSeasonEpisodesReq = {contentId: id, seasonNo: seasonNo};

    const resGetSeasonEpisodes = await sendGetSeasonEpisodes(dataGetSeasonEpisodesReq);
    console.log('rsGetSeasonEpisodes : ', resGetSeasonEpisodes.data);
    if (resGetSeasonEpisodes.data) {
      data.dataEpisodes = resGetSeasonEpisodes.data;
    }
    setData({...data});
  };

  const genreList = data.dataContent?.contentInfo.genre.split(',').map(v => v.trim());
  const genreStr = genreList?.join('&nbsp;&nbsp;/&nbsp;&nbsp;') || '';

  const seasonCount = data.dataContent?.contentInfo?.maxSeasonNo || 0;
  const seasonList = Array.from({length: seasonCount}, (_, i) => ({
    value: `Season ${i + 1}`,
    id: i,
  }));
  console.log(seasonList[0]);

  const handleShare = async (url: string = window.location.href) => {
    const shareData = {
      title: '공유하기 제목',
      text: '이 링크를 확인해보세요!',
      url: url, // 현재 페이지 URL
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData); // 네이티브 공유 UI 호출
      } catch (error) {
        console.error('공유 실패:', error);
      }
    } else {
      data.isShareOpened = true;
      setData({...data});
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
          <img src={data.dataContent?.contentInfo.thumbnailUrl} alt="" />
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
            <div
              className={styles.iconWrap}
              onClick={() => {
                handleShare();
              }}
            >
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
          <div className={styles.genreWrap}> {parse(genreStr)}</div>
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
                    value={seasonList?.[0]}
                    options={seasonList}
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
                  {data.dataEpisodes?.episodeList.map((one, index) => {
                    return (
                      <li className={styles.item} key={`${data.season}_${one.episodeId}`}>
                        <div className={styles.left}>
                          <div className={styles.imgWrap}>
                            <img className={styles.thumbnail} src={one.thumbnailUrl} alt="" />
                            <img src={BoldLock.src} alt="" className={styles.iconLock} />
                          </div>

                          <div className={styles.name}>{`${one.episodeNo}.${one.episodeName}`}</div>
                        </div>
                        <div className={styles.right}>
                          <div className={styles.starWrap}>
                            <img src={BoldStar.src} alt="" className={styles.iconStar} />
                            <div className={styles.count}>99</div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {data.indexTab == eTabType.About && (
              <div className={styles.textareaWrap}>
                <TextArea value={data.dataContent?.contentInfo?.description || ''}></TextArea>
              </div>
            )}
          </section>
        </section>
      </main>
      <footer></footer>
      <SharePopup
        open={data.isShareOpened}
        title={data.dataContent?.contentInfo.name || ''}
        url={window.location.href}
        onClose={() => {
          setData(v => ({...v, isShareOpened: false}));
        }}
      ></SharePopup>
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
