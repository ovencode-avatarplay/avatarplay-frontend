import React, {useState} from 'react';
import styles from './DrawerPostCountry.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import ExploreSearchInput from '../../searchboard/searchboard-header/ExploreSearchInput';
import {LanguageType} from '@/redux-store/slices/ContentInfo';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {LineClose} from '@ui/Icons';
import CustomCheckbox from '@/components/layout/shared/CustomCheckBox';

interface DrawerPostCountryProps {
  isOpen: boolean;
  onClose: () => void;
  selectableCountryList: LanguageType[];
  postCountryList: LanguageType[];
  onUpdatePostCountry: (updatedList: LanguageType[]) => void;
  isAll: boolean;
  setIsAll: (checked: boolean) => void;
}

const DrawerPostCountry: React.FC<DrawerPostCountryProps> = ({
  isOpen,
  onClose,
  selectableCountryList,
  postCountryList,
  onUpdatePostCountry,
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
    const updatedList = postCountryList.filter(item => item !== country);
    onUpdatePostCountry(updatedList);
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
          label={LanguageType[item]}
          value={item}
          onSelect={() => handleAddPostCountry(item)}
          selectedValue={null}
          containterStyle={{gap: '0px'}}
        />
      </li>
    );

  const renderPostCountryItem = (item: LanguageType) => (
    <li key={item} className={styles.postItem}>
      <span className={styles.postItemName}>{LanguageType[item]}</span>
      <button className={styles.deleteButton} onClick={() => handleRemovePostCountry(item)}>
        <img className={styles.deleteIcon} src={LineClose.src} />
      </button>
    </li>
  );

  return (
    <CustomDrawer
      open={isOpen}
      onClose={onClose}
      title="Post Country"
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
            label="All"
          />
        </div>
        <div className={styles.settingArea}>
          <div className={styles.selectableCountryArea}>
            <ul className={styles.selectableCountryList}>
              <span className={styles.listTitle}>Select country</span>
              {filteredSelectableCountries.length > 0 ? (
                filteredSelectableCountries.map(item => renderSelectCountryItem(item))
              ) : (
                <li className={styles.noResult}>No matching results</li>
              )}
            </ul>
          </div>
          <div className={styles.postCountryArea}>
            <ul className={styles.postCountryList}>
              <span className={styles.listTitle}>Post country</span>
              {postCountryList.map(item => renderPostCountryItem(item))}
            </ul>
          </div>
        </div>
      </div>
    </CustomDrawer>
  );
};

export default DrawerPostCountry;
