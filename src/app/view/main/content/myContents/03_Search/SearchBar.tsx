import React, {useEffect, useState} from 'react';
import styles from './SearchBar.module.css';
import {BoldFilter, BoldFilterOn, LineArrowLeft, LineDelete, LinePlus} from '@ui/Icons';
import FilterSelector, {FilterDataItem} from '@/components/search/FilterSelector';
import getLocalizedText from '@/utils/getLocalizedText';
import {searchOptionList} from '../../searchboard/SearchBoard';
import TagsData from 'data/create/tags.json';
import useCustomRouter from '@/utils/useCustomRouter';
import CustomToggleButton from '@/components/layout/shared/CustomToggleButton';

interface Props {
  onBack?: () => void;
  onFilterClick?: () => void;
  onSearchTextChange?: (text: string) => void;
  onFocusChange?: (isFocused: boolean) => void;
  onSearch?: (
    searchText: string,
    isAdult: boolean,
    positiveFilters: FilterDataItem[],
    negativeFilters: FilterDataItem[],
  ) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<Props> = ({
  onBack,
  onFilterClick,
  onSearchTextChange,
  onFocusChange,
  onSearch,
  onKeyDown,
  value,
  onChange,
}) => {
  const [isAdult, setIsAdult] = useState(true);
  const [filterDialogOn, setFilterDialogOn] = useState(false);
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
    if (onSearch) {
      onSearch(value.trim(), isAdult, filters.positive, filters.negative);
    }
  };

  const handleClear = () => {
    onChange('');
    onSearchTextChange?.('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    onSearchTextChange?.(e.target.value); // 부모에게 전달
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSearch?.(value.trim(), isAdult, positiveFilters, negativeFilters);
    }
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
            value={value}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onKeyDown={onKeyDown}
            onFocus={() => onFocusChange?.(true)}
            onBlur={() => onFocusChange?.(false)}
          />

          {/* X 버튼 */}
          <div className={styles.buttonBox}>
            {value && (
              <button className={styles.clearButton} onClick={handleClear}>
                <img src={LinePlus.src} alt="clear" className={styles.clearIcon} />
              </button>
            )}
            <div className={styles.adultToggle}>
              <CustomToggleButton
                isToggled={isAdult}
                onToggle={() => {
                  setIsAdult(prev => {
                    const next = !prev;
                    if (onSearch) {
                      onSearch(value.trim(), next, positiveFilters, negativeFilters);
                    }
                    return next;
                  });
                }}
                size="sm"
                state="default"
                theme="dark"
              />
              <span className={`${styles.adultLabel} ${isAdult ? styles.toggleOn : ''}`}>Adult</span>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 아이콘 */}
      <div
        className={styles.filterIconWrap}
        onClick={() => {
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
