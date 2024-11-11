import React, {useState} from 'react';

import Image from 'next/image';

import {Button} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import styles from './HeaderNavBar.module.css';

import Logo256White from '/public/images/Talkain_logo_256_white.png';
import Logo256Black from '/public/images/Talkain_logo_256_black.png';
import Logo512White from '/public/images/Talkain_logo_512_white.png';
import Logo512Black from '/public/images/Talkain_logo_512_black.png';

import UserDropdown from '@shared/UserDropdown';

const HeaderNavBar = () => {
  const [logo, setLogo] = useState(Logo256Black);

  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <Image src={logo} alt="Logo" width={128} height={128} priority />
        </div>
        <div className={styles.right}>
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
