// React Imports
import {useEffect, useRef, useState} from 'react';
import type {MouseEvent} from 'react';

// Next Imports
import {useParams, useRouter} from 'next/navigation';

// MUI Imports
import Badge from '@mui/material/Badge';
import Avatar from '@mui/material/Avatar';
import Popper from '@mui/material/Popper';
import Fade from '@mui/material/Fade';
import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import MenuList from '@mui/material/MenuList';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import styles from './UserDropdown.module.css';

// Type Imports
import {createClient, Session} from '@supabase/supabase-js';
import {supabase} from 'utils/supabaseClient';
import UserInfoModal from '@/app/view/main/header/header-nav-bar/UserInfoModal';
import {Drawer, SelectChangeEvent} from '@mui/material';
import Link from 'next/link';
import LanguageSelectDropBox from './LanguageSelectDropBox';
import {getCurrentLanguage, getLocalizedLink, pushLocalizedRoute, refreshLanaguage} from '@/utils/UrlMove';
import {fetchLanguage} from './LanguageSetting';
import {getLangUrlCode} from '@/configs/i18n';
import Cookies from 'js-cookie';
import {getCookiesLanguageType} from '@/utils/browserInfo';

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState<Session | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(0);

  // 임시 - UserInfo Modal
  const [userInfoOpen, setUserInfoOpen] = useState<boolean>(false);

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null);

  // Hooks
  const router = useRouter();
  const {settings} = {settings: {skin: null}};

  const handleDropdownOpen = async () => {
    const session = await supabase.auth.getSession();

    if (!session?.data?.session) {
      router.push('/auth');
      return;
    }

    !open ? setOpen(true) : setOpen(false);
  };

  const handleDrawerOpen = async () => {
    setDrawerOpen(true);
  };

  const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLanguageChange = (event: SelectChangeEvent<number>) => {
    setSelectedLanguage(Number(event.target.value));
  };

  useEffect(() => {
    const handleAuthStateChange = async (event: any, session: Session | null) => {
      if (event === 'SIGNED_IN') {
        if (auth?.access_token == session?.access_token) return;
        //alert('여기아');

        setAuth(session);
        try {
          console.log('로그인 시작');
          const jwtToken = session?.access_token; // 세션에서 JWT 토큰 추출
          const _language = getCurrentLanguage();
          const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/auth/sign-in`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`, // JWT를 Authorization 헤더에 포함
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              language: _language,
            }),
          });

          if (!response.ok) {
            console.error('Failed to authenticate:', response.statusText);
            console.log('SIGNED_IN  리스폰스 ok 실패');
            return;
          }

          const data = await response.json();
          localStorage.setItem('jwt', data.accessToken);
          setTimeout(() => {
            fetchLanguage(router);
          }, 100);
          //setSignIn();
          console.log('서버에 저장된 언어로 가져오자');
        } catch (error) {
          console.error('Error occurred during authentication:', error);
        }
      } else if (event === 'INITIAL_SESSION') {
        setAuth(session);
        const cookieLang = Cookies.get('language') || 'en-US';
        const language = getCookiesLanguageType();
        refreshLanaguage(language, router);
        console.log('브라우저에 저장된 언어로 가져오자');
      }
    };

    const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthStateChange(event, session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return;
    }

    setOpen(false);

    if (url && router) pushLocalizedRoute(url, router);

    // if (url) {
    //   router.push(getLocalizedUrl(url, locale as Locale));
    // }

    // if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
    //   return;
    // }

    // setOpen(false);
  };

  const handleUserLogout = async () => {
    try {
      // Sign out from the app
      //await signOut({callbackUrl: process.env.NEXT_PUBLIC_APP_URL});
      await supabase.auth.signOut();
      setOpen(false);
      setAuth(null);
      localStorage.removeItem('jwt');
    } catch (error) {
      console.error(error);

      // Show above error in a toast like following
      // toastService.error((err as Error).message)
    }
  };

  return (
    <>
      <Badge
        style={{padding: '12px 25px', margin: '12px -25px'}}
        overlap="circular"
        badgeContent={<span className={styles.avatarBadge} onClick={handleDrawerOpen} />}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
      >
        <Avatar
          alt={auth?.user?.email || ''}
          src={auth?.user?.user_metadata?.picture || ''}
          onClick={handleDrawerOpen}
          className={styles.avatar}
        />
      </Badge>
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        <MenuList className={styles.menuList}>
          <MenuItem className={styles.menuItem}>
            <Avatar
              alt={auth?.user?.email || ''}
              src={auth?.user?.user_metadata?.picture || ''}
              onClick={handleDropdownOpen}
              className={styles.avatar}
            />
            <div className={styles.userInfo}>
              <Typography className={styles.userInfoText}>{auth?.user?.email || ''}</Typography>
              <Typography variant="caption" className={styles.userInfoCaption}>
                {auth?.user?.email || ''}
              </Typography>
            </div>
          </MenuItem>
          <Divider className={styles.menuDivider} />
          {/* <Link href={getLocalizedUrl(`/studio`, locale as Locale)} passHref> */}
          {/* <Link href={`/studio`} passHref>
            <MenuItem className={styles.menuItem} onClick={e => handleDropdownClose(e, 'studio')}>
              <i className={styles.tabler} />
              <Typography color="text.primary">Studio</Typography>
            </MenuItem>
          </Link>
          <MenuItem className={styles.menuItem} onClick={e => handleDropdownClose(e, '/pages/activity')}>
            <i className={styles.tabler} />
            <Typography color="text.primary">Activity</Typography>
          </MenuItem>
          <MenuItem className={styles.menuItem} onClick={e => handleDropdownClose(e, '/pages/notice')}>
            <i className={styles.tabler} />
            <Typography color="text.primary">Notice</Typography>
          </MenuItem>
          <MenuItem className={styles.menuItem} onClick={e => handleDropdownClose(e, '/pages/setting')}>
            <i className={styles.tabler} />
            <Typography color="text.primary">Setting</Typography>
          </MenuItem>
          <MenuItem className={styles.menuItem} onClick={e => handleDropdownClose(e, '/pages/supports')}>
            <i className={styles.tabler} />
            <Typography color="text.primary">Supports</Typography>
          </MenuItem> */}
          <Link href={getLocalizedLink('/studio/character')} passHref>
            <MenuItem
              className={styles.menuItem}
              onClick={e => handleDropdownClose(e, getLocalizedLink('/studio/character'))}
            >
              <i className={styles.tabler} />
              <Typography color="text.primary">Character</Typography>
            </MenuItem>
          </Link>
          <Link href={getLocalizedLink(`/studio/story`)} passHref>
            <MenuItem
              className={styles.menuItem}
              onClick={e => handleDropdownClose(e, getLocalizedLink('/studio/story'))}
            >
              <i className={styles.tabler} />
              <Typography color="text.primary">Story</Typography>
            </MenuItem>
          </Link>
          <LanguageSelectDropBox />
        </MenuList>
        <Popper
          open={open}
          transition
          disablePortal
          placement="bottom-end"
          anchorEl={anchorRef.current}
          className="min-is-[240px] !mbs-3 z-[1]"
        >
          {({TransitionProps, placement}) => (
            <Fade
              {...TransitionProps}
              style={{
                transformOrigin: placement === 'bottom-end' ? 'right top' : 'left top',
              }}
            >
              <Paper className={settings.skin === 'bordered' ? 'border shadow-none' : 'shadow-lg'}>
                <ClickAwayListener onClickAway={e => handleDropdownClose(e as MouseEvent | TouchEvent)}>
                  <MenuList className={styles.menuList}>
                    <MenuItem className={styles.menuItem} onClick={handleDropdownOpen}>
                      <Avatar
                        alt={auth?.user?.email || ''}
                        src={auth?.user?.user_metadata?.picture || ''}
                        onClick={handleDropdownOpen}
                      />
                      <div className={styles.userInfo}>
                        <Typography className={styles.userInfoText}>{auth?.user?.email || ''}</Typography>
                        <Typography variant="caption" className={styles.userInfoCaption}>
                          {auth?.user?.email || ''}
                        </Typography>
                      </div>
                    </MenuItem>
                    <Divider className={styles.menuDivider} />
                    <MenuItem className={styles.menuItem} onClick={() => setUserInfoOpen(true)}>
                      <i className={styles.tabler} />
                      <Typography color="text.primary">My Profile</Typography>
                    </MenuItem>
                    <MenuItem
                      className={styles.menuItem}
                      onClick={e => handleDropdownClose(e, '/pages/account-settings')}
                    >
                      <i className={styles.tabler} />
                      <Typography color="text.primary">Settings</Typography>
                    </MenuItem>
                    <MenuItem className={styles.menuItem} onClick={e => handleDropdownClose(e, '/service')}>
                      <i className={styles.tabler} />
                      <Typography color="text.primary">Pricing</Typography>
                    </MenuItem>
                    <MenuItem className={styles.menuItem} onClick={e => handleDropdownClose(e, '/pages/faq')}>
                      <i className={styles.tabler} />
                      <Typography color="text.primary">FAQ</Typography>
                    </MenuItem>
                    <div>
                      <Button
                        className={styles.logoutButton}
                        variant="contained"
                        color="error"
                        size="small"
                        endIcon={<i className={styles.tabler} />}
                        onClick={handleUserLogout}
                        sx={{'& .MuiButton-endIcon': {marginInlineStart: 1.5}}}
                      >
                        Logout
                      </Button>
                    </div>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Fade>
          )}
        </Popper>
      </Drawer>
      <UserInfoModal open={userInfoOpen} onClose={() => setUserInfoOpen(false)} />
    </>
  );
};

export default UserDropdown;
