import React, {useEffect, useState} from 'react';
import {Modal, Box} from '@mui/material';
import styles from './FilterSelector.module.css';
import {BoldRadioButton, BoldRadioButtonSelected, BoldRadioButtonSubtract, LineRefresh} from '@ui/Icons';
import CustomButton from '../layout/shared/CustomButton';
import getLocalizedText from '@/utils/getLocalizedText';

export interface FilterDataItem {
  name: string;
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

  const handleToggleFilter = (name: string) => {
    setSelectedFilters(prevState => {
      const currentState = prevState[name] ?? 'empty';

      const newState = currentState === 'empty' ? 'selected' : currentState === 'selected' ? 'remove' : 'empty';
      return {...prevState, [name]: newState};
    });
  };

  const handleSave = () => {
    const positive = filterData.filter(item => selectedFilters[item.name] === 'selected');
    const negative = filterData.filter(item => selectedFilters[item.name] === 'remove');
    onSave({positive, negative});
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalBox}>
        <div className={styles.filterSelectorContainer}>
          <h1 className={styles.filterTitle}>{getLocalizedText('common_alert_029')}</h1>
          <ul className={styles.filterList}>
            {filterData.map(item => (
              <li key={item.name} className={styles.filterItem}>
                <div className={styles.filterContent}>
                  <div className={styles.textArea}>
                    <span className={styles.filterText}>{item.name}</span>
                    {item.icon && <img className={styles.filterIcon} src={item.icon} alt={`${item.name} icon`} />}
                  </div>
                  <button className={`${styles.filterButton}`} onClick={() => handleToggleFilter(item.name)}>
                    <img
                      className={styles.buttonIcon}
                      src={
                        selectedFilters[item.name] === 'selected'
                          ? BoldRadioButtonSelected.src
                          : selectedFilters[item.name] === 'remove'
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
            className={styles.refreshButton}
            onClick={() => {
              const resetState: {[key: string]: 'empty'} = {};
              filterData.forEach(item => {
                resetState[item.name] = 'empty';
              });
              setSelectedFilters(resetState);
            }}
          >
            <div className={styles.refreshText}>{getLocalizedText('common_button_refresh')}</div>
            <img className={styles.refreshIcon} src={LineRefresh.src} />
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
