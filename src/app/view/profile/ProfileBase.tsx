'use client';

import React, {useCallback, useEffect, useState} from 'react';

import {Box, Button, Drawer} from '@mui/material';
import ProfileTopEditMenu from './ProfileTopEditMenu';
import ProfileInfo from './ProfileInfo';
import profileData from 'data/profile/profile-data.json';
import ProfileTopViewMenu from './ProfileTopViewMenu';
import {
  BoldAltArrowDown,
  BoldArrowLeft,
  BoldHeart,
  BoldMenuDots,
  BoldMore,
  BoldPin,
  BoldVideo,
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
import {redirect, RedirectType, usePathname, useRouter} from 'next/navigation';
import {
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
import {getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';
import {userDropDownAtom} from '@/components/layout/shared/UserDropdown';
import {useAtom} from 'jotai';
import Link from 'next/link';

enum eTabPDType {
  Feed,
  Channel,
  Character,
  Shared,
}

enum eTabCharacterType {
  Feed,
  Contents,
  Story,
  Joined,
}

type DataProfileType = {
  indexTab: eTabPDType;
  isOpenSelectProfile: boolean;
  profileInfo: null | GetProfileInfoRes;
  profileTabInfo: {[key: number]: ProfileTabItemInfo[]};
};

type ProfileBaseProps = {
  profileId?: number;
  onClickBack?: () => void;
  isPath?: boolean;
  maxWidth?: string;
};

// /profile?type=pd?id=123123
const ProfileBase = React.memo(({profileId = 0, onClickBack = () => {}, isPath = false}: ProfileBaseProps) => {
  const router = useRouter();
  const [dataUserDropDown, setUserDropDown] = useAtom(userDropDownAtom);
  const pathname = usePathname();
  const [data, setData] = useState<DataProfileType>({
    indexTab: eTabPDType.Feed,
    isOpenSelectProfile: false,
    profileInfo: null,
    profileTabInfo: {},
  });

  const dispatch = useDispatch();
  const isMine = data.profileInfo?.isMyProfile;
  const profileType = Number(data.profileInfo?.profileInfo?.type);
  const isMyPD = isMine && profileType == ProfileType.PD;
  const isMyCharacter = isMine && profileType == ProfileType.Character;
  const isOtherPD = !isMine && profileType == ProfileType.PD;
  const isOtherCharacter = !isMine && profileType == ProfileType.Character;
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

  const getTabInfo = (typeProfile: ProfileType): ((profileId: number, tabType: number) => Promise<any>) => {
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

    const resProfileTabInfo = await getTabInfo(profileType)(profileId, indexTab);
    if (!resProfileTabInfo) return;

    data.profileTabInfo[indexTab] = resProfileTabInfo?.tabInfoList;
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

  const getTabList = (profileType: number) => {
    if (profileType == ProfileType.User || profileType == ProfileType.PD) {
      return Object.values(eTabPDType)
        .filter(value => typeof value === 'number') // 숫자 타입만 필터링
        .map(type => ({type, label: eTabPDType[type]}));
    } else if (profileType == ProfileType.Character) {
      return Object.values(eTabCharacterType)
        .filter(value => typeof value === 'number')
        .map(type => ({type, label: eTabCharacterType[type]}));
    }
    return [];
  };
  const tabList = getTabList(profileType);

  return (
    <>
      <section className={cx(styles.header, !isPath && styles.headerNoPath)}>
        <div className={styles.left}>
          {!isMine && isPath && (
            <div
              className={styles.backBtn}
              onClick={() => {
                router.back();
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
          <img className={cx(styles.icon, styles.iconShare)} src={LineShare.src} alt="" />
          {isMine && (
            <img
              className={cx(styles.icon, styles.iconMenu)}
              onClick={e => {
                dataUserDropDown.onClick();
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
            <div className={styles.count}>200</div>
            <div className={styles.label}>Posts</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>120k</div>
            <div className={styles.label}>Followers</div>
          </div>
          <div className={styles.itemStatistic}>
            <div className={styles.count}>3.4k</div>
            <div className={styles.label}>Following</div>
          </div>
        </div>
        <div className={styles.profileDetail}>
          <div className={styles.nameWrap}>
            <div className={styles.name}>{data.profileInfo?.profileInfo?.name}</div>
            {!isMine && <img className={styles.iconCopy} src={LineCopy.src} alt="" />}
          </div>
          <div className={styles.verify}>
            <span className={styles.label}>Creator</span>
            <img className={styles.icon} src="/ui/profile/icon_verify.svg" alt="" />
          </div>
          <div className={styles.hashTag}>
            <ul>
              <li className={styles.item}>#HauntingMelody</li>
              <li className={styles.item}>#HauntingMelody</li>
              <li className={styles.item}>#HauntingMelody</li>
              <li className={styles.item}>#HauntingMelody</li>
              <li className={styles.item}>#HauntingMelody</li>
            </ul>
          </div>
          <div className={styles.showMore}>Show more...</div>
          {isMyPD && (
            <div className={styles.buttons}>
              <button className={styles.edit}>Edit</button>
              <button className={styles.ad}>AD</button>
              <button className={styles.friends}>Friends</button>
            </div>
          )}
          {isMyCharacter && (
            <div className={styles.buttons}>
              <button className={styles.edit}>Edit</button>
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
              <button className={styles.follow}>Follow</button>
              <button className={styles.gift}>
                <img className={styles.icon} src="/ui/profile/icon_gift.svg" alt="" />
              </button>
            </div>
          )}
          {isOtherCharacter && (
            <div className={styles.buttonsOtherCharacter}>
              <button className={styles.subscribe}>Subscribe</button>
              <button className={styles.follow}>Follow</button>
              <button className={styles.giftWrap}>
                <img className={styles.icon} src="/ui/profile/icon_gift.svg" alt="" />
              </button>
              <button className={styles.chat}>
                <Link href={getLocalizedLink(`/profile/detail` + data.profileInfo?.profileInfo.typeValueId)}>Chat</Link>
              </button>
            </div>
          )}

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
        </div>
        <section className={styles.tabSection}>
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
            {tabList?.map((tab, index) => {
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
          <div className={styles.filter}>
            <div className={styles.left}>
              <div className={cx(styles.iconWrap, styles.active)}>
                <img src="/ui/profile/icon_grid.svg" alt="" />
              </div>
              <div className={styles.iconWrap}>
                <img src="/ui/profile/icon_video.svg" alt="" />
              </div>
              <div className={styles.iconWrap}>
                <img src="/ui/profile/icon_image.svg" alt="" />
              </div>
            </div>
            <div className={styles.right}>
              <div className={styles.filterTypeWrap}>
                <SelectBox
                  value={{id: 1, value: 'Most Popular'}}
                  options={[
                    {id: 0, value: 'Newest'},
                    {id: 1, value: 'Most Popular'},
                    {id: 2, value: 'Weekly Popular'},
                    {id: 3, value: 'Monthly Popular'},
                  ]}
                  ArrowComponent={SelectBoxArrowComponent}
                  ValueComponent={SelectBoxValueComponent}
                  OptionComponent={SelectBoxOptionComponent}
                  onChangedCharacter={id => {}}
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
          <div className={styles.tabContent}>
            <ul className={styles.itemWrap}>
              {data?.profileTabInfo?.[data.indexTab]?.map((one, index: number) => {
                return (
                  <Link href={getLocalizedLink(`/profile/` + one?.id)}>
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
                          <div className={styles.value}>{one?.mediaCount}</div>
                        </div>
                      </div>
                      <div className={styles.titleWrap}>
                        <div className={styles.title}>{one?.name}</div>
                        <img src={BoldMenuDots.src} alt="" className={styles.iconSetting} />
                      </div>
                    </li>
                  </Link>
                );
              })}
            </ul>
          </div>
        </section>
      </section>
      <section className={styles.footer}></section>
    </>
  );
});

export default ProfileBase;

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

  return (
    <Select
      // menuIsOpen={true}
      isSearchable={false}
      value={selectedOption}
      onChange={option => {
        if (option) {
          setSelectedOption(option);
          onChangedCharacter(option.id);
        }
      }}
      styles={styleDefault}
      options={options}
      components={{
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
