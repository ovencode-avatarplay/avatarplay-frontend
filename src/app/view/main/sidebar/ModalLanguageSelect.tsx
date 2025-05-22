import React, {useEffect, useState} from 'react';
import {changeLanguage, sendGetLanguage} from '@/app/NetWork/AuthNetwork';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {useRouter} from 'next/navigation';
import {setLanguage} from '@/redux-store/slices/UserInfo';
import {changeLanguageAndRoute, getCurrentLanguage, serverChangeLanguage} from '@/utils/UrlMove';
import {fetchLanguage} from '@/components/layout/shared/LanguageSetting';
import {i18n} from 'next-i18next';
import {Dialog, SelectChangeEvent} from '@mui/material';
import {createPortal} from 'react-dom';
import styles from './ModalLanguageSelect.module.css';
import {LineArrowLeft, LineCheck, LineSearch} from '@ui/Icons';
import CustomInput from '@/components/layout/shared/CustomInput';
//import {Flag} from '@mui/icons-material';
import Flag from 'react-world-flags';
import {FlagNation, getFlagCode, LanguageType, LanguageName} from '@/app/NetWork/network-interface/CommonEnums';
import CustomButton from '@/components/layout/shared/CustomButton';
import getLocalizedText from '@/utils/getLocalizedText';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalLanguageSelect: React.FC<FullScreenModalProps> = ({isOpen, onClose}) => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state: RootState) => state.user.language);
  const router = useRouter();
  const [selectLanguage, setSelect] = useState<LanguageType>(selectedLanguage);

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    //fetchLanguage(router);
  }, []);

  if (!isOpen) return null; // 모달이 닫혀있으면 렌더링 안 함

  // 입력값 변경 시 실행되는 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // 입력 필드의 값 업데이트
  };

  // 언어선택
  const handleSelectLanguage = (num: number) => {
    setSelect(num);
  };

  const handleConformSend = async (lang: LanguageType) => {
    serverChangeLanguage(lang, dispatch, router);
    onClose();
  };
  return (
    <Dialog open={isOpen} fullScreen onClose={onClose} sx={{zIndex: 3005}}>
      <div className={styles.backgroundArea}>
        <div className={styles.titleArea}>
          <div className={styles.leftPrevArea} onClick={() => onClose()}>
            <img className={styles.leftPrevButton} src={LineArrowLeft.src} alt="Prev" />
            <div className={styles.titleText}>{getLocalizedText('shared032_title_001')}</div>
          </div>
        </div>

        <div className={styles.inputBox}>
          <CustomInput
            inputType="LeftIcon"
            textType="InputOnly"
            state="Default"
            value={inputValue}
            placeholder={getLocalizedText('common_sample_078')}
            onChange={handleInputChange}
            customClassName={[styles.inputField]}
            iconLeftImage={LineSearch.src}
            iconLeftStyle={{
              width: '13.794px',
              height: '15px',
              padding: '0',
            }}
          />
        </div>
        <div className={styles.selectArea}>
          {Object.values(LanguageType)
            .filter(v => typeof v === 'number') // Enum의 숫자 값만 필터링
            .filter(num =>
              LanguageName[num as LanguageType].toString().toLowerCase().includes(inputValue.toLowerCase()),
            )
            .map(num => {
              const flagCode = getFlagCode(num as LanguageType);
              return (
                <div className={styles.NationArea} onClick={() => handleSelectLanguage(num)}>
                  <div className={styles.flagNation}>
                    <Flag code={flagCode} style={{width: 26, height: 26}} />
                    <div className={styles.nameNation}>{LanguageName[num]}</div>
                    {selectLanguage === num && <img className={styles.checkNation} src={LineCheck.src} alt="check" />}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      <div className={styles.conformArea}>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Primary"
          onClick={() => {
            handleConformSend(selectLanguage);
          }}
          customClassName={[styles.conformButton]}
        >
          {getLocalizedText('common_button_confirm')}
        </CustomButton>
      </div>
    </Dialog>
  );
};

export default ModalLanguageSelect;
