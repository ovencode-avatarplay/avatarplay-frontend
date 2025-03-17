import React, {useEffect, useState} from 'react';
import {changeLanguage, LanguageType, sendGetLanguage} from '@/app/NetWork/AuthNetwork';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {useRouter} from 'next/navigation';
import {setLanguage} from '@/redux-store/slices/UserInfo';
import {changeLanguageAndRoute} from '@/utils/UrlMove';
import {fetchLanguage} from '@/components/layout/shared/LanguageSetting';
import {i18n} from 'next-i18next';
import {Dialog, SelectChangeEvent} from '@mui/material';
import {createPortal} from 'react-dom';
import styles from './ModalLanguageSelect.module.css';
import {BoldArrowLeft, LineSearch} from '@ui/Icons';
import CustomInput from '@/components/layout/shared/CustomInput';

interface FullScreenModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalLanguageSelect: React.FC<FullScreenModalProps> = ({isOpen, onClose}) => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state: RootState) => state.user.language);
  const router = useRouter();

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchLanguage(router);
  }, []);

  if (!isOpen) return null; // 모달이 닫혀있으면 렌더링 안 함

  const LanguageDisplay = [
    {value: LanguageType.Korean, label: 'Korean'},
    {value: LanguageType.English, label: 'English'},
    {value: LanguageType.Japanese, label: 'Japanese'},
    {value: LanguageType.French, label: 'French'},
    {value: LanguageType.Spanish, label: 'Spanish'},
    {value: LanguageType.ChineseSimplified, label: 'Chinese Simplified'},
    {value: LanguageType.ChineseTraditional, label: 'Chinese Traditional'},
    {value: LanguageType.Portuguese, label: 'Portuguese'},
    {value: LanguageType.German, label: 'German'},
  ];

  const handleLanguageChange = async (event: SelectChangeEvent<number>) => {
    try {
      const value = event.target.value;

      if (value === undefined || value === null) {
        throw new Error('Invalid language value');
      }

      const newLanguage = parseInt(String(value), 10) as LanguageType;

      const response = await changeLanguage({languageType: newLanguage});
      const language = response.data?.languageType;

      if (language !== undefined) {
        dispatch(setLanguage(language));
        changeLanguageAndRoute(language, router, i18n);
      } else {
        throw new Error('Failed to retrieve updated language from server');
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  // 입력값 변경 시 실행되는 함수
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value); // 입력 필드의 값 업데이트
  };
  return (
    <Dialog open={isOpen} fullScreen onClose={onClose}>
      <div className={styles.backgroundArea}>
        <div className={styles.titleArea}>
          <div className={styles.leftPrevArea}>
            <img className={styles.leftPrevButton} src={BoldArrowLeft.src} alt="Prev" />
            <div className={styles.titleText}>Select Language</div>
          </div>
        </div>

        <div className={styles.inputBox}>
          <CustomInput
            inputType="LeftIcon"
            textType="InputOnly"
            state="Default"
            value={inputValue}
            placeholder={''}
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
        <div className={styles.selectNation}>sssssssss</div>
      </div>
    </Dialog>
  );
};

export default ModalLanguageSelect;
