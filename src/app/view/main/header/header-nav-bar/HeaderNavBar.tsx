import React, {useState} from 'react';
import {Button} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Style from './HeaderNavBar.module.css';
import Logo256White from '/public/Images/Talkain_logo_256_white.png';
import Logo256Black from '/public/Images/Talkain_logo_256_black.png';
import Logo512White from '/public/Images/Talkain_logo_512_white.png';
import Logo512Black from '/public/Images/Talkain_logo_512_black.png';
import Image from 'next/image';
import UserDropdown from '@shared/UserDropdown';

const HeaderNavBar = () => {
  const [logo, setLogo] = useState(Logo256Black);

  return (
    <>
      <header className={Style.navbar}>
        <div className={Style.logo}>
          <Image src={logo} alt="Logo" width={128} height={128} priority />
        </div>
        <div className={Style.right}>
          <Button>
            <NotificationsIcon />
          </Button>
          <UserDropdown />
        </div>
      </header>
    </>
  );
};

export default HeaderNavBar;
