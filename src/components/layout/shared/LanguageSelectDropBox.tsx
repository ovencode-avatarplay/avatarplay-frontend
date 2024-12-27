import React, {useEffect} from 'react';

import {Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Box} from '@mui/material';
import styles from './LanguageSelectDropBox.module.css';

import {changeLanguage, LanguageType, sendGetLanguage} from '@/app/NetWork/AuthNetwork';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {setLanguage} from '@/redux-store/slices/UserInfo';
import Cookies from 'js-cookie';
import {useRouter} from 'next/navigation';
import {changeLanguageAndRoute} from '@/utils/UrlMove';
import {i18n} from 'next-i18next';

const LanguageSelectDropBox: React.FC = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state: RootState) => state.user.language);
  const router = useRouter();

  // 브라우저 언어 설정을 LanguageType으로 변환
  const getBrowserLanguage = (): LanguageType => {
    const browserLang = navigator.language;

    if (browserLang.startsWith('ko')) return LanguageType.Korean;
    if (browserLang.startsWith('en')) return LanguageType.English;
    if (browserLang.startsWith('ja')) return LanguageType.Japanese;
    if (browserLang.startsWith('fr')) return LanguageType.French;
    if (browserLang.startsWith('es')) return LanguageType.Spanish;
    if (browserLang.startsWith('zh')) {
      return browserLang.includes('Hans') ? LanguageType.ChineseSimplified : LanguageType.ChineseTraditional;
    }
    if (browserLang.startsWith('pt')) return LanguageType.Portuguese;
    if (browserLang.startsWith('de')) return LanguageType.German;

    return LanguageType.English; // 기본값
  };

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
  // 언어 가져오기
  const fetchLanguage = async () => {
    try {
      const response = await sendGetLanguage({});
      const language = response.data?.languageType;

      // 서버에서 언어를 가져오지 못한 경우 브라우저 언어 사용
      if (language !== undefined) {
        dispatch(setLanguage(language));
      } else {
        const browserLang = getBrowserLanguage();
        dispatch(setLanguage(browserLang));
        Cookies.set('language', String(browserLang), {expires: 365});
      }
    } catch (error) {
      console.error('Failed to fetch language:', error);
      const browserLang = getBrowserLanguage();
      dispatch(setLanguage(browserLang));
      Cookies.set('language', String(browserLang), {expires: 365});
    }
  };

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
        Cookies.set('language', String(language), {expires: 365});

        changeLanguageAndRoute(language, router, i18n);
      } else {
        throw new Error('Failed to retrieve updated language from server');
      }
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };
  useEffect(() => {
    fetchLanguage();
  }, []);

  return (
    <Box className={styles.languageSelectorContainer} sx={{marginRight: '30px', paddingLeft: '50px'}}>
      <InputLabel id="language-selector-label" className={styles.languageLabel}>
        Language
      </InputLabel>
      <FormControl fullWidth>
        <Select
          labelId="language-selector-label"
          value={selectedLanguage ?? LanguageType.Korean}
          onChange={handleLanguageChange}
          className={styles.languageSelect}
        >
          {LanguageDisplay.map(language => (
            <MenuItem key={language.value} value={language.value}>
              {language.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default LanguageSelectDropBox;
