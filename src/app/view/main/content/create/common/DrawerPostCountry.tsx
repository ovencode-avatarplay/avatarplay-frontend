import React, {useState} from 'react';
import styles from './DrawerPostCountry.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import ExploreSearchInput from '../../searchboard/searchboard-header/ExploreSearchInput';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {LineClose} from '@ui/Icons';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';
import {getLangKey, LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import getLocalizedText from '@/utils/getLocalizedText';

interface DrawerPostCountryProps {
  isOpen: boolean;
  onClose: () => void;
  selectableCountryList: LanguageType[];
  postCountryList: LanguageType[];
  onUpdatePostCountry: (updatedList: LanguageType[]) => void;
  onRemovePostCountry?: (country: LanguageType) => void;
  isAll: boolean;
  setIsAll: (checked: boolean) => void;
}

const DrawerPostCountry: React.FC<DrawerPostCountryProps> = ({
  isOpen,
  onClose,
  selectableCountryList,
  postCountryList,
  onUpdatePostCountry,
  onRemovePostCountry,
  isAll,
  setIsAll,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const filteredSelectableCountries = selectableCountryList.filter(
    item => LanguageType[item].toLowerCase().includes(searchValue.toLowerCase()) && !postCountryList.includes(item),
  );

  const handleAddPostCountry = (country: LanguageType) => {
    if (!postCountryList.includes(country)) {
      onUpdatePostCountry([...postCountryList, country]);
    }
  };

  const handleRemovePostCountry = (country: LanguageType) => {
    if (onRemovePostCountry) {
      onRemovePostCountry(country);
    } else {
      const updatedList = postCountryList.filter(item => item !== country);
      onUpdatePostCountry(updatedList);
    }
  };

  const handleToggleAll = (checked: boolean) => {
    setIsAll(checked);
    if (checked) {
      onUpdatePostCountry(selectableCountryList);
    } else {
      onUpdatePostCountry([]);
    }
  };

  const renderSelectCountryItem = (item: LanguageType) =>
    !postCountryList.includes(item) && (
      <li key={item}>
        <CustomRadioButton
          displayType="buttonText"
          shapeType="square"
          label={getLocalizedText('Common', getLangKey(item))}
          value={item}
          onSelect={() => handleAddPostCountry(item)}
          selectedValue={null}
          containterStyle={{gap: '0px'}}
        />
      </li>
    );

  const renderPostCountryItem = (item: LanguageType) => (
    <li key={item} className={styles.postItem}>
      <span className={styles.postItemName}>{getLocalizedText('Common', getLangKey(item))}</span>
      <button className={styles.deleteButton} onClick={() => handleRemovePostCountry(item)}>
        <img className={styles.deleteIcon} src={LineClose.src} />
      </button>
    </li>
  );

  return (
    <CustomDrawer
      open={isOpen}
      onClose={onClose}
      title={getLocalizedText('common_button_submit')}
      contentStyle={{padding: '0px', marginTop: '20px'}}
    >
      <div className={styles.searchArea}>
        <ExploreSearchInput value={searchValue} onChange={e => setSearchValue(e.target.value)} />
      </div>
      <div className={styles.positionCountryArea}>
        <div className={styles.allButtonArea}>
          <CustomCheckbox
            displayType="buttonText"
            shapeType="square"
            checked={isAll}
            onToggle={handleToggleAll}
            label={getLocalizedText('shared017_label_002')}
            containerStyle={{marginTop: '12px'}}
          />
        </div>
        <div className={styles.settingArea}>
          <div className={styles.selectableCountryArea}>
            <ul className={styles.selectableCountryList}>
              <span className={styles.listTitle}>{getLocalizedText('shared017_label_003')}</span>
              {filteredSelectableCountries.length > 0 ? (
                filteredSelectableCountries.map(item => renderSelectCountryItem(item))
              ) : (
                <li className={styles.noResult}>{getLocalizedText('TODO Localize : No matching results')}</li>
              )}
            </ul>
          </div>
          <div className={styles.postCountryArea}>
            <ul className={styles.postCountryList}>
              <span className={styles.listTitle}>{getLocalizedText('shared017_label_004')}</span>
              {postCountryList.map(item => renderPostCountryItem(item))}
            </ul>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default DrawerPostCountry;
