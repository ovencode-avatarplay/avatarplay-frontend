// React Imports
import {useEffect, useRef, useState} from 'react';
import type {MouseEvent} from 'react';

// Next Imports
import {useParams, useRouter} from 'next/navigation';

// MUI Imports
import {styled} from '@mui/material/styles';
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

// Type Imports
import type {Locale} from '@configs/i18n';
import {createClient, Session} from '@supabase/supabase-js';
import {supabase} from 'utils/supabaseClient';
import {getLocalizedUrl} from '@/utils/i18n';
import UserInfoModal from '@/app/view/main/header/header-nav-bar/UserInfoModal';

// Styled component for badge content
const BadgeContentSpan = styled('span')({
  width: 8,
  height: 8,
  borderRadius: '50%',
  cursor: 'pointer',
  backgroundColor: 'var(--mui-palette-success-main)',
  boxShadow: '0 0 0 2px var(--mui-palette-background-paper)',
});

const UserDropdown = () => {
  // States
  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState<Session | null>(null);

  // 임시 - UserInfo Modal
  const [userInfoOpen, setUserInfoOpen] = useState<boolean>(false);

  // Refs
  const anchorRef = useRef<HTMLDivElement>(null);

  // Hooks
  const router = useRouter();
  const {settings} = {settings: {skin: null}};
  const {lang: locale} = useParams();

  const handleDropdownOpen = async () => {
    const session = await supabase.auth.getSession();

    if (!session?.data?.session) {
      router.push('/auth');
      return;
    }

    !open ? setOpen(true) : setOpen(false);
  };

  useEffect(() => {
    const handleAuthStateChange = async (event: any, session: Session | null) => {
      if (event === 'SIGNED_IN') {
        setAuth(session);
        try {
          const jwtToken = session?.access_token; // 세션에서 JWT 토큰 추출

          const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/auth/sign-in`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`, // JWT를 Authorization 헤더에 포함
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            console.error('Failed to authenticate:', response.statusText);
            return;
          }

          const data = await response.json();
          localStorage.setItem('jwt', data.accessToken);
        } catch (error) {
          console.error('Error occurred during authentication:', error);
        }
      } else if (event === 'INITIAL_SESSION') {
        setAuth(session);
      }
    };

    const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthStateChange(event, session);
    });

    return () => {
      console.log(authListener);
    };
  }, []);

  const handleDropdownClose = (event?: MouseEvent<HTMLLIElement> | (MouseEvent | TouchEvent), url?: string) => {
    if (url) {
      router.push(getLocalizedUrl(url, locale as Locale));
    }

    if (anchorRef.current && anchorRef.current.contains(event?.target as HTMLElement)) {
      return;
    }

    setOpen(false);
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
        ref={anchorRef}
        overlap="circular"
        badgeContent={<BadgeContentSpan onClick={handleDropdownOpen} />}
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        className="mis-2"
      >
        <Avatar
          ref={anchorRef}
          alt={auth?.user?.email || ''}
          src={auth?.user?.user_metadata?.picture || ''}
          onClick={handleDropdownOpen}
          className="cursor-pointer bs-[38px] is-[38px]"
        />
      </Badge>
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
                <MenuList>
                  <div className="flex items-center plb-2 pli-6 gap-2" tabIndex={-1}>
                    <Avatar alt={auth?.user?.email || ''} src={auth?.user?.user_metadata?.picture || ''} />
                    <div className="flex items-start flex-col">
                      <Typography className="font-medium" color="text.primary">
                        {auth?.user?.email || ''}
                      </Typography>
                      <Typography variant="caption">{auth?.user?.email || ''}</Typography>
                    </div>
                  </div>
                  <Divider className="mlb-1" />
                  <MenuItem className="mli-2 gap-3" onClick={() => setUserInfoOpen(true)}>
                    {/* e => handleDropdownClose(e, '/pages/user-profile') */}
                    <i className="tabler-user" />
                    <Typography color="text.primary">My Profile</Typography>
                  </MenuItem>

                  <MenuItem className="mli-2 gap-3" onClick={e => handleDropdownClose(e, '/pages/account-settings')}>
                    <i className="tabler-settings" />
                    <Typography color="text.primary">Settings</Typography>
                  </MenuItem>
                  <MenuItem className="mli-2 gap-3" onClick={e => handleDropdownClose(e, '/pages/pricing')}>
                    <i className="tabler-currency-dollar" />
                    <Typography color="text.primary">Pricing</Typography>
                  </MenuItem>
                  <MenuItem className="mli-2 gap-3" onClick={e => handleDropdownClose(e, '/pages/faq')}>
                    <i className="tabler-help-circle" />
                    <Typography color="text.primary">FAQ</Typography>
                  </MenuItem>
                  <div className="flex items-center plb-2 pli-3">
                    <Button
                      fullWidth
                      variant="contained"
                      color="error"
                      size="small"
                      endIcon={<i className="tabler-logout" />}
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
      <UserInfoModal open={userInfoOpen} onClose={() => setUserInfoOpen(false)} />
    </>
  );
};

export default UserDropdown;
