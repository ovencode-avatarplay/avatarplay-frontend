import React, {useEffect, useState} from 'react';
import {Select, MenuItem, FormControl, InputLabel, SelectChangeEvent, Box} from '@mui/material';
import {changeLanguage, LanguageType, sendGetLanguage} from '@/app/NetWork/AuthNetwork';
import styles from './LanguageSelectDropBox.module.css';

const LanguageSelectDropBox: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageType>(LanguageType.Korean);
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
      setSelectedLanguage(language !== undefined ? language : LanguageType.Korean); // 기본값 설정
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
        setSelectedLanguage(language);
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
    <Box className={styles.languageSelectorContainer}>
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
