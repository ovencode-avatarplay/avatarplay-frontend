import React, {useState} from 'react';
import styles from './PopupAutoTranslating.module.css'; // CSS 모듈 사용한다고 가정
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import {LineArrowLeft, LineCheck, LineSearch} from '@ui/Icons';
import {InputAdornment} from '@mui/material';

interface PopupAutoTranslatingProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (selectedLanguage: string) => void;
  languages: string[];
}

const PopupAutoTranslating: React.FC<PopupAutoTranslatingProps> = ({open, onClose, onConfirm, languages}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLanguages = languages.filter(lang => lang.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleSelect = (lang: string) => {
    setSelectedLanguage(lang);
  };

  const handleConfirm = () => {
    if (selectedLanguage) {
      onConfirm(selectedLanguage);
      onClose();
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 3001, // 원하는 z-index 값
      }}
    >
      <div className={styles.modalContainer}>
        <div className={styles.header}>
          <button className={styles.backButton} onClick={onClose}>
            <img src={LineArrowLeft.src} className={styles.leftIcon}></img>
          </button>
          <div className={styles.title}>Auto-translating</div>
        </div>

        <div className={styles.searchBox}>
          <TextField
            fullWidth
            placeholder="Text Placeholder"
            variant="outlined"
            size="small"
            onChange={e => setSearchQuery(e.target.value)}
            value={searchQuery}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '10px', // ✅ 완전 둥글게 (pill형)
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <img src={LineSearch.src} className={styles.serachIcon}></img>
                </InputAdornment>
              ),
              classes: {root: styles.searchInput},
            }}
          />
        </div>

        <div className={styles.languageList}>
          {filteredLanguages.map((lang, index) => (
            <div key={index} className={styles.languageItem} onClick={() => handleSelect(lang)}>
              {lang}
              {selectedLanguage === lang && (
                <span className={styles.checkmark}>
                  <img src={LineCheck.src} className={styles.checkIcon}></img>
                </span>
              )}
            </div>
          ))}
        </div>

        <div className={styles.confirmButtonWrapper}>
          <button className={styles.confirmButton} onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PopupAutoTranslating;
