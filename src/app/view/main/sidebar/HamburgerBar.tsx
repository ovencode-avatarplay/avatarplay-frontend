import React, {useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import styles from './HamburgerBar.module.css';
import {useAtom} from 'jotai';
import {userDropDownAtom} from '@/components/layout/shared/UserDropdown';
import {Session} from '@supabase/supabase-js';
import {getCurrentLanguage, isLogined, pushLocalizedRoute, refreshLanaguage} from '@/utils/UrlMove';
import {useDispatch, useSelector} from 'react-redux';
import {updateProfile} from '@/redux-store/slices/Profile';
import {fetchLanguage} from '@/components/layout/shared/LanguageSetting';
import {getAuth, SignInRes} from '@/app/NetWork/AuthNetwork';
import {useRouter} from 'next/navigation';
import {getLanguageTypeFromText} from '@/utils/browserInfo';
import {supabase} from '@/utils/supabaseClient';
import {RootState} from '@/redux-store/ReduxStore';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldRuby, BoldStar, LineArrowRight, LineSetting, LineWallet, VerifiedLabel} from '@ui/Icons';
import {Avatar} from '@mui/material';
import ModalLanguageSelect from './ModalLanguageSelect';
import PopupAccountChange from '../content/create/common/PopupAccountChange';

interface HamburgerBarProps {
  open: boolean;
  isLeft?: boolean;
  onClose: () => void;
}

const HamburgerBar: React.FC<HamburgerBarProps> = ({open, onClose, isLeft = true}) => {
  // const [dataUserDropDown, setUserDropDown] = useAtom(userDropDownAtom);
  const dispatch = useDispatch();
  const router = useRouter();
  const [auth, setAuth] = useState<Session | null>(null);

  const dataProfile = useSelector((state: RootState) => state.profile);

  const [languageOpen, setLanguageOpen] = useState<boolean>(false);
  const [supportOpen, setSupportOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  const renderMenuItem = (icon: string, text: string, onClick: () => void, depth?: number) => {
    return (
      <li className={styles.menuItem} onClick={onClick}>
        <div className={styles.menuRow}>
          {' '}
          <div className={styles.menuContent} style={{marginLeft: `calc(20px * ${depth ?? 0})`}}>
            <div className={styles.menuInfo}>
              {icon !== '' && <img className={styles.menuIcon} src={icon} />}
              <div className={styles.menuText}>{text}</div>
            </div>
          </div>
          <img className={styles.arrowIcon} src={LineArrowRight.src} />
        </div>
      </li>
    );
  };

  const routeStory = () => {
    pushLocalizedRoute('/studio/story', router);
  };

  const routeCharacter = () => {
    pushLocalizedRoute('/studio/character', router);
  };

  const routePrompt = () => {
    pushLocalizedRoute('/studio/prompt', router);
  };

  const routeProfile = async () => {
    const jwtToken = localStorage.getItem('jwt');
    console.log('jwtToken : ', jwtToken);
    if (!jwtToken) {
      pushLocalizedRoute('/auth', router);
      return;
    }

    const res = await getAuth();
    console.log('auth res :', res);
    if (res?.resultCode != 0) {
      pushLocalizedRoute('/auth', router);
      return;
    } else {
      if (!res?.data?.profileSimpleInfo) {
        console.error('/auth에서 profileSimpleInfo 못받음');
        return;
      }

      const profile = res?.data?.profileSimpleInfo;

      dispatch(updateProfile(profile));
      pushLocalizedRoute('/profile/' + profile?.urlLinkKey, router);
    }
  };
  async function OpenSelectProfile() {
    const isLogin = await isLogined();
    if (!isLogin) return;

    // dataUserDropDown.drawerProfileOpen = true;
    // setUserDropDown({...dataUserDropDown});
  }

  const handleUserLogout = async () => {
    try {
      // Sign out from the app
      //await signOut({callbackUrl: process.env.NEXT_PUBLIC_APP_URL});
      await supabase.auth.signOut();
      setAuth(null);
      localStorage.removeItem('jwt');
      dispatch(updateProfile(null));
    } catch (error) {
      console.error(error);

      // Show above error in a toast like following
      // toastService.error((err as Error).message)
    }
  };

  const handleCloseLanguage = () => {
    setLanguageOpen(false);
  };

  return (
    <Drawer open={open} onClose={onClose} anchor={isLeft ? 'left' : 'right'} classes={{paper: styles.drawerPaper}}>
      <div className={styles.drawerContent}>
        {/* 프로필 섹션 */}
        <div className={styles.profileSection} onClick={routeProfile}>
          <div className={styles.profileArea}>
            <Avatar
              alt={auth?.user?.email || ''}
              src={dataProfile.currentProfile?.iconImageUrl || ''}
              // onClick={routeProfile}
              className={styles.profileImage}
            />
            {/* <img
              src={dataProfile.currentProfile?.iconImageUrl || ''}
              alt={auth?.user?.email || ''}
              className={styles.profileImage}
            /> */}
            <div className={styles.profileBox}>
              <div className={styles.profileInfo}>
                <div className={styles.profileNameArea}>
                  <p className={styles.profileName}>
                    {auth?.user.user_metadata?.name || auth?.user.user_metadata?.full_name || '이름 없음'}
                  </p>
                  <img className={styles.profileVerified} src={auth ? VerifiedLabel.src : ''} />
                </div>
                <p className={styles.profileEmail}>{auth?.user.email}</p>
              </div>
              <img className={styles.arrowIcon} src={LineArrowRight.src} />
            </div>
          </div>
        </div>
        <ul className={styles.planButtonArea}>
          <CustomButton
            size="Small"
            state="Normal"
            type="Primary"
            onClick={() => {}}
            customClassName={[styles.planButton]}
          >
            Upgrade your plan
          </CustomButton>
        </ul>

        {/* 메뉴 섹션 */}
        <ul className={styles.menuList}>
          {renderMenuItem(LineSetting.src, 'Account Center', () => {
            setAccountOpen(true);
          })}
          <li
            className={`${styles.menuItem} ${styles.divideItem}`}
            onClick={() => {
              pushLocalizedRoute('/main/game/shop', router);
              onClose();
            }}
          >
            <div className={styles.menuRow}>
              <div className={styles.menuContent}>
                <div className={styles.menuInfo}>
                  <img className={styles.menuIcon} src={LineWallet.src} />
                  <div className={styles.menuText}>My Wallet</div>
                </div>
              </div>
              <img className={styles.arrowIcon} src={LineArrowRight.src} />
            </div>
            <div className={styles.pointsSection}>
              <div className={styles.point}>
                <img className={styles.pointIcon} src={BoldRuby.src} />
                <span className={styles.pointText}>10.5K</span>
              </div>
              <div className={styles.point}>
                <img className={styles.pointIcon} src={BoldStar.src} />
                <span className={styles.pointText}>100</span>
              </div>
            </div>
          </li>
        </ul>
        {/* 기타 메뉴 */}
        <ul className={styles.menuList}>
          {renderMenuItem('', 'Language', () => {
            setLanguageOpen(!languageOpen);
          })}
          {renderMenuItem('', 'Story', routeStory)}
          {renderMenuItem('', 'Character', routeCharacter)}
          {renderMenuItem('', 'Prompt', routePrompt)}
          {renderMenuItem('', 'Support & About', () => {
            setSupportOpen(!supportOpen);
          })}
          {supportOpen && (
            <>
              {renderMenuItem('', 'Report a Problem', () => {}, 1)}
              {renderMenuItem('', 'Support', () => {}, 1)}
              {renderMenuItem('', 'Terms and Policies', () => {}, 1)}
            </>
          )}
          {renderMenuItem('', 'Logout', handleUserLogout)}
        </ul>
      </div>
      {languageOpen && <ModalLanguageSelect isOpen={languageOpen} onClose={handleCloseLanguage} />}
      <PopupAccountChange
        open={accountOpen}
        onClose={() => {
          setAccountOpen(false);
        }}
      ></PopupAccountChange>
    </Drawer>
  );
};

export default HamburgerBar;
