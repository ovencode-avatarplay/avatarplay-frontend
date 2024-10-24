import React, {useState} from 'react';
import {Button} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import Style from './HeaderNavBar.module.css';
import USerInfoModal from './UserInfoModal';
import Logo256White from '/public/Images/Talkain_logo_256_white.png';
import Logo256Black from '/public/Images/Talkain_logo_256_black.png';
import Logo512White from '/public/Images/Talkain_logo_512_white.png';
import Logo512Black from '/public/Images/Talkain_logo_512_black.png';
import Image from 'next/image';
const HeaderNavBar = () => {
  const [open, setOpen] = useState(false); // 모달의 열림 상태 관리

  const handleClickOpen = () => {
    setOpen(true); // 모달 열기
  };

  const handleClose = () => {
    setOpen(false); // 모달 닫기
  };

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
          <div className={Style.userProfile} onClick={handleClickOpen}>
            {' '}
            {/* 원래는 SideBar를 여는 역할이지만 SideBar가 기획쪽에서 논의할 내용이 있기 때문에 임시처리로 UserDataEdit 로 넘김 */}
            <Avatar alt="User Profile" src="/path/to/user/image.jpg" />
            <div className={Style.dot}></div>
          </div>
        </div>
      </header>
      {/* 유저 정보 모달 */}
      <USerInfoModal open={open} onClose={handleClose} /> {/* 모달 컴포넌트 사용 */}
    </>
  );
};

export default HeaderNavBar;
