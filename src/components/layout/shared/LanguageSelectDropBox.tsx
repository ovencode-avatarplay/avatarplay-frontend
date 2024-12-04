import React, {useEffect} from 'react';

import {Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Box} from '@mui/material';
import styles from './LanguageSelectDropBox.module.css';

import {changeLanguage, LanguageType, sendGetLanguage} from '@/app/NetWork/AuthNetwork';

import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {setLanguage} from '@/redux-store/slices/UserInfo';
import Cookies from 'js-cookie';

const LanguageSelectDropBox: React.FC = () => {
  const dispatch = useDispatch();
  const selectedLanguage = useSelector((state: RootState) => state.user.language);

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
      if (language !== undefined) {
        dispatch(setLanguage(language));
      }
    } catch (error) {
      console.error('Failed to fetch language:', error);
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
