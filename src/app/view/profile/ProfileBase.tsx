'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';

import {Box, Button, Drawer} from '@mui/material';
import ProfileTopEditMenu from './ProfileTopEditMenu';
import ProfileInfo from './ProfileInfo';
import profileData from 'data/profile/profile-data.json';
import ProfileTopViewMenu from './ProfileTopViewMenu';
import {
  BoldAltArrowDown,
  BoldArrowLeft,
  BoldHeart,
  BoldImage,
  BoldMenuDots,
  BoldMore,
  BoldPin,
  BoldVideo,
  BoldViewGallery,
  LineArrowDown,
  LineCheck,
  LineCopy,
  LineMenu,
  LinePlus,
  LineShare,
} from '@ui/Icons';
import styles from './ProfileBase.module.scss';
import cx from 'classnames';
import Select, {components, StylesConfig} from 'react-select';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {redirect, RedirectType, usePathname, useRouter, useSearchParams} from 'next/navigation';
import {
  CharacterProfileTabType,
  ExploreSortType,
  FeedMediaType,
  followProfile,
  FollowState,
  GetCharacterTabInfoeRes,
  GetPdTabInfoeRes,
  getProfileCharacterTabInfo,
  getProfileInfo,
  GetProfileInfoRes,
  getProfileList,
  getProfilePdTabInfo,
  MediaState,
  PdProfileTabType,
  ProfileSimpleInfo,
  ProfileTabItemInfo,
  ProfileType,
  selectProfile,
} from '@/app/NetWork/ProfileNetwork';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomNavColor} from '@/redux-store/slices/MainControl';
import {RootState} from '@/redux-store/ReduxStore';
import {updateProfile} from '@/redux-store/slices/Profile';
import {getCurrentLanguage, getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';
import {userDropDownAtom} from '@/components/layout/shared/UserDropdown';
import {useAtom} from 'jotai';
import Link from 'next/link';
import HamburgerBar from '../main/header/header-nav-bar/HamburgerBar';
import SharePopup from '@/components/layout/shared/SharePopup';
import {FeedInfo} from '@/app/NetWork/ShortsNetwork';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {GetCharacterInfoReq, GetCharacterInfoRes, sendGetCharacterInfo} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/ContentInfo';
import {CharacterProfileDetailComponent} from '@/app/[lang]/(pages)/profile/detail/[[...id]]/page';
import {getBackUrl} from '@/app/layout';

enum eTabPDType {
  Feed,
  Channel,
  Character,
  Shared,
}

enum eTabPDOtherType {
  Feed,
  Channel,
  Character,
}

enum eImageFilter {
  all = -1,
  image = 1,
  video = 2,
}

enum eTabCharacterType {
  Feed,
  Info,
  Contents,
  Story,
  Joined,
}
enum eTabCharacterOtherType {
  Feed,
  Info,
  Contents,
  Story,
  Joined,
}

type DataProfileType = {
  indexTab: eTabPDType | eTabCharacterType;
  isOpenSelectProfile: boolean;
  profileInfo: null | GetProfileInfoRes;
  profileTabInfo: {
    [key: number]: GetCharacterTabInfoeRes & GetPdTabInfoeRes & GetCharacterInfoRes;
  };
  indexFilterMedia: FeedMediaType;
  indexSort: ExploreSortType;
  isShowMore: boolean;
  isNeedShowMore: boolean;
  isMyMenuOpened: boolean;
  isShareOpened: boolean;
  isSettingOpen: boolean;
};

type ProfileBaseProps = {
  profileId?: number;
  onClickBack?: () => void;
  isPath?: boolean;
  maxWidth?: string;
};

const getUserType = (isMine: boolean, profileType: ProfileType) => {
  const isPD = [ProfileType.PD, ProfileType.User].includes(profileType);
  const isCharacter = [ProfileType.Character].includes(profileType);
  const isMyPD = isMine && isPD;
  const isMyCharacter = isMine && isCharacter;
  const isOtherPD = !isMine && isPD;
  const isOtherCharacter = !isMine && isCharacter;
  return {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter};
};

// /profile?type=pd?id=123123
const ProfileBase = React.memo(({profileId = 0, onClickBack = () => {}, isPath = false}: ProfileBaseProps) => {
  const searchParams = useSearchParams();
  const isNeedBackBtn = searchParams?.get('from'); // "from" 쿼리 파라미터 값 가져오기
  const [dataUserDropDown, setUserDropDown] = useAtom(userDropDownAtom);
  const router = useRouter();
  const pathname = usePathname();
  const refDescription = useRef<HTMLDivElement | null>(null);
  const [data, setData] = useState<DataProfileType>({
    indexTab: eTabPDType.Feed,
    isOpenSelectProfile: false,
    profileInfo: null,
    profileTabInfo: {},
    indexFilterMedia: FeedMediaType.Total,
    indexSort: ExploreSortType.MostPopular,
    isShowMore: false,
    isNeedShowMore: false,
    isMyMenuOpened: false,
    isShareOpened: false,
    isSettingOpen: false,
  });

  const dispatch = useDispatch();

  const isMine = data.profileInfo?.isMyProfile || false;
  const profileType = Number(data.profileInfo?.profileInfo?.type);
  const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter} = getUserType(isMine, profileType);

  useEffect(() => {
    if (!isPath) {
      refreshProfileInfo(profileId);
      return;
    } else {
      //컴포넌트로 가져다 쓰는 경우 isPath=fase
      const id = pathname?.split('/').filter(Boolean).pop();
      if (id == undefined) return;
      const profileIdPath = parseInt(id);
      refreshProfileInfo(profileIdPath);
      return;
    }
  }, [pathname]);

  useEffect(() => {
    if (!isPath) return;
    dispatch(setBottomNavColor(1));
    // refreshProfileInfo(profileId);
  }, []);

  useEffect(() => {
    if (refDescription.current) {
      const element = refDescription.current;
      const lineHeight = parseFloat(window.getComputedStyle(element).lineHeight);
      const height = element.clientHeight;
      const lineCount = Math.round(height / lineHeight);
      data.isNeedShowMore = lineCount > 3;
      setData({...data});
    }
  }, [data.profileInfo?.profileInfo.description]); // 내용이 바뀔 때마다 검사

  const getTabInfo = (
    typeProfile: ProfileType,
  ): ((
    profileId: number,
    tabIndex: number,
    indexSort: ExploreSortType,
    indexFilterMedia: FeedMediaType,
  ) => Promise<any>) => {
    if (typeProfile === ProfileType.User || typeProfile === ProfileType.PD) {
      return getProfilePdTabInfo;
    } else if (typeProfile === ProfileType.Character) {
      return getProfileCharacterTabInfo; // 타입 캐스팅 추가
    } else if (typeProfile === ProfileType.Channel) {
      return async (profileId: number, tabType: PdProfileTabType) => {
        return null;
      };
    } else {
      return async (profileId: number, tabType: PdProfileTabType) => {
        return null;
      };
    }
  };

  const refreshProfileTab = async (profileId: number, indexTab: number) => {
    const profileType = data.profileInfo?.profileInfo?.type;
    if (profileType == undefined) return;

    let resProfileTabInfo = null;
    if (isCharacter && indexTab == eTabCharacterType.Info) {
      const reqSendGetCharacterInfo: GetCharacterInfoReq = {
        languageType: getCurrentLanguage(),
        characterId: data.profileInfo?.profileInfo?.typeValueId || 0,
      };
      const resGetCharacterInfo = await sendGetCharacterInfo(reqSendGetCharacterInfo);
      if (resGetCharacterInfo.resultCode != 0) {
        console.error('api error : ', resGetCharacterInfo.resultMessage);
        return;
      }
      resProfileTabInfo = resGetCharacterInfo.data;
    } else {
      resProfileTabInfo = await getTabInfo(profileType)(profileId, indexTab, data.indexSort, data.indexFilterMedia);
    }
    if (!resProfileTabInfo) return;

    data.profileTabInfo[indexTab] = resProfileTabInfo;
    setData({...data});
  };

  const refreshProfileInfo = async (profileId: number) => {
    const resProfileInfo = await getProfileInfo(profileId);
    if (!resProfileInfo) return;
    data.profileInfo = resProfileInfo;

    const indexTab = Number(data?.indexTab);
    await refreshProfileTab(profileId, indexTab);

    setData({...data});
  };

  const SelectBoxArrowComponent = useCallback(
    () => <img className={styles.icon} src={BoldAltArrowDown.src} alt="altArrowDown" />,
    [],
  );
  const SelectBoxValueComponent = useCallback((data: any) => {
    return (
      <div key={data.id} className={styles.label}>
        {data.value}
      </div>
    );
  }, []);
  const SelectBoxOptionComponent = useCallback(
    (data: any, isSelected: boolean) => (
      <>
        <div className={styles.optionWrap}>
          <div key={data.id} className={styles.labelOption}>
            {data.value}
          </div>
          {isSelected && <img className={styles.iconCheck} src={LineCheck.src} alt="altArrowDown" />}
        </div>
      </>
    ),
    [],
  );

  const getTabHeaderList = (profileType: number, isMine = false) => {
    if (isMine) {
      if (profileType == ProfileType.User || profileType == ProfileType.PD) {
        return Object.values(eTabPDType)
          .filter(value => typeof value === 'number') // 숫자 타입만 필터링
          .map(type => ({type, label: eTabPDType[type]}));
      } else if (profileType == ProfileType.Character) {
        return Object.values(eTabCharacterType)
          .filter(value => typeof value === 'number')
          .map(type => ({type, label: eTabCharacterType[type]}));
      }
    }

    //other
    if (profileType == ProfileType.User || profileType == ProfileType.PD) {
      return Object.values(eTabPDOtherType)
        .filter(value => typeof value === 'number') // 숫자 타입만 필터링
        .map(type => ({type, label: eTabPDOtherType[type]}));
    } else if (profileType == ProfileType.Character) {
      return Object.values(eTabCharacterOtherType)
        .filter(value => typeof value === 'number')
        .map(type => ({type, label: eTabCharacterOtherType[type]}));
    }
    return [];
  };

  const handleShare = async () => {
    const shareData = {
      title: '공유하기 제목',
      text: '이 링크를 확인해보세요!',
      url: window.location.href, // 현재 페이지 URL
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

  const handleFollow = async (profileId: number, value: boolean) => {
    try {
      const response = await followProfile(profileId, value);

      const resProfileInfo = await getProfileInfo(profileId);
      if (!resProfileInfo) return;
      data.profileInfo = resProfileInfo;
      setData({...data});
    } catch (error) {
      console.error('An error occurred while Following:', error);
    }
  };

  const routerBack = () => {
    // you can get the prevPath like this
    const prevPath = getBackUrl();
    if (!prevPath || prevPath == '') {
      router.replace(getLocalizedLink('/main/homefeed'));
    } else {
      router.replace(prevPath);
    }
  };

  const getIsEmptyTab = () => {
    let isEmptyTab = false;
    if (isPD) {
      if (data.indexTab == eTabPDType.Feed) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.feedInfoList?.length;
      } else if (data.indexTab == eTabPDType.Character) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.characterInfoList?.length;
      } else if (data.indexTab == eTabPDType.Channel) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.channelInfoList?.length;
      } else {
        isEmptyTab = true;
      }
    } else if (isCharacter) {
      if (data.indexTab == eTabCharacterType.Feed) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.feedInfoList?.length;
      } else if (data.indexTab == eTabCharacterType.Contents) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.contentsInfoList?.length;
      } else if (data.indexTab == eTabCharacterType.Story) {
        isEmptyTab = !data?.profileTabInfo?.[data.indexTab]?.storyInfoList?.length;
      } else if (data.indexTab == eTabCharacterType.Info) {
        isEmptyTab == !data?.profileTabInfo?.[data.indexTab]?.characterInfo;
      } else {
        isEmptyTab = true;
      }
    } else {
      isEmptyTab = true;
    }
    return isEmptyTab;
  };

  type TabContentProps = {
    profileType: ProfileType;
    isMine: boolean;
    tabIndex: number;
    isEmptyTab: boolean;
  };

  const TabFilterComponent = React.useCallback(
    ({profileType, isMine, tabIndex, isEmptyTab}: TabContentProps) => {
      const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter} = getUserType(isMine, profileType);

      if ((isPD && tabIndex == PdProfileTabType.Feed) || (isCharacter && tabIndex == CharacterProfileTabType.Feed)) {
        return (
          <>
            <div className={styles.filter}>
              <div
                className={styles.left}
                onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  const target = e.target as HTMLElement;
                  const category = target.closest('[data-filter]')?.getAttribute('data-filter');
                  if (category) {
                    data.indexFilterMedia = parseInt(category);
                  }
                  await refreshProfileTab(profileId, data.indexTab);
                  // await refreshProfileTab(profileId, data.indexTab);
                  setData({...data});
                }}
              >
                <div
                  className={cx(styles.iconWrap, data.indexFilterMedia == FeedMediaType.Total && styles.active)}
                  data-filter={FeedMediaType.Total}
                >
                  <img src={BoldViewGallery.src} alt="" />
                </div>
                <div
                  className={cx(styles.iconWrap, data.indexFilterMedia == FeedMediaType.Video && styles.active)}
                  data-filter={FeedMediaType.Video}
                >
                  <img src={BoldVideo.src} alt="" />
                </div>
                <div
                  className={cx(styles.iconWrap, data.indexFilterMedia == FeedMediaType.Image && styles.active)}
                  data-filter={FeedMediaType.Image}
                >
                  <img src={BoldImage.src} alt="" />
                </div>
              </div>
              <div className={styles.right}>
                <div className={styles.filterTypeWrap}>
                  <SelectBox
                    value={{id: ExploreSortType.MostPopular, value: 'Most Popular'}}
                    options={[
                      {id: ExploreSortType.Newest, value: 'Newest'},
                      {id: ExploreSortType.MostPopular, value: 'Most Popular'},
                      {id: ExploreSortType.WeeklyPopular, value: 'Weekly Popular'},
                      {id: ExploreSortType.MonthPopular, value: 'Monthly Popular'},
                    ]}
                    ArrowComponent={SelectBoxArrowComponent}
                    ValueComponent={SelectBoxValueComponent}
                    OptionComponent={SelectBoxOptionComponent}
                    onChangedCharacter={async id => {
                      data.indexSort = id;
                      setData({...data});
                      await refreshProfileTab(profileId, data.indexTab);
                    }}
                    customStyles={{
                      control: {
                        width: '184px',
                        display: 'flex',
                        gap: '10px',
                      },
                      menuList: {
                        borderRadius: '10px',
                        boxShadow: '0px 0px 30px 0px rgba(0, 0, 0, 0.10)',
                      },
                      option: {
                        padding: '11px 14px',
                        boxSizing: 'border-box',
                        '&:first-of-type': {
                          borderTop: 'none', // 첫 번째 옵션에는 border 제거
                        },
                        borderTop: '1px solid #EAECF0', // 옵션 사이에 border 추가
                      },
                    }}
                  />
                  {/* <div className={styles.label}>Newest</div> */}
                  {/* <img className={styles.icon} src={BoldAltArrowDown.src} alt="" /> */}
                </div>
              </div>
            </div>
          </>
        );
      }
      if (isPD && tabIndex == PdProfileTabType.Character) {
        return <></>;
      }

      if (isCharacter && tabIndex == eTabCharacterType.Info) {
        return <></>;
      }
    },
    [data.indexTab, data.profileTabInfo],
  );

  const TabContentComponent = React.useCallback(
    ({profileType, isMine, tabIndex, isEmptyTab}: TabContentProps) => {
      const {isPD, isCharacter, isMyPD, isMyCharacter, isOtherPD, isOtherCharacter} = getUserType(isMine, profileType);

      if (isEmptyTab) {
        return (
          <>
            <div className={styles.emptyWrap}>
              <img src="/ui/profile/image_empty.svg" alt="" />
              <div className={styles.text}>
                Its pretty lonely out here.
                <br />
                Make a Post
              </div>
            </div>
          </>
        );
      }

      if ((isPD && tabIndex == PdProfileTabType.Feed) || (isCharacter && tabIndex == CharacterProfileTabType.Feed)) {
        return (
          <>
            <ul className={styles.itemWrap}>
              {data?.profileTabInfo?.[data.indexTab]?.feedInfoList.map((one, index: number) => {
                return (
                  <Link
                    href={
                      getLocalizedLink(`/profile/feed/` + data.profileInfo?.profileInfo.id) +
                      `?type=${profileType}&index=${index}&feedMediaType=${data.indexFilterMedia}&feedSortType=${data.indexSort}&index=${index}`
                    }
                  >
                    <li className={styles.item} key={one?.id}>
                      {one.mediaState == MediaState.Image && (
                        <img className={styles.imgThumbnail} src={one?.mediaUrlList?.[0]} alt="" />
                      )}
                      {one.mediaState == MediaState.Video && (
                        <video className={styles.imgThumbnail} src={one?.mediaUrlList?.[0]} />
                      )}
                      {one?.isBookmark && (
                        <div className={styles.pin}>
                          <img src={BoldPin.src} alt="" />
                        </div>
                      )}
                      <div className={styles.info}>
                        <div className={styles.likeWrap}>
                          <img src={BoldHeart.src} alt="" />
                          <div className={styles.value}>{one?.likeCount}</div>
                        </div>
                        <div className={styles.viewWrap}>
                          <img src={BoldVideo.src} alt="" />
                          <div className={styles.value}>{one?.commentCount}</div>
                        </div>
                      </div>
                      <div className={styles.titleWrap}>
                        <div className={styles.title}>{one?.description}</div>
                        <img
                          src={BoldMenuDots.src}
                          alt=""
                          className={styles.iconSetting}
                          onClick={e => {
                            e.preventDefault();
                            e.stopPropagation();
                            data.isSettingOpen = true;
                            setData({...data});
                          }}
                        />
                      </div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </>
        );
      }
      if (isPD && tabIndex == PdProfileTabType.Character) {
        return (
          <ul className={styles.itemWrap}>
            {data?.profileTabInfo?.[data.indexTab]?.characterInfoList.map((one, index: number) => {
              return (
                <Link href={getLocalizedLink(`/profile/` + one?.id + '?from=""')}>
                  <li className={styles.item} key={one?.id}>
                    {one.mediaState == MediaState.Image && (
                      <img className={styles.imgThumbnail} src={one?.mediaUrl} alt="" />
                    )}
                    {one.mediaState == MediaState.Video && (
                      <video className={styles.imgThumbnail} src={one?.mediaUrl} />
                    )}
                    {one?.isFavorite && (
                      <div className={styles.pin}>
                        <img src={BoldPin.src} alt="" />
                      </div>
                    )}
                    <div className={styles.info}>
                      <div className={styles.likeWrap}>
                        <img src={BoldHeart.src} alt="" />
                        <div className={styles.value}>{one?.likeCount}</div>
                      </div>
                      <div className={styles.viewWrap}>
                        <img src={BoldVideo.src} alt="" />
                        <div className={styles.value}>{one?.likeCount}</div>
                      </div>
                    </div>
                    <div className={styles.titleWrap}>
                      <div className={styles.title}>{one?.name}</div>
                      <img
                        src={BoldMenuDots.src}
                        alt=""
                        className={styles.iconSetting}
                        onClick={e => {
                          e.preventDefault();
                          e.stopPropagation();
                          data.isSettingOpen = true;
                          setData({...data});
                        }}
                      />
                    </div>
                  </li>
                </Link>
              );
            })}
          </ul>
        );
      }

      if (isCharacter && tabIndex == eTabCharacterType.Info) {
        return (
          <>
            <CharacterProfileDetailComponent
              characterInfo={data?.profileTabInfo?.[data.indexTab].characterInfo}
              urlLinkKey={data?.profileTabInfo?.[data.indexTab].urlLinkKey}
            />
          </>
        );
      }
    },
    [data.indexTab, data.profileTabInfo],
  );

  const isFollow = data.profileInfo?.profileInfo.followState == FollowState.Follow;
  const tabContentList = getTabHeaderList(profileType);
  let isEmptyTab = getIsEmptyTab();

  return (
    <>
      <section className={cx(styles.header, !isPath && styles.headerNoPath)}>
        <div className={styles.left}>
          {((!isMine && isPath) || isNeedBackBtn) && (
            <div
              className={styles.backBtn}
              onClick={() => {
                routerBack();
              }}
            >
              <img src={BoldArrowLeft.src} alt="" />
            </div>
          )}
          <div
            className={styles.selectProfileNameWrap}
            onClick={() => {
              if (!isMine) return;
              dataUserDropDown.onClickLong();
            }}
          >
            <div className={styles.profileName}>{data.profileInfo?.profileInfo.name}</div>
            {isMine && (
              <div className={styles.iconSelect}>
                <img src={LineArrowDown.src} alt="" />
              </div>
            )}
          </div>
        </div>
        <div className={styles.right}>
          <img
            className={cx(styles.icon, styles.iconShare)}
            src={LineShare.src}
            alt=""
            onClick={() => {
              handleShare();
            }}
          />
          {isMine && (
            <img
              className={cx(styles.icon, styles.iconMenu)}
              onClick={e => {
                setData(v => ({...v, isMyMenuOpened: true}));
              }}
              src={LineMenu.src}
              alt=""
            />
          )}

          {!isMine && (
            <img className={cx(styles.icon, styles.iconNotification)} src="/ui/profile/icon_notification.svg" alt="" />
          )}
          {!isMine && <img className={cx(styles.icon, styles.iconSetting)} src={BoldMenuDots.src} alt="" />}
        </div>
      </section>
      <section className={cx(styles.main, !isPath && styles.mainNoPath)}>
        {isMyPD && (
          <div className={styles.buttonWrap}>
            <button className={styles.subscribe}>Subscribe</button>
            <button className={styles.favorite}>Favorites</button>
            <button className={styles.playlist}>Playlist</button>
          </div>
        )}
        <div className={styles.profileStatisticsWrap}>
          <div className={styles.imgProfileWrap}>
            <img className={styles.imgProfile} src={data.profileInfo?.profileInfo.iconImageUrl} alt="" />
            {isMine && (
              <div className={styles.iconProfileEditWrap}>
                <img className={styles.icon} src="/ui/profile/icon_edit.svg" alt="" />
              </div>
            )}
          </div>

          <div className={styles.itemStatistic}>
            <div className={styles.count}>{data.profileInfo?.profileInfo.postCount}</div>
            <div className={styles.label}>Posts</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>{data.profileInfo?.profileInfo.followerCount}</div>
            <div className={styles.label}>Followers</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>{data.profileInfo?.profileInfo.followingCount}</div>
            <div className={styles.label}>Following</div>
          </div>
        </div>
        <div className={styles.profileDetail}>
          <div className={styles.nameWrap}>
            <div className={styles.name}>{data.profileInfo?.profileInfo?.name}</div>
            {!isMine && <img className={styles.iconCopy} src={LineCopy.src} alt="" />}
          </div>
          {isPD && (
            <div className={styles.verify}>
              <span className={styles.label}>Creator</span>
              <img className={styles.icon} src="/ui/profile/icon_verify.svg" alt="" />
            </div>
          )}
          {isCharacter && (
            <div className={styles.verify}>
              <Link href={getLocalizedLink(`/profile/` + data.profileInfo?.profileInfo.pdProfileId + '?from=""')}>
                <span className={styles.label}>Manager: {data.profileInfo?.profileInfo?.pdEmail}</span>
              </Link>
            </div>
          )}
          <div
            ref={refDescription}
            className={cx(
              styles.hashTag,
              data.isNeedShowMore && styles.needShowMore,
              data.isShowMore && styles.showAll,
            )}
          >
            {data.profileInfo?.profileInfo.description}
          </div>
          {data.isNeedShowMore && !data.isShowMore && (
            <div
              className={styles.showMore}
              onClick={() => {
                data.isShowMore = true;
                setData({...data});
              }}
            >
              Show more...
            </div>
          )}
          {isMyPD && (
            <div className={styles.buttons}>
              <button className={styles.ad}>AD</button>
              <button className={styles.friends}>Add Friends</button>
            </div>
          )}
          {isMyCharacter && (
            <div className={styles.buttons}>
              <button className={styles.ad}>AD</button>
              <button className={styles.chat}>
                <Link href={getLocalizedLink(`/profile/detail/` + data.profileInfo?.profileInfo.typeValueId)}>
                  Chat
                </Link>
              </button>
            </div>
          )}
          {isOtherPD && (
            <div className={styles.buttonsOtherPD}>
              <button
                className={styles.follow}
                onClick={() => {
                  handleFollow(profileId, !isFollow);
                }}
              >
                {isFollow ? 'Following' : 'Follow'}
              </button>
              <button className={styles.gift}>
                <img className={styles.icon} src="/ui/profile/icon_gift.svg" alt="" />
              </button>
            </div>
          )}
          {isOtherCharacter && (
            <div className={styles.buttonsOtherCharacter}>
              <button className={styles.subscribe}>Subscribe</button>
              <button
                className={styles.follow}
                onClick={() => {
                  handleFollow(profileId, !isFollow);
                }}
              >
                {isFollow ? 'Following' : 'Follow'}
              </button>
              <button className={styles.giftWrap}>
                <img className={styles.icon} src="/ui/profile/icon_gift.svg" alt="" />
              </button>
              <button className={styles.chat}>
                <Link href={getLocalizedLink(`/profile/detail/` + data.profileInfo?.profileInfo.typeValueId)}>
                  Chat
                </Link>
              </button>
            </div>
          )}
          {!isPD && (
            <Swiper
              className={styles.recruitList}
              freeMode={true}
              slidesPerView={'auto'}
              onSlideChange={() => {}}
              onSwiper={swiper => {}}
              spaceBetween={8}
              preventClicks={false}
              simulateTouch={false}
            >
              {isMine && (
                <SwiperSlide>
                  <li className={cx(styles.item, styles.addRecruit)}>
                    <div className={styles.circle}>
                      <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                    </div>
                    <div className={styles.label}>Add</div>
                  </li>
                </SwiperSlide>
              )}
              <SwiperSlide>
                <li className={styles.item}>
                  <div className={styles.circle}>
                    <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                    <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                    <span className={cx(styles.grade, styles.original)}>Original</span>
                  </div>
                  <div className={styles.label}>Idol University</div>
                </li>
              </SwiperSlide>
              <SwiperSlide>
                <li className={styles.item}>
                  <div className={styles.circle}>
                    <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                    <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                    <span className={cx(styles.grade, styles.fan)}>Fan</span>
                  </div>
                  <div className={styles.label}>Idol University</div>
                </li>
              </SwiperSlide>
              <SwiperSlide>
                <li className={styles.item}>
                  <div className={styles.circle}>
                    <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                    <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                    <span className={cx(styles.grade, styles.fan)}>Fan</span>
                  </div>
                  <div className={styles.label}>Idol University</div>
                </li>
              </SwiperSlide>
              <SwiperSlide>
                <li className={styles.item}>
                  <div className={styles.circle}>
                    <img className={styles.bg} src="/ui/profile/icon_add_recruit.png" alt="" />
                    <img className={styles.thumbnail} src="/images/profile_sample/img_sample_recruit1.png" alt="" />
                    <span className={cx(styles.grade, styles.fan)}>Fan</span>
                  </div>
                  <div className={styles.label}>Idol University</div>
                </li>
              </SwiperSlide>
            </Swiper>
          )}
        </div>
        <section className={styles.tabSection}>
          <div className={styles.tabHeaderContainer}>
            <div className={styles.tabHeaderWrap}>
              <div
                className={styles.tabHeader}
                onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                  const target = e.target as HTMLElement;
                  const category = target.closest('[data-tab]')?.getAttribute('data-tab');
                  if (category) {
                    data.indexTab = parseInt(category);
                  }
                  await refreshProfileTab(profileId, data.indexTab);
                  setData({...data});
                }}
              >
                {tabContentList?.map((tab, index) => {
                  console.log('tab : ', tab);
                  return (
                    <div
                      key={tab.type}
                      className={cx(styles.label, data.indexTab == tab?.type && styles.active)}
                      data-tab={tab?.type}
                    >
                      {tab.label}
                    </div>
                  );
                })}
              </div>
              <div className={styles.line}></div>
            </div>
            <TabFilterComponent
              isMine={isMine}
              profileType={profileType}
              tabIndex={data.indexTab}
              isEmptyTab={isEmptyTab}
            />
          </div>

          <div className={styles.tabContent}>
            <TabContentComponent
              isMine={isMine}
              profileType={profileType}
              tabIndex={data.indexTab}
              isEmptyTab={isEmptyTab}
            />
          </div>
        </section>
      </section>
      <section className={styles.footer}></section>
      <HamburgerBar
        isLeft={false}
        onClose={() => {
          setData(v => ({...v, isMyMenuOpened: false}));
        }}
        open={data.isMyMenuOpened}
      ></HamburgerBar>

      <SharePopup
        open={data.isShareOpened}
        title={data.profileInfo?.profileInfo?.name || ''}
        url={window.location.href}
        onClose={() => {
          setData(v => ({...v, isShareOpened: false}));
        }}
      ></SharePopup>
      <ContentSetting
        isOpen={data.isSettingOpen}
        onClose={() => {
          data.isSettingOpen = false;
          setData({...data});
        }}
        isMine={isMine}
      />
    </>
  );
});

export default ProfileBase;

const ContentSetting = ({isOpen = false, isMine = false, onClose = () => {}}) => {
  let uploadImageItems: SelectDrawerItem[] = [
    {
      name: 'Link Copy',
      onClick: () => {},
    },
    {
      name: 'Edit',
      onClick: () => {},
    },
    {
      name: 'Share',
      onClick: () => {},
    },
    {
      name: 'Delete',
      onClick: () => {},
    },
    {
      name: 'Report',
      onClick: () => {},
    },
  ];
  if (isMine) {
    uploadImageItems = uploadImageItems.filter(v => v.name != 'Report');
  }

  return <SelectDrawer isOpen={isOpen} onClose={onClose} items={uploadImageItems} selectedIndex={-1} />;
};

export type SelectBoxProps = {
  value: {id: number; [key: string]: any} | null;
  options: {id: number; [key: string]: any}[];
  OptionComponent: (data: {id: number; [key: string]: any}, isSelected: boolean) => JSX.Element;
  ValueComponent: (data: any) => JSX.Element;
  ArrowComponent: () => JSX.Element;
  onChangedCharacter: (id: number) => void;
  customStyles?: {
    control?: object; // 함수 또는 객체 허용
    singleValue?: object;
    valueContainer?: object;
    input?: object;
    option?: object;
    menu?: object;
    menuList?: object;
    indicatorSeparator?: object;
    dropdownIndicator?: object;
  };
};

export const SelectBox: React.FC<SelectBoxProps> = ({
  value,
  options,
  OptionComponent,
  ValueComponent,
  ArrowComponent,
  onChangedCharacter,
  customStyles = {},
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<{id: number} | null>(value);
  const styleDefault: StylesConfig<{id: number; [key: string]: any}, false> = {
    control: provided => ({
      ...provided,
      borderColor: 'transparent',
      boxShadow: 'none',
      border: 'none',
      '&:hover': {
        borderColor: 'transparent',
      },
      '&:focus': {
        borderColor: 'transparent',
      },
      background: 'transparent',
      padding: 0,
      cursor: 'pointer',
      width: '100%',
      ...customStyles?.control,
    }),
    singleValue: provided => ({
      // value부분
      ...provided,
      margin: '0',
      ...customStyles?.singleValue,
    }),
    valueContainer: provided => ({
      ...provided,
      paddingLeft: 0,
      textAlign: 'right',
      padding: '0',
      ...customStyles?.valueContainer,
    }),
    input: provided => ({
      ...provided,
      ...customStyles?.input,
    }),
    option: (provided, state) => ({
      // 옵션 부분
      ...provided,
      backgroundColor: state.isSelected ? '#ffffff' : 'transparent',
      color: 'black',
      ':active': {
        backgroundColor: state.isSelected ? '#ffffff' : 'transparent',
      },
      cursor: 'pointer',
      ...customStyles?.option,
    }),
    menu: provided => ({
      ...provided,
      marginTop: '7px',
      boxShadow: 'none',
      ...customStyles?.menu,
    }),
    menuList: provided => ({
      ...provided,
      padding: 0,
      background: 'white',
      ...customStyles?.menuList,
    }),
    indicatorSeparator: provided => ({
      ...provided,
      display: 'none',
      ...customStyles?.indicatorSeparator,
    }),
    dropdownIndicator: provided => ({
      ...provided,
      ...customStyles?.dropdownIndicator,
    }),
  };

  const CustomControl = ({children, ...props}: any) => {
    const {selectProps} = props;

    const handleClick = (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      if (!selectProps.menuIsOpen) {
        setIsOpen(true);
      } else {
        // setMenuIsOpen(false);
      }
    };

    return (
      <components.Control {...props}>
        <div
          style={{
            ...(styleDefault?.control?.({}, props) as React.CSSProperties | {}),
          }}
          onClick={handleClick}
          onPointerDown={handleClick}
        >
          {children}
        </div>
      </components.Control>
    );
  };

  return (
    <Select
      isSearchable={false}
      value={selectedOption}
      onChange={option => {
        if (option) {
          setSelectedOption(option);
          onChangedCharacter(option.id);
          setIsOpen(false);
        }
      }}
      menuIsOpen={isOpen}
      onMenuOpen={() => setIsOpen(true)}
      onMenuClose={() => setIsOpen(false)}
      styles={styleDefault}
      options={options}
      components={{
        Control: CustomControl,
        DropdownIndicator: ArrowComponent,
        Option: props => (
          <components.Option {...props}>
            {OptionComponent(props.data, props.isSelected)} {/* 드롭다운에서는 isSingleValue = false */}
          </components.Option>
        ),
        SingleValue: props => (
          <components.SingleValue {...props}>
            {ValueComponent(props.data)} {/* 선택된 값에서는 isSingleValue = true */}
          </components.SingleValue>
        ),
      }}
      getOptionValue={option => option.id.toString()}
    />
  );
};
