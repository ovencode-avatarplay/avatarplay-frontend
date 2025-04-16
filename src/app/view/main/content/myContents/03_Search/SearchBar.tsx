import React, {useEffect, useState} from 'react';
import styles from './SearchBar.module.css';
import {BoldFilter, BoldFilterOn, LineArrowLeft, LineDelete, LinePlus} from '@ui/Icons';
import FilterSelector, {FilterDataItem} from '@/components/search/FilterSelector';
import getLocalizedText from '@/utils/getLocalizedText';
import {searchOptionList} from '../../searchboard/SearchBoard';
import TagsData from 'data/create/tags.json';
import useCustomRouter from '@/utils/useCustomRouter';

interface Props {
  onBack?: () => void;
  onFilterClick?: () => void;
  onSearchTextChange?: (text: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
}

const SearchBar: React.FC<Props> = ({onBack, onFilterClick, onSearchTextChange, onFocusChange}) => {
  const [isAdult, setIsAdult] = useState(true);
  const [filterDialogOn, setFilterDialogOn] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterItem, setFilterItem] = useState<FilterDataItem[]>([]);

  // Filter State
  const [positiveFilters, setPositiveFilters] = useState<FilterDataItem[]>([]);
  const [negativeFilters, setNegativeFilters] = useState<FilterDataItem[]>([]);
  const tagGroups = TagsData;
  const themeGroup = tagGroups.tagGroups.find(group => group.category === 'Theme');
  useEffect(() => {
    const items = themeGroup?.tags.map(item => ({
      state: 'empty', // 초기 상태 설정
      key: item,
    }));
    setFilterItem(items || []);
  }, []);
  const {changeParams, getParam} = useCustomRouter();
  const handlerFilterSaved = (positive: FilterDataItem[], negative: FilterDataItem[]) => {
    const positiveResult = positive.map(filter => filter.key).filter(key => themeGroup?.tags.includes(key));
    const negativeResult = negative.map(filter => filter.key).filter(key => themeGroup?.tags.includes(key));

    const localizedPositive = positiveResult.map(key => getLocalizedText('placehold', key, 'en-us'));
    const localizedNegative = negativeResult.map(key => getLocalizedText('placehold', key, 'en-us'));

    const encodedPositive = localizedPositive.join('&&');
    const encodedNegative = localizedNegative.join('!!');

    const finalFilter = [encodedPositive, encodedNegative].filter(Boolean).join('::');

    changeParams('filter', finalFilter);
  };

  const handleSave = (filters: {positive: FilterDataItem[]; negative: FilterDataItem[]}) => {
    setPositiveFilters(filters.positive);
    setNegativeFilters(filters.negative);

    setFilterItem(prevFilterItem =>
      prevFilterItem.map(item => {
        if (filters.positive.some(filter => filter.key === item.key)) {
          return {...item, state: 'selected'};
        }
        if (filters.negative.some(filter => filter.key === item.key)) {
          return {...item, state: 'remove'};
        }
        return {...item, state: 'empty'};
      }),
    );
    handlerFilterSaved(filters.positive, filters.negative);
  };

  const handleClear = () => {
    setSearchText('');
    onSearchTextChange?.('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    onSearchTextChange?.(value); // 부모에게 전달
  };

  return (
    <div className={styles.container}>
      {/* ← 뒤로가기 */}
      <div className={styles.iconLeft} onClick={onBack}>
        <img src={LineArrowLeft.src} alt="back" className={styles.arrowIcon} />
      </div>

      {/* 입력창 + 토글 */}
      <div className={styles.inputArea}>
        <div className={styles.inputBox}>
          <input
            className={styles.input}
            placeholder="Search"
            value={searchText}
            onChange={handleChange}
            onFocus={() => onFocusChange?.(true)}
            onBlur={() => onFocusChange?.(false)}
          />

          {/* X 버튼 */}
          <div className={styles.buttonBox}>
            {searchText && (
              <button className={styles.clearButton} onClick={handleClear}>
                <img src={LinePlus.src} alt="clear" className={styles.clearIcon} />
              </button>
            )}

            <div className={styles.adultToggle} onClick={() => setIsAdult(!isAdult)}>
              <div className={styles.toggleBase}>
                <div className={`${styles.toggleButton} ${isAdult ? styles.on : ''}`} />
              </div>
              <span className={styles.adultLabel}>Adult</span>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 아이콘 */}
      <div
        className={styles.filterIconWrap}
        onClick={() => {
          console.log('asdasd');
          setFilterDialogOn(true);
        }}
      >
        {positiveFilters.length > 0 || negativeFilters.length > 0 ? (
          <img src={BoldFilterOn.src} alt="filter" className={styles.filterIcon} />
        ) : (
          <img src={BoldFilter.src} alt="filter" className={styles.filterIcon} />
        )}
      </div>
      <FilterSelector
        filterData={filterItem}
        onSave={handleSave}
        open={filterDialogOn}
        onClose={() => setFilterDialogOn(false)}
      />
    </div>
  );
};

export default SearchBar;
