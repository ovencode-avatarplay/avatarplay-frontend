import React, {useEffect, useState} from 'react';
import {Modal, Box} from '@mui/material';
import styles from './FilterSelector.module.css';
import {BoldRadioButton, BoldRadioButtonSelected, BoldRadioButtonSubtract, LineRefresh} from '@ui/Icons';
import CustomButton from '../layout/shared/CustomButton';
import getLocalizedText from '@/utils/getLocalizedText';

export interface FilterDataItem {
  key: string;
  icon?: string;
  state?: string;
}

interface FilterSelectorProps {
  filterData: FilterDataItem[];
  onSave: (selectedFilters: {positive: FilterDataItem[]; negative: FilterDataItem[]}) => void;
  open: boolean;
  onClose: () => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({filterData, onSave, open, onClose}) => {
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: 'empty' | 'selected' | 'remove'}>({});
  const [isRotating, setIsRotating] = useState(false);

  const handleToggleFilter = (name: string) => {
    setSelectedFilters(prevState => {
      const currentState = prevState[name] ?? 'empty';

      const newState = currentState === 'empty' ? 'selected' : currentState === 'selected' ? 'remove' : 'empty';
      return {...prevState, [name]: newState};
    });
  };

  const handleSave = () => {
    const positive = filterData.filter(item => selectedFilters[item.key] === 'selected');
    const negative = filterData.filter(item => selectedFilters[item.key] === 'remove');
    onSave({positive, negative});
    onClose();
  };

  const handleReset = () => {
    const resetState: {[key: string]: 'empty'} = {};
    filterData.forEach(item => {
      resetState[item.key] = 'empty';
    });
    setSelectedFilters(resetState);

    // 회전 효과 트리거
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 600); // 애니메이션 길이와 맞춰야 함
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalBox}>
        <div className={styles.filterSelectorContainer}>
          <h1 className={styles.filterTitle}>{getLocalizedText('common_alert_029')}</h1>
          <ul className={styles.filterList}>
            {filterData.map(item => (
              <li key={item.key} className={styles.filterItem}>
                <div className={styles.filterContent}>
                  <div className={styles.textArea}>
                    <span className={styles.filterText}>{getLocalizedText(item.key)}</span>
                    {item.icon && <img className={styles.filterIcon} src={item.icon} alt={`${item.key} icon`} />}
                  </div>
                  <button className={`${styles.filterButton}`} onClick={() => handleToggleFilter(item.key)}>
                    <img
                      className={styles.buttonIcon}
                      src={
                        selectedFilters[item.key] === 'selected'
                          ? BoldRadioButtonSelected.src
                          : selectedFilters[item.key] === 'remove'
                          ? BoldRadioButtonSubtract.src
                          : BoldRadioButton.src
                      }
                    />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <button
            className={`${styles.refreshButton} `}
            onClick={() => {
              const resetState: {[key: string]: 'empty'} = {};
              filterData.forEach(item => {
                resetState[item.key] = 'empty';
                handleReset();
              });
              setSelectedFilters(resetState);
            }}
          >
            <div className={styles.refreshText}>{getLocalizedText('common_button_refresh')}</div>
            <img className={`${styles.refreshIcon} ${isRotating ? styles.rotateOnce : ''}`} src={LineRefresh.src} />
          </button>
          <CustomButton size="Large" state="Normal" type="ColorPrimary" onClick={handleSave} style={{width: '100%'}}>
            {getLocalizedText('common_button_save')}
          </CustomButton>
        </div>
      </Box>
    </Modal>
  );
};

export default FilterSelector;
