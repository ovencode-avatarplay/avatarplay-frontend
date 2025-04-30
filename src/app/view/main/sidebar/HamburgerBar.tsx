import React, {useEffect, useState} from 'react';
import Drawer from '@mui/material/Drawer';
import styles from './HamburgerBar.module.css';
import {Session, UserMetadata} from '@supabase/supabase-js';
import {isLogined, pushLocalizedRoute} from '@/utils/UrlMove';
import {useDispatch, useSelector} from 'react-redux';
import {updateProfile} from '@/redux-store/slices/Profile';
import {getAuth} from '@/app/NetWork/AuthNetwork';
import {useRouter} from 'next/navigation';
import {supabase} from '@/utils/supabaseClient';
import {RootState} from '@/redux-store/ReduxStore';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldRuby, BoldStar, LineArrowRight, LineSetting, LineWallet, BoldVerifiedLabel} from '@ui/Icons';
import {Avatar} from '@mui/material';
import ModalLanguageSelect from './ModalLanguageSelect';
import PopupAccountChange from '../content/create/common/PopupAccountChange';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import {formatCurrency} from '@/utils/util-1';

interface HamburgerBarProps {
  open: boolean;
  isLeft?: boolean;
  onClose: () => void;
}

const HamburgerBar: React.FC<HamburgerBarProps> = ({open, onClose, isLeft = true}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [auth, setAuth] = useState<Session | null>(null);

  const dataProfile = useSelector((state: RootState) => state.profile);

  const [languageOpen, setLanguageOpen] = useState<boolean>(false);
  const [supportOpen, setSupportOpen] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [userMetaData, setUserMetaData] = useState<UserMetadata | null>();
  const [isLogin, setIsLogin] = useState<boolean>(false);

  const [isAlertOn, setIsAlertOn] = useState<boolean>(false);

  const dataCurrencyInfo = useSelector((state: RootState) => state.currencyInfo);

  const renderMenuItem = (icon: string, text: string, onClick: () => void, depth?: number) => {
    return (
      <li className={styles.subMenuItem} onClick={onClick}>
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

  const handleUserLogout = async () => {
    try {
      // Sign out from the app
      //await signOut({callbackUrl: process.env.NEXT_PUBLIC_APP_URL});
      await supabase.auth.signOut();
      setAuth(null);
      localStorage.removeItem('jwt');
      dispatch(updateProfile(null));
      setUserMetaData(null);
      setIsLogin(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseLanguage = () => {
    setLanguageOpen(false);
  };

  const getSessionData = async () => {
    // const session = await supabase.auth.getSession();
    // setUserMetaData(session.data.session?.user.user_metadata || null);

    const isLogin = await isLogined();
    setIsLogin(isLogin);
  };

  useEffect(() => {
    if (dataProfile.currentProfile?.profileId) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [dataProfile]);

  console.log('profile info : ', dataProfile.currentProfile);
  return (
    <Drawer open={open} onClose={onClose} anchor={isLeft ? 'left' : 'right'} classes={{paper: styles.drawerPaper}}>
      <div className={styles.drawerContent}>
        {/* 프로필 섹션 */}
        <div className={styles.profileSection} onClick={routeProfile}>
          <div className={styles.profileArea}>
            <Avatar
              // alt={auth?.user?.email || ''}
              alt={userMetaData?.email || ''}
              src={dataProfile.currentProfile?.iconImageUrl || ''}
              // onClick={routeProfile}
              className={styles.profileImage}
            />
            <div className={styles.profileBox}>
              <div className={styles.profileInfo}>
                <div className={styles.profileNameArea}>
                  <p className={styles.profileName}>
                    {/* {auth?.user.user_metadata.name} */}
                    {isLogin ? dataProfile.currentProfile?.name : getLocalizedText('common_label_guestmode')}
                  </p>
                  {isLogin ? <img className={styles.profileVerified} src={isLogin ? BoldVerifiedLabel.src : ''} /> : ''}
                </div>
                <p className={styles.profileEmail}>
                  {/* {auth?.user.user_metadata.email} */}
                  {isLogin ? userMetaData?.email : ''}
                </p>
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
            onClick={() => {
              if (isLogin) {
                setIsAlertOn(true);
              } else {
                routeProfile();
              }
            }}
            customClassName={[styles.planButton]}
          >
            {isLogin
              ? getLocalizedText('common_button_upgradeyourplan')
              : getLocalizedText('common_button_loginsignup')}
          </CustomButton>
        </ul>

        {/* 메뉴 섹션 */}
        <ul className={styles.menuList}>
          {renderMenuItem(LineSetting.src, getLocalizedText('common_button_accountconter'), () => {
            setAccountOpen(true);
          })}
          <li
            className={`${styles.menuItem} ${styles.divideItem} ${styles.lastItem}`}
            onClick={() => {
              if (isLogin) {
                pushLocalizedRoute('/main/game/shop', router);
              } else {
                routeProfile();
              }
              onClose();
            }}
          >
            <div className={styles.menuRow}>
              <div className={styles.menuContent}>
                <div className={styles.menuInfo}>
                  <img className={styles.menuIcon} src={LineWallet.src} />
                  <div className={styles.menuText}>{getLocalizedText('common_button_mywallet')}</div>
                </div>
              </div>
              <img className={styles.arrowIcon} src={LineArrowRight.src} />
            </div>
            <div className={styles.pointsSection}>
              <div className={styles.point}>
                <img className={styles.pointIcon} src={BoldRuby.src} />
                <span className={styles.pointText}>{formatCurrency(dataCurrencyInfo.ruby)}</span>
              </div>
              <div className={styles.point}>
                <img className={styles.pointIcon} src={BoldStar.src} />
                <span className={styles.pointText}>{formatCurrency(dataCurrencyInfo.star)}</span>
              </div>
            </div>
          </li>
        </ul>
        {/* 기타 메뉴 */}
        <ul className={styles.menuList}>
          {renderMenuItem('', getLocalizedText('common_button_language'), () => {
            setLanguageOpen(!languageOpen);
          })}
          {renderMenuItem('', 'Story (tmp)', routeStory)}
          {renderMenuItem('', 'Character (tmp)', routeCharacter)}
          {renderMenuItem('', 'Prompt (tmp)', routePrompt)}
          {/*
          {renderMenuItem('', getLocalizedText('common_button_supportandabout'), () => {
            setSupportOpen(!supportOpen);
          })}
          {supportOpen && (
            <>
              {renderMenuItem('', getLocalizedText('common_button_reportaproblem'), () => {}, 1)}
              {renderMenuItem('', getLocalizedText('common_button_support'), () => {}, 1)}
              {renderMenuItem('', getLocalizedText('common_button_termsandpolicies'), () => {}, 1)}
            </>
          )}
            */}
          {isLogin ? renderMenuItem('', getLocalizedText('common_button_logout'), handleUserLogout) : ''}
        </ul>
      </div>
      {languageOpen && <ModalLanguageSelect isOpen={languageOpen} onClose={handleCloseLanguage} />}
      <PopupAccountChange
        open={accountOpen}
        onClose={() => {
          setAccountOpen(false);
        }}
      ></PopupAccountChange>
      {isAlertOn && (
        <CustomPopup
          type="alert"
          title={getLocalizedText('common_alert_110')}
          buttons={[
            {
              label: 'OK',
              onClick: () => {
                setIsAlertOn(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
    </Drawer>
  );
};

export default HamburgerBar;
