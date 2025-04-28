import React, {useEffect, useState} from 'react';
import styles from './ChatEditDrawer.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldLeave, BoldReport, BoldTranslator, BoldUserCircle, LineArrowRight, LineEdit} from '@ui/Icons';
import PopupAutoTranslating from './PopupAutoTranslating';
import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';

interface Props {
  open: boolean;
  onClose: () => void;
  onRename?: (newName: string) => void;
  onCopy?: () => void;
  onMove?: () => void;
  onShare?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}

const ChatEditDrawer: React.FC<Props> = ({open, onClose, onRename, onCopy, onMove, onShare, onDownload, onDelete}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectLang, setSelectLang] = useState<string>('korea');

  const languages = Object.keys(LanguageType).filter(key => {
    return isNaN(Number(key)); // 숫자형 키는 버리고, 문자열 키만 남겨
  });
  return (
    <>
      <CustomDrawer open={open} onClose={onClose}>
        <ul className={styles.fileEditDrawerContainer}>
          <>
            <li className={styles.editDrawerButton} onClick={onMove}>
              <div className={styles.itemBox}>
                <img src={BoldTranslator.src} className={styles.icons}></img>
                {getLocalizedText('TODO : Move to a folder')}
              </div>
              <button
                className={styles.editRightArrowButton}
                onClick={() => {
                  setIsMenuOpen(true);
                }}
              >
                {selectLang}
                <img src={LineArrowRight.src} />
              </button>
            </li>
            <li className={styles.editDrawerButton} onClick={onCopy}>
              <div className={styles.itemBox}>
                <img src={BoldUserCircle.src} className={styles.icons}></img>
                {getLocalizedText('TODO : Make a copy')}
              </div>
            </li>

            <li className={styles.editDrawerButton} onClick={onShare}>
              <div className={styles.itemBox}>
                <img src={BoldReport.src} className={styles.icons}></img>
                {getLocalizedText('TODO : Share')}
              </div>
            </li>
            <li className={styles.editDrawerButton} onClick={onDownload}>
              <div className={styles.itemBox}>
                <img src={BoldReport.src} className={styles.icons}></img>
                {getLocalizedText('TODO : Download')}
              </div>
            </li>
            <li className={styles.editDrawerButton} onClick={onDelete}>
              <div className={styles.itemBox}>
                <img src={BoldLeave.src} className={styles.icons}></img>
                {getLocalizedText('TODO : Delete')}
              </div>
            </li>
          </>
        </ul>
      </CustomDrawer>
      <PopupAutoTranslating
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onConfirm={setSelectLang}
        languages={languages}
      ></PopupAutoTranslating>
    </>
  );
};

export default ChatEditDrawer;
