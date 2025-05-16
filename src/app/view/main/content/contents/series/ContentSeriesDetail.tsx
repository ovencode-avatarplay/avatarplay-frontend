'use client';
import parse from 'html-react-parser';
import {
  BoldAltArrowDown,
  BoldArchive,
  LineArrowLeft,
  BoldAudioPause,
  BoldAudioPlay,
  LineDownload,
  BoldLock,
  BoldRadioButtonSquare,
  BoldRadioButtonSquareSelected,
  BoldReward,
  BoldRuby,
  BoldShare,
  BoldStar,
  LineArchive,
  LineArrowDown,
  LineCheck,
  LineEdit,
} from '@ui/Icons';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import styles from './ContentSeriesDetail.module.scss';
import cx from 'classnames';
import {SelectBox} from '@/app/view/profile/ProfileBase';
import {TextArea} from '@/app/view/profile/ProfileDetail';
import {getLocalizedLink} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import {
  buyContentEpisode,
  BuyContentEpisodeReq,
  CheckContentType,
  ContentEpisodeState,
  ContentInfo,
  ContentState,
  ContentType,
  GetContentReq,
  GetContentRes,
  GetSeasonEpisodesReq,
  GetSeasonEpisodesRes,
  sendCheckContentState,
  sendGetContent,
  sendGetSeasonEpisodes,
  ContentCategoryType,
  ContentLanguageType,
  ContentPlayInfo,
  GetSeasonEpisodesPopupReq,
  GetSeasonEpisodesPopupRes,
  PlayButtonReq,
  PlayReq,
  RecordPlayReq,
  SeasonEpisodeInfo,
  sendGetSeasonEpisodesPopup,
  sendPlay,
  sendPlayButton,
  sendRecordPlay,
} from '@/app/NetWork/ContentNetwork';
import SharePopup from '@/components/layout/shared/SharePopup';
import Link from 'next/link';
import {Dialog} from '@mui/material';
import {Category, TurnedIn} from '@mui/icons-material';
import {bookmark, BookMarkReq, InteractionType} from '@/app/NetWork/CommonNetwork';
import ViewerContent from '../viewer/ViewerContent';
import {setEpisodeId} from '@/redux-store/slices/Chatting';
import useCustomRouter from '@/utils/useCustomRouter';
import DrawerDonation from '../../create/common/DrawerDonation';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {formatCurrency} from '@/utils/util-1';
import formatText from '@/utils/formatText';
import {setStar} from '@/redux-store/slices/Currency';
import {ResponseAPI} from '@/app/NetWork/ApiInstance';

type Props = {
  type: ContentType;
  id: string;
};

enum eTabType {
  Episodes,
  About,
}

const COMMON_GENRE_HEAD = 'common_genre';

interface ContentItem {
  id: number;
  type: ContentCategoryType;
  title: string;
  profileId: number;
  profileIconUrl: string;
  profileUrlLinkKey: string;
  isProfileFollow: boolean;
  isMyEpisode: boolean;
  commonMediaViewInfo: {
    isLike: boolean;
    isDisLike: boolean;
    likeCount: number;
    commentCount: number;
    isBookmark: boolean;
  };
  episodeVideoInfo?: {
    videoSourceFileInfo: {
      videoSourceUrl: string;
    };
    mpdTempUrl: string;
    subTitleFileInfos?: {
      videoLanguageType: ContentLanguageType;
      videoSourceUrl: string;
    }[];
    dubbingFileInfos?: {
      videoLanguageType: ContentLanguageType;
      videoSourceUrl: string;
    }[];
  };
  episodeWebtoonInfo?: {
    webtoonSourceUrlList: {
      webtoonLanguageType: ContentLanguageType;
      webtoonSourceUrls: string[];
    }[];
  };
}

const ContentSeriesDetail = ({id, type}: Props) => {
  const {back} = useCustomRouter();
  const refThumbnailWrap = useRef<HTMLDivElement | null>(null);
  const [onPlay, setOnPlay] = useState(false);
  const [isPlayButton, setIsPlayButton] = useState(false);
  const [playContentId, setPlayContentId] = useState(0);
  const [playEpisodeId, setPlayEpisodeId] = useState<number>(0);
  const [playContents, setPlayContents] = useState<ContentItem[]>([]);
  const [initialPlayIndex, setInitialPlayIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [data, setData] = useState<{
    indexTab: eTabType;
    // dataContent: GetContentRes | null;
    dataEpisodes: GetSeasonEpisodesRes | null;
    dataMix?: Partial<GetSeasonEpisodesRes & ContentInfo & {isSingleContentLock: boolean}>;
    season: number;
    isShareOpened: boolean;
    isSingle: boolean;
    categoryType: number;

    dataPurchase: {
      isOpenPopupPurchase: boolean;
      contentId: number;
      episodeId: number;
      price: number;
      contentType: ContentType;
    };

    dataGift: {
      isOpen: boolean;
    };
  }>({
    indexTab: eTabType.Episodes,
    categoryType: 0,
    // dataContent: null,
    dataEpisodes: null,
    season: 1,
    isShareOpened: false,
    isSingle: false,

    dataPurchase: {
      isOpenPopupPurchase: false,
      contentId: 0,
      episodeId: 0,
      price: 0,
      contentType: ContentType.Series,
    },

    dataGift: {
      isOpen: false,
    },
  });

  const routerBack = () => {
    back('/profile/' + data.dataMix?.profileUrlLinkKey);
  };

  useLayoutEffect(() => {
    refreshInfo();
  }, []);

  const refreshInfo = async () => {
    const isSingle = type == ContentType.Single;
    data.isSingle = isSingle;

    if (isSingle) {
      const dataGetContent: GetContentReq = {
        urlLinkKey: id,
      };

      const resGetContent = await sendGetContent(dataGetContent);
      console.log('resGetContent', resGetContent.data);

      if (resGetContent?.data) {
        data.dataMix = resGetContent?.data.contentInfo;
        data.dataMix.profileUrlLinkKey = resGetContent?.data.profileUrlLinkKey;
        data.dataMix.isSingleContentLock = resGetContent?.data.isSingleContentLock;
        data.dataMix.isMyContent = resGetContent?.data.isMyContent;
        data.categoryType = resGetContent.data.contentInfo.categoryType;
        data.dataMix.isProfileSubscribe = resGetContent.data.isProfileSubscribe;
        // data.dataMix.profileId = resGetContent?.data.contentInfo.profileId;
        // data.dataMix.thumbnailMediaState =
      }
    } else {
      const seasonNo = data.season;
      const dataGetSeasonEpisodesReq: GetSeasonEpisodesReq = {
        urlLinkKey: id,
        seasonNo: seasonNo,
      };
      console.log('data : ', data);
      const resGetSeasonEpisodes = await sendGetSeasonEpisodes(dataGetSeasonEpisodesReq);
      if (resGetSeasonEpisodes.resultCode != 0) {
        alert(resGetSeasonEpisodes.resultMessage);
        return;
      }

      console.log('resGetSeasonEpisodes : ', resGetSeasonEpisodes.data);
      if (resGetSeasonEpisodes.data) {
        data.categoryType = resGetSeasonEpisodes.data.contentCategoryType;
        data.dataEpisodes = resGetSeasonEpisodes.data;
        data.dataMix = resGetSeasonEpisodes.data;
      }
    }

    setData({...data});
    setStartCheck(true);
  };

  const [startCheck, setStartCheck] = useState(false);
  useEffect(() => {
    // 🔍 Single인 경우
    if (data.isSingle && data.dataMix && data.dataMix.state === ContentState.Upload) {
      const interval = setInterval(async () => {
        try {
          if (!data.dataMix || !data.dataMix.id) return;
          const res = await sendCheckContentState({
            checkContentType: CheckContentType.Content, // Episode
            checkIdList: [data.dataMix.id],
          });

          const newState = res.data?.checkContentItemList.find(item => item.id === data.dataMix!.id)?.state;

          if (newState !== undefined && newState !== ContentEpisodeState.Upload) {
            data.dataMix!.state = newState;
            setData({...data});
            clearInterval(interval);
          }
        } catch (error) {
          console.error('싱글 콘텐츠 업로드 상태 체크 실패:', error);
        }
      }, 1000);

      return () => clearInterval(interval);
    }

    // 🔍 Series인 경우
    if (!data.isSingle && data.dataEpisodes?.episodeList.some(ep => ep.episodeState === ContentEpisodeState.Upload)) {
      const interval = setInterval(async () => {
        try {
          const uploadingEpisodes = data.dataEpisodes?.episodeList.filter(
            ep => ep.episodeState === ContentEpisodeState.Upload,
          );
          if (!uploadingEpisodes || uploadingEpisodes.length === 0) return;

          const ids = uploadingEpisodes.map(ep => ep.episodeId!);
          const res = await sendCheckContentState({checkContentType: CheckContentType.Episode, checkIdList: ids});

          const updatedList = data.dataEpisodes?.episodeList.map(ep => {
            const updated = res.data?.checkContentItemList.find(item => item.id === ep.episodeId);
            return updated ? {...ep, episodeState: updated.state} : ep;
          });

          data.dataEpisodes!.episodeList = updatedList!;
          setData({...data});

          const stillUploading = updatedList?.some(ep => ep.episodeState === ContentEpisodeState.Upload);
          if (!stillUploading) clearInterval(interval);
        } catch (error) {
          console.error('시리즈 에피소드 업로드 상태 체크 실패:', error);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [startCheck]);

  const genreList = data.dataMix?.genre
    ?.split(',')
    .map(v => v.trim())
    .map(v => {
      const value = v.includes(COMMON_GENRE_HEAD) ? getLocalizedText(v) : v;
      return value;
    });
  const genreStr = genreList?.join('&nbsp;&nbsp;/&nbsp;&nbsp;') || '';

  const seasonCount = data.dataMix?.maxSeasonNo || 0;
  const seasonList = Array.from({length: seasonCount}, (_, i) => ({
    value: `Season ${i + 1}`,
    id: i + 1,
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

  const onEdit = () => {};
  console.log('asdadsa', data.dataMix?.categoryType);
  const urlEdit = data.isSingle ? '/update/content/single' : '/create/content/series';
  console.log('contentID : ', playContentId);
  console.log('onPlay : ', onPlay);

  const handlePlayContent = async (contentId: number, episodeId?: number) => {
    try {
      setIsLoading(true);
      const testEpisodeIds = [112, 194];
      const contents: ContentItem[] = [];

      for (const testEpisodeId of testEpisodeIds) {
        const playRequest: PlayReq = {
          contentId: contentId,
          episodeId: testEpisodeId,
        };
        const response = await sendPlay(playRequest);

        if (response?.data?.recentlyPlayInfo) {
          const playInfo = response.data.recentlyPlayInfo;
          contents.push({
            id: playInfo.contentId,
            type: playInfo.categoryType,
            title: playInfo.title,
            profileId: playInfo.profileId,
            profileIconUrl: playInfo.profileIconUrl,
            profileUrlLinkKey: playInfo.profileUrlLinkKey,
            isProfileFollow: playInfo.isProfileFollow,
            isMyEpisode: playInfo.isMyEpisode,
            commonMediaViewInfo: playInfo.commonMediaViewInfo,
            episodeVideoInfo: playInfo.episodeVideoInfo,
            episodeWebtoonInfo: playInfo.episodeWebtoonInfo,
          });
        }
      }

      if (contents.length > 0) {
        setPlayContents(contents);
        setInitialPlayIndex(0);
        setOnPlay(true);
      }
    } catch (error) {
      console.error('Play API 호출 오류:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (contentId: number, episodeId?: number) => {
    handlePlayContent(contentId, episodeId);
  };

  return (
    <>
      <main className={styles.main}>
        <header className={styles.header}>
          <img
            className={styles.btnBack}
            src={LineArrowLeft.src}
            alt=""
            onClick={() => {
              routerBack();
            }}
          />
          {data?.dataMix?.isMyContent && (
            <Link href={getLocalizedLink(`${urlEdit}/${id}`)}>
              <img className={styles.btnEdit} src={LineEdit.src} alt="" />
            </Link>
          )}
        </header>
        <section ref={refThumbnailWrap} className={styles.thumbnailWrap}>
          {data.dataMix?.thumbnailMediaState == MediaState.Image && (
            <img
              className={styles.thumbnail}
              src={data.dataMix?.contentThumbnailUrl || data.dataMix?.thumbnailUrl}
              alt=""
            />
          )}
          {data.dataMix?.thumbnailMediaState == MediaState.Video && (
            <video
              playsInline
              className={styles.thumbnail}
              loop={true}
              muted={true}
              autoPlay={true}
              src={data.dataMix?.contentThumbnailUrl || data.dataMix?.thumbnailUrl}
            />
          )}
        </section>
        {data.categoryType == 1 && (
          <button
            className={styles.btnPlayWrap}
            onClick={() => {
              setOnPlay(true);
              setIsPlayButton(true);
              console.log('data', data);
              handlePlay(data.isSingle ? data.dataMix?.id || 0 : data.dataMix?.contentId || 0);
            }}
          >
            <img src={BoldAudioPlay.src} alt="" />
            <div className={styles.label}>{getLocalizedText('common_button_play')}</div>
          </button>
        )}

        <section className={styles.infoHeaderSection}>
          <ul className={styles.iconsWrap}>
            <div
              className={styles.iconWrap}
              onClick={async () => {
                const dataReq: BookMarkReq = {
                  interactionType: type == ContentType.Series ? InteractionType.Contents : InteractionType.Episode,
                  isBookMark: !data.dataMix?.isBookMark,
                  typeValueId: data.dataMix?.contentId || 0,
                };
                const response = await bookmark(dataReq);
                await refreshInfo();
                console.log('response : ', response);
                //TODO : 북마크 이후 리프레쉬로 북마크 여부 갱신해야함
              }}
            >
              <div className={styles.iconArea}>
                {data.dataMix?.isBookMark && <img src={BoldArchive.src} alt="" />}
                {!data.dataMix?.isBookMark && <img src={LineArchive.src} alt="" />}
              </div>
              <div className={styles.label}>{getLocalizedText('common_label_favorite')}</div>
            </div>
            <div className={styles.lineVertical}></div>
            <div
              className={styles.iconWrap}
              onClick={() => {
                handleShare();
              }}
            >
              <img src={BoldShare.src} alt="" />
              <div className={styles.label}>{getLocalizedText('common_button_share')}</div>
            </div>
            <div className={styles.lineVertical}></div>

            <div className={styles.iconWrap}>
              <img src={LineDownload.src} alt="" />
              <div className={styles.label}>{getLocalizedText('common_button_download')}</div>
            </div>
            {!data.dataMix?.isMyContent && (
              <>
                <div className={styles.lineVertical}></div>
                <div
                  className={styles.iconWrap}
                  onClick={() => {
                    data.dataGift.isOpen = true;
                    setData({...data});
                  }}
                >
                  <img src={BoldReward.src} alt="" />
                  <div className={styles.label}>{getLocalizedText('common_button_gift')}</div>
                </div>
              </>
            )}
          </ul>
          <div className={styles.genreWrap}> {parse(genreStr)}</div>

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
              {getLocalizedText('createcontent005_label_001')}
            </li>
            <li className={cx(styles.tab, data.indexTab == eTabType.About && styles.active)} data-tab={eTabType.About}>
              {getLocalizedText('createcontent005_label_002')}
            </li>
          </ul>
        </section>
        <section className={styles.contentSection}>
          <section className={styles.tabContentSection}>
            {data.indexTab == eTabType.Episodes && (
              <>
                {!data.isSingle && (
                  <div className={styles.selectSeason}>
                    <SelectBox
                      value={seasonList?.[(data?.season || 1) - 1]}
                      options={seasonList}
                      ArrowComponent={SelectBoxArrowComponent}
                      ValueComponent={SelectBoxValueComponent}
                      OptionComponent={SelectBoxOptionComponent}
                      onChange={async id => {
                        data.season = id;
                        setData({...data});
                        refreshInfo();
                      }}
                      customStyles={{
                        menuList: {
                          borderRadius: '10px',
                          // border: '1px solid var(--Border-1, #EAECF0)',
                          // background: 'var(--White, #FFF)',
                          background: 'var(--Neutral-800, #2C3131)',
                          overflow: 'hidden',
                        },
                        option: {
                          padding: 0,
                          borderBottom: '1px solid var(--Neutral-900, #121414)',
                        },
                        menu: {
                          marginTop: '4px',
                          background: 'transparent',
                        },
                      }}
                    />
                  </div>
                )}
                {data.isSingle && (
                  <ul className={styles.episodeList}>
                    {[''].map((one, index) => {
                      const price = data.dataMix?.salesStarEa || 0;
                      const isFree = price == 0;
                      const isLock = data.dataMix?.isSingleContentLock || false;

                      return (
                        <EpisodeComponent
                          key={`${data.season}_${data.dataMix?.id}`}
                          name={data.dataMix?.name || ''}
                          price={data.dataMix?.salesStarEa || 0}
                          thumbnailUrl={data.dataMix?.thumbnailUrl || ''}
                          isLock={data.dataMix?.isSingleContentLock || false}
                          thumbnailMediaState={data.dataMix?.thumbnailMediaState || MediaState.Image}
                          isProfileSubscribe={data.dataMix?.isProfileSubscribe}
                          isUploading={data.dataMix?.state === ContentState.Upload}
                          onClick={() => {
                            if (isFree || !isLock || data.dataMix?.isProfileSubscribe) {
                              //TODO : play처리
                              console.log('data', data, one);
                              handlePlay(data.isSingle ? data.dataMix?.id || 0 : data.dataMix?.contentId || 0);
                              return;
                            }

                            //TODO 플레이 할수 없으면 구매처리
                            data.dataPurchase.isOpenPopupPurchase = true;
                            data.dataPurchase.contentId = data.dataMix?.id || 0;
                            data.dataPurchase.episodeId = 0;
                            data.dataPurchase.price = price;
                            data.dataPurchase.contentType = ContentType.Single;

                            setData({...data});
                          }}
                        />
                      );
                    })}
                  </ul>
                )}
                {!data.isSingle && (
                  <ul className={styles.episodeList}>
                    {data.dataEpisodes?.episodeList.map((one, index) => {
                      const isFree = one.salesStarEa == 0;
                      const isLock = one.isLock;
                      return (
                        <EpisodeComponent
                          key={`${data.season}_${one.episodeId}`}
                          name={`${one.episodeNo}.${one.episodeName}`}
                          price={one.salesStarEa}
                          thumbnailUrl={one.thumbnailUrl}
                          isLock={one.isLock}
                          thumbnailMediaState={one?.thumbnailMediaState || MediaState.Image}
                          isUploading={one.episodeState === ContentEpisodeState.Upload}
                          isProfileSubscribe={data.dataMix?.isProfileSubscribe}
                          onClick={() => {
                            if (isFree || !isLock || data.dataMix?.isProfileSubscribe) {
                              //TODO : play처리
                              console.log('data', data, one);
                              handlePlay(data.dataMix?.contentId || 0, one.episodeId);
                              return;
                            }

                            //TODO 플레이 할수 없으면 구매처리
                            data.dataPurchase.isOpenPopupPurchase = true;
                            data.dataPurchase.contentId = data.dataMix?.contentId || 0;
                            data.dataPurchase.episodeId = one.episodeId;
                            data.dataPurchase.price = one.salesStarEa;
                            data.dataPurchase.contentType = ContentType.Series;

                            setData({...data});
                          }}
                        />
                      );
                    })}
                  </ul>
                )}
              </>
            )}

            {data.indexTab == eTabType.About && (
              <div className={styles.textareaWrap}>
                <TextArea value={data.dataMix?.description || ''}></TextArea>
              </div>
            )}
          </section>
        </section>
      </main>
      <footer></footer>
      <SharePopup
        open={data.isShareOpened}
        title={data.dataMix?.name || ''}
        url={window.location.href}
        onClose={() => {
          setData(v => ({...v, isShareOpened: false}));
        }}
      ></SharePopup>
      {data.dataPurchase.isOpenPopupPurchase && (
        <PopupPurchase
          contentId={data.dataPurchase.contentId}
          episodeId={data.dataPurchase.episodeId}
          price={data.dataPurchase.price}
          contentType={data.dataPurchase.contentType}
          onClose={() => {
            data.dataPurchase.isOpenPopupPurchase = false;
            setData({...data});
          }}
          onPurchaseSuccess={(contentId: number, episodeId: number, contentType: ContentType) => {
            if (contentType == ContentType.Series) {
              handlePlay(contentId || 0);
            }

            if (contentType == ContentType.Single) {
              handlePlay(contentId || 0);
            }

            refreshInfo();
          }}
        />
      )}
      {onPlay && (
        <ViewerContent
          open={onPlay}
          onClose={() => setOnPlay(false)}
          contents={playContents}
          initialIndex={initialPlayIndex}
        />
      )}

      {data.dataGift.isOpen && (
        <DrawerDonation
          giveToPDId={data.dataMix?.profileId || 0}
          isOpen={data.dataGift.isOpen}
          onClose={() => {
            data.dataGift.isOpen = false;
            setData({...data});
          }}
          sponsoredName={data.dataMix?.profileName || ''}
        />
      )}
    </>
  );
};

export default ContentSeriesDetail;

const SelectBoxArrowComponent = () => <></>;

const SelectBoxValueComponent = (data: any, isOpen?: boolean) => {
  return (
    <div className={styles.labelWrap}>
      <div key={data.id} className={styles.label}>
        {data.value}
      </div>
      <img
        className={styles.icon}
        src={LineArrowDown.src}
        alt="altArrowDown"
        style={{transform: `rotate(${isOpen ? 180 : 0}deg)`}}
      />
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
type EpisodeComponentType = {
  key: string;
  thumbnailUrl: string;
  thumbnailMediaState: MediaState;
  name: string;
  price: number;
  isLock: boolean;
  isUploading?: boolean;
  isProfileSubscribe?: boolean;
  onClick: () => void;
};
const EpisodeComponent = ({
  key,
  thumbnailUrl,
  name,
  price,
  isLock,
  thumbnailMediaState,
  isUploading = false,
  isProfileSubscribe = false,
  onClick,
}: EpisodeComponentType) => {
  const isFree = price == 0;

  console.log('isProfileSubscribe', isProfileSubscribe);
  return (
    <li
      className={styles.item}
      key={key}
      onClick={() => {
        if (!isUploading) onClick();
      }}
    >
      <div className={styles.left}>
        <div className={styles.imgWrap}>
          {thumbnailMediaState == MediaState.Image && <img className={styles.thumbnail} src={thumbnailUrl} alt="" />}
          {thumbnailMediaState == MediaState.Video && (
            <video
              playsInline
              loop={true}
              muted={true}
              autoPlay={true}
              className={styles.thumbnail}
              src={thumbnailUrl}
            />
          )}
          {isLock && !isProfileSubscribe && <img src={BoldLock.src} alt="" className={styles.iconLock} />}
          {isUploading && (
            <div className={styles.loadingOverlay}>
              <div className={styles.spinner}></div>
              <span>Uploading...</span>
            </div>
          )}
        </div>

        <div className={styles.name}>{name}</div>
      </div>
      <div className={styles.right}>
        {isFree && (
          <div className={styles.starWrap}>
            <div className={styles.count}>무료</div>
          </div>
        )}
        {!isFree && (
          <div className={styles.starWrap}>
            {isProfileSubscribe ? (
              <div className={styles.count}>구독중</div>
            ) : isLock ? (
              <>
                <img src={BoldStar.src} alt="" className={styles.iconStar} />
                <div className={styles.count}>{price}</div>
              </>
            ) : (
              <div className={styles.count}>대여중</div>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

type PopupPurchaseType = {
  contentId: number;
  episodeId: number;
  price: number;
  contentType: ContentType;
  onClose: () => void;
  onPurchaseSuccess?: (contentId: number, episodeId: number, contentType: ContentType) => void;
};
export const PopupPurchase = ({
  price,
  contentId,
  episodeId,
  contentType,
  onClose,
  onPurchaseSuccess,
}: PopupPurchaseType) => {
  const dataCurrencyInfo = useSelector((state: RootState) => state.currencyInfo);
  const refCheckHide = useRef<HTMLInputElement | null>(null);
  const [data, setData] = useState<{isOpenNotEnoughStars: boolean; isOpen: boolean}>({
    isOpenNotEnoughStars: false,
    isOpen: false,
  });

  useLayoutEffect(() => {
    const hidePopup = parseInt(localStorage.getItem('hidePopupPurchase') || '0');
    data.isOpen = !hidePopup;
    setData({...data});

    if (!!hidePopup) {
      onPurchase();
    }
  }, []);

  const openPopupNotEnoughStars = () => {
    data.isOpenNotEnoughStars = true;
    setData({...data});
  };

  const starAmount = dataCurrencyInfo.star;
  const dispatch = useDispatch();
  const onPurchase = async () => {
    const dataBuyReq: BuyContentEpisodeReq = {
      contentId: contentId,
      episodeId: episodeId,
    };
    const resBuy = await buyContentEpisode(dataBuyReq);
    if (resBuy.resultCode != 0) {
      alert('asdas');
      openPopupNotEnoughStars();
      return;
    } else {
      if (resBuy.data) dispatch(setStar(resBuy.data?.currentMyStar));
    }
    console.log('resBuy : ', resBuy);

    const hidePopup = parseInt(localStorage.getItem('hidePopupPurchase') || '0');
    if (!hidePopup) {
      localStorage.setItem('hidePopupPurchase', refCheckHide.current?.checked ? '1' : '0');
    }
    onClose();

    if (contentType == ContentType.Series) {
      if (onPurchaseSuccess) onPurchaseSuccess(contentId, episodeId, contentType);
    } else {
      if (onPurchaseSuccess) onPurchaseSuccess(contentId, episodeId, contentType);
    }
  };

  return (
    <Dialog
      open={data.isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'white',
        },
      }}
      style={{zIndex: '3001'}}
    >
      <section className={styles.popupPurchaseSection}>
        <div className={styles.categoryWrap}>
          <div className={styles.left}>
            <div className={styles.category}>{getLocalizedText('common_alert_096')}</div>
          </div>
          <div className={styles.right}>
            <div className={styles.balanceWrap}>
              <img src={BoldRuby.src} alt="" />
              <div className={styles.amount}>{formatCurrency(dataCurrencyInfo.ruby)}</div>
            </div>
            <div className={styles.balanceWrap}>
              <img src={BoldStar.src} alt="" />
              <div className={styles.amount}>{formatCurrency(dataCurrencyInfo.star)}</div>
            </div>
          </div>
        </div>
        <div className={styles.title}>{formatText(getLocalizedText('common_alert_001'), [price.toString()])} </div>
        <div className={styles.description}>{getLocalizedText('common_alert_022')}</div>

        <div className={styles.dontshowWrap}>
          <label htmlFor="dontshow">
            <div className={styles.left}>
              <input ref={refCheckHide} type="checkbox" name="dontshow" id="dontshow" onChange={e => {}} />
              <img src={BoldRadioButtonSquareSelected.src} alt="" className={styles.iconOn} />
              <img src={BoldRadioButtonSquare.src} alt="" className={styles.iconOff} />
            </div>
            <div className={styles.right}>
              <div className={styles.dontshow}>{getLocalizedText('common_alert_024')}</div>
            </div>
          </label>
        </div>
        <div className={styles.buttonWrap}>
          <button className={styles.cancel} onClick={onClose}>
            {getLocalizedText('common_button_cancel')}
          </button>
          <button className={styles.watch} onClick={onPurchase}>
            {getLocalizedText('common_button_watch')}
          </button>
        </div>
      </section>
      {data.isOpenNotEnoughStars && (
        <PopupNotEnoughStars
          onClose={() => {
            data.isOpenNotEnoughStars = false;
            setData({...data});
          }}
          onCharge={() => {
            alert('충전 페이지로 이동 예정');
          }}
        />
      )}
    </Dialog>
  );
};

type PopupNotEnoughStarsType = {
  onClose: () => void;
  onCharge: () => void;
};
const PopupNotEnoughStars = ({onClose, onCharge}: PopupNotEnoughStarsType) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      sx={{zIndex: 3001}} // Modal 자체에 z-index 설정
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'white',
        },
      }}
    >
      <section className={styles.popupNotEnoughStars}>
        <div className={styles.title}>{getLocalizedText('common_alert_046')}</div>
        <div className={styles.description}>{getLocalizedText('common_alert_074')}</div>
        <div className={styles.buttonWrap}>
          <button className={styles.cancel} onClick={onClose}>
            {getLocalizedText('common_button_cancel')}
          </button>
          <button className={styles.watch} onClick={onCharge}>
            {getLocalizedText('common_button_charge')}
          </button>
        </div>
      </section>
    </Dialog>
  );
};
