import React, {useCallback, useEffect, useState} from 'react';

import Link from 'next/link';

import styles from './CreateWidget.module.scss';
import {getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';
import {BoldAltArrowDown, LineArrowDown, LineChannel, LineCharacter, LineCheck, LineEdit, LineStory} from '@ui/Icons';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import cx from 'classnames';
import {SelectBox} from '@/app/view/profile/ProfileBase';
import {components, StylesConfig} from 'react-select';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {
  getProfileList,
  OperatorAuthorityType,
  ProfileSimpleInfo,
  ProfileType,
  selectProfile,
} from '@/app/NetWork/ProfileNetwork';
import {updateProfile} from '@/redux-store/slices/Profile';
import {usePathname, useRouter} from 'next/navigation';
import getLocalizedText from '@/utils/getLocalizedText';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateWidget: React.FC<Props> = ({open, onClose}) => {
  const pathname = usePathname();
  const router = useRouter();
  const dataProfile = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();
  const [startY, setStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    setStartY(e.touches[0].clientY);
  };
  const [data, setData] = useState<{
    profileList: ProfileSimpleInfo[];
    indexSharedTab: number;
  }>({
    profileList: [],
    indexSharedTab: 0,
  });

  useEffect(() => {
    if (!open) return;

    const isMyProfile = dataProfile.currentProfile?.operatorAuthorityType == OperatorAuthorityType.None;
    data.indexSharedTab = Number(!isMyProfile);
    console.log('isMyProfile : ', isMyProfile);
    setData({...data});
    refreshProfileList();
  }, [open]);

  const refreshProfileList = async () => {
    const profileList = await getProfileList(data.indexSharedTab);
    if (!profileList) return;

    data.profileList = profileList;
    setData({...data});
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY !== null) {
      const currentY = e.touches[0].clientY;
      const distance = Math.max(currentY - startY, 0);
      setTranslateY(distance);
    }
  };

  const handleTouchEnd = () => {
    const threshold = 100;
    if (translateY > threshold) {
      onClose();
    } else {
      setTranslateY(0);
    }
    setStartY(null);
  };

  const handleClickCharacter = () => {
    onClose;
  };

  const handleClickStory = () => {
    onClose;
  };

  const handleClickPost = () => {
    onClose;
  };

  const profileType = dataProfile.currentProfile?.profileType || ProfileType.User;
  const canCreateFeed = [ProfileType.User, ProfileType.PD, ProfileType.Character, ProfileType.Channel].includes(
    profileType,
  );
  const canCreateCharacter = [ProfileType.User, ProfileType.PD].includes(profileType);
  const canCreateContent = [ProfileType.Character, ProfileType.Channel].includes(profileType);
  const canCreateChannel = [ProfileType.User, ProfileType.PD].includes(profileType);
  /* 프로필 타입별 생성 권한
   PD: Feed, Character, Channel;
  Character: Feed, Contents;
  Channel: Feed, Contents, Play(게임);
  */
  return (
    <CustomDrawer open={open} onClose={onClose}>
      <div
        className={styles.widgetBox}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={styles.drawerArea}>
          <div className={styles.drawerTitle}>{getLocalizedText('common_alert_016')}</div>
          <div className={styles.buttonArea}>
            <div
              className={styles.mySharedWrap}
              onClick={async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
                const target = e.target as HTMLElement;
                const indexTab = target.closest('[data-index]')?.getAttribute('data-index');
                if (indexTab) {
                  data.indexSharedTab = parseInt(indexTab);
                  setData({...data});
                  refreshProfileList();
                }
              }}
            >
              <div className={cx(styles.My, data.indexSharedTab == 0 && styles.active)} data-index={0}>
                {getLocalizedText('common_button_my')}
              </div>
              <div className={cx(styles.Shared, data.indexSharedTab == 1 && styles.active)} data-index={1}>
                {getLocalizedText('common_button_shared')}
              </div>
            </div>
            <div className={styles.selectBoxWrap}>
              <SelectBox
                value={{...dataProfile.currentProfile, id: dataProfile.currentProfile?.profileId || 0}}
                options={data?.profileList.map(v => ({...v, id: v.profileId}))}
                ArrowComponent={SelectBoxArrowComponent}
                ValueComponent={SelectBoxValueComponent}
                OptionComponent={SelectBoxOptionComponent}
                onChange={async id => {
                  const resData = await selectProfile(id);
                  if (!resData?.profileSimpleInfo) return;

                  dispatch(updateProfile(resData?.profileSimpleInfo));

                  const accessToken: string = resData?.sessionInfo?.accessToken || '';
                  localStorage.setItem('jwt', accessToken);
                  console.log('pathname : ', pathname);
                  const isProfilePage = /^\/[a-z]{2}\/profile(\/.*)?$/.test(pathname ? pathname : 'empty pathname');
                  if (isProfilePage) {
                    pushLocalizedRoute('/profile/' + resData?.profileSimpleInfo.urlLinkKey + "?from=''", router, false);
                  }
                }}
                customStyles={{
                  menu: {
                    borderRadius: '12px',
                    border: '1px solid var(--Border-1, #EAECF0)',
                    background: 'var(--White, #FFF)',
                    overflow: 'hidden',
                  },
                  menuList: {
                    maxHeight: '250px',
                  },
                }}
              />
            </div>

            <Link href={canCreateFeed ? getLocalizedLink('/create/post') : ''} passHref>
              <button
                className={`${styles.drawerButton} ${styles.drawerButtonTop} ${canCreateFeed ? '' : styles.disable}`}
                onClick={() => {
                  if (!canCreateFeed) return;
                  console.log('canCreateFeed : ', canCreateFeed);
                  onClose();
                }}
              >
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineEdit.src} />
                  <div className={styles.buttonText}>{getLocalizedText('common_label_feed')}</div>
                </div>
              </button>
            </Link>
            <Link href={canCreateCharacter ? getLocalizedLink('/create/character') : ''} passHref>
              <button
                className={`${styles.drawerButton} ${styles.drawerButtonMid} ${
                  canCreateCharacter ? '' : styles.disable
                }`}
                onClick={() => {
                  if (!canCreateCharacter) return;
                  onClose();
                }}
              >
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineCharacter.src} />
                  <div className={styles.buttonText}>{getLocalizedText('common_button_character')}</div>
                </div>
              </button>
            </Link>
            <Link href={canCreateContent ? getLocalizedLink('/create/content') : ''} passHref>
              <button
                className={`${styles.drawerButton} ${styles.drawerButtonMid} ${canCreateContent ? '' : styles.disable}`}
                onClick={() => {
                  if (!canCreateContent) return;
                  onClose();
                }}
              >
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineStory.src} />
                  <div className={styles.buttonText}>{getLocalizedText('common_label_contents')}</div>
                </div>
              </button>
            </Link>
            <Link href={canCreateChannel ? getLocalizedLink('/create/channel') : ''} passHref>
              <button
                className={`${styles.drawerButton} ${styles.drawerButtonBot} ${canCreateChannel ? '' : styles.disable}`}
                onClick={() => {
                  if (!canCreateChannel) return;
                  onClose();
                }}
              >
                <div className={styles.buttonItem}>
                  <img className={styles.buttonIcon} src={LineChannel.src} />
                  <div className={styles.buttonText}>{getLocalizedText('common_button_channel')}</div>
                </div>
              </button>
            </Link>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default CreateWidget;

const SelectBoxArrowComponent = () => <></>;
const SelectBoxValueComponent = (data: any, isOpen?: boolean) => {
  console.log('data : ', data);
  const mappingStrToGlobalTextKey = {
    User: 'common_button_user',
    PD: 'common_filter_pd',
    Character: 'common_filter_character',
    Channel: 'common_button_channel',
  };

  const strRole = ProfileType?.[data.profileType] as keyof typeof mappingStrToGlobalTextKey;

  return (
    <div className={styles.boxValueWrap}>
      <div className={styles.left}>
        <img
          className={cx(styles.imgProfile, strRole == 'Channel' && styles.channelProfile)}
          src={data.iconImageUrl}
          alt=""
        />
        <data value="" className={styles.nameWrap}>
          <div className={styles.name}>{data.name}</div>
          <div className={styles.role}>{getLocalizedText(mappingStrToGlobalTextKey[strRole])}</div>
        </data>
      </div>
      <div className={styles.right}>
        <img
          className={styles.iconDropDown}
          src={'/ui/create/icon_arrow_down.svg'}
          alt="altArrowDown"
          style={{transform: `rotate(${isOpen ? 180 : 0}deg)`}}
        />
      </div>
    </div>
  );
};
const SelectBoxOptionComponent = (data: any, isSelected: boolean) => {
  const isPD = [ProfileType.PD, ProfileType.User].includes(data.profileType);
  const isCharacter = [ProfileType.Character].includes(data.profileType);
  const isChannel = [ProfileType.Channel].includes(data.profileType);

  const mappingStrToGlobalTextKey = {
    User: 'common_button_user',
    PD: 'common_filter_pd',
    Character: 'common_filter_character',
    Channel: 'common_button_channel',
  };

  const strRole = ProfileType?.[data.profileType] as keyof typeof mappingStrToGlobalTextKey;

  console.log('strRole : ', strRole);
  return (
    <>
      <div className={styles.optionWrap}>
        <div className={styles.left}>
          <img
            className={cx(styles.imgProfile, strRole == 'Channel' && styles.channelProfile)}
            src={data.iconImageUrl}
            alt=""
          />
          <data value="" className={styles.nameWrap}>
            <div className={styles.name}>{data.name}</div>
            <div className={styles.role}>{getLocalizedText(mappingStrToGlobalTextKey[strRole])}</div>
          </data>
        </div>
        <div className={styles.right}>
          {isSelected && <img className={styles.iconDropDown} src={LineCheck.src} alt="altArrowDown" />}
          {/* <img className={styles.iconDropDown} src={'/ui/create/icon_arrow_down.svg'} alt="altArrowDown" /> */}
        </div>
      </div>
    </>
  );
};
