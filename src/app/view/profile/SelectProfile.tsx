import {getProfileList, ProfileSimpleInfo, selectProfile} from '@/app/NetWork/ProfileNetwork';
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
  }>({
    profileList: [],
  });
  const router = useRouter();
  useEffect(() => {
    if (!open) return;
    refreshProfileList();
  }, [open]);

  const refreshProfileList = async () => {
    const profileList = await getProfileList();
    if (!profileList) return;

    data.profileList = profileList;
    setData({...data});
  };

  return (
    <Drawer
      className={styles.drawer}
      anchor="bottom"
      open={open}
      onClose={() => handleCloseDrawer()}
      PaperProps={{
        sx: {
          maxHeight: '80vh',
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
      <div className={styles.content}>
        <ul className={styles.profileList}>
          {data.profileList.map((profile, index) => {
            const isSelected = profile.id == dataProfile.currentProfile?.id;
            return (
              <li
                className={styles.item}
                key={profile.id}
                onClick={async () => {
                  const resData = await selectProfile(profile.id);
                  if (!resData?.profileSimpleInfo) return;

                  dispatch(updateProfile(resData?.profileSimpleInfo));

                  const accessToken: string = resData?.sessionInfo?.accessToken || '';
                  localStorage.setItem('jwt', accessToken);
                  pushLocalizedRoute('/profile/' + resData?.profileSimpleInfo.id, router, false);
                }}
              >
                <div className={styles.left}>
                  <img className={styles.imgProfile} src={profile.iconImageUrl} alt="" />
                  <div className={styles.nameWrap}>
                    <span className={styles.grade}>Original</span>
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
