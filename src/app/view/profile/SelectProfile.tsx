import {
  getProfileList,
  OperatorAuthorityType,
  ProfileSimpleInfo,
  ProfileType,
  selectProfile,
} from '@/app/NetWork/ProfileNetwork';
import {RootState} from '@/redux-store/ReduxStore';
import {Drawer} from '@mui/material';
import {useRouter} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './SelectProfile.module.scss';
import {updateProfile} from '@/redux-store/slices/Profile';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import cx from 'classnames';
import {BoldMore, LinePlus} from '@ui/Icons';
type Props = {};

type SelectProfileType = {
  open: boolean;
  handleCloseDrawer: () => void;
};

export const SelectProfile = ({open, handleCloseDrawer}: SelectProfileType) => {
  const dataProfile = useSelector((state: RootState) => state.profile);
  const dispatch = useDispatch();
  const [data, setData] = useState<{
    profileList: ProfileSimpleInfo[];
    indexSharedTab: number;
  }>({
    profileList: [],
    indexSharedTab: 0,
  });
  const router = useRouter();
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

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => handleCloseDrawer()}
      PaperProps={{
        className: styles.drawer,
        sx: {
          overflow: 'hidden',
          padding: '8px 20px 45px',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
        },
      }}
    >
      <div className={styles.handleArea}>
        <div className={styles.handleBar}></div>
      </div>
      <div className={styles.title}>Select Profile</div>
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
          My
        </div>
        <div className={cx(styles.Shared, data.indexSharedTab == 1 && styles.active)} data-index={1}>
          Shared
        </div>
      </div>
      <div className={styles.content}>
        <ul className={styles.profileList}>
          {data.profileList?.map((profile, index) => {
            const isSelected = profile.profileId == dataProfile.currentProfile?.profileId;
            const isPD = [ProfileType.PD, ProfileType.User].includes(profile.profileType);
            const isCharacter = [ProfileType.Character].includes(profile.profileType);
            const isChannel = [ProfileType.Channel].includes(profile.profileType);
            return (
              <li
                className={styles.item}
                key={profile.profileId}
                onClick={async () => {
                  handleCloseDrawer();
                  const resData = await selectProfile(profile.profileId);
                  if (!resData?.profileSimpleInfo) return;

                  dispatch(updateProfile(resData?.profileSimpleInfo));

                  const accessToken: string = resData?.sessionInfo?.accessToken || '';
                  localStorage.setItem('jwt', accessToken);
                  pushLocalizedRoute('/profile/' + resData?.profileSimpleInfo.profileId + "?from=''", router, false);
                }}
              >
                <div className={styles.left}>
                  <img className={styles.imgProfile} src={profile.iconImageUrl} alt="" />
                  <div className={styles.nameWrap}>
                    {isChannel && (
                      <div className={styles.top}>
                        <div className={styles.type}>Channel</div>
                      </div>
                    )}
                    {isCharacter && (
                      <div className={styles.top}>
                        <span className={styles.grade}>Original</span>
                        <div className={styles.type}>Character</div>
                      </div>
                    )}
                    {isPD && (
                      <div className={styles.top}>
                        <div className={cx(styles.type, styles.pd)}>My</div>
                      </div>
                    )}
                    <div className={styles.name}>{profile.name}</div>
                  </div>
                </div>
                <div className={styles.right}>
                  {isSelected && (
                    <img className={styles.iconChecked} src="/ui/profile/icon_select_proflie_checked.svg" alt="" />
                  )}
                  {!isSelected && <img className={styles.iconMore} src={BoldMore.src} alt="" />}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </Drawer>
  );
};

export default SelectProfile;
