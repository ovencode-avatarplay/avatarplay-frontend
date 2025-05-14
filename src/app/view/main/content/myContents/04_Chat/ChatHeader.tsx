import React from 'react';
import styles from './ChatHeader.module.css';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import TranslateIcon from '@mui/icons-material/Translate';
import SettingsIcon from '@mui/icons-material/Settings';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {LineArrowLeft, LineCam, LinePhone, LineRecording} from '@ui/Icons';
import {useAtom} from 'jotai';
import {isOpenAddContentAtom, isOpenEditAtom} from './ChatAtom';

interface Props {
  onClose: () => void;
  anotherImageUrl: string;
  anotherProfileName: string;
  anotherProfileEmail: string;
}

const ChatHeader: React.FC<Props> = ({onClose, anotherImageUrl, anotherProfileName, anotherProfileEmail}) => {
  const [isOpenEdit, setOpenEdit] = useAtom(isOpenEditAtom);

  const [isOpenAddContent, setIsOpenAddContent] = useAtom(isOpenAddContentAtom);
  return (
    <div className={styles.container}>
      {/* 뒤로가기 */}
      <IconButton
        className={styles.backButton}
        onClick={() => {
          onClose();
          setIsOpenAddContent(false);
          setOpenEdit(false);
        }}
      >
        <img src={LineArrowLeft.src} className={styles.arrowIcon}></img>
      </IconButton>

      {/* 프로필 및 텍스트 */}
      <div className={styles.chatInfo}>
        <Avatar alt="profile" src={anotherImageUrl} sx={{width: 40, height: 40}} />
        <div className={styles.textInfo}>
          <div className={styles.name}>{anotherProfileName}</div>
          <div className={styles.episode}>{anotherProfileEmail}</div>
        </div>
      </div>

      {/* 우측 아이콘들 */}
      <div className={styles.rightIcons}>
        <IconButton size="small">
          <img src={LineCam.src} className={styles.camIcon} />
        </IconButton>
        <IconButton size="small">
          <img src={LinePhone.src} className={styles.phoneIcon} />
        </IconButton>
        <IconButton size="small" onClick={() => setOpenEdit(true)}>
          <MoreVertIcon />
        </IconButton>
      </div>
    </div>
  );
};

export default ChatHeader;
