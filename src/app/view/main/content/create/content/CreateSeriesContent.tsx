import React, {useState} from 'react';
import styles from './CreateSeriesContent.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {BoldArrowDown, LineDashboard} from '@ui/Icons';
import MediaUpload from './MediaUpload/MediaUpload';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import CustomDropDownSelectDrawer from '@/components/layout/shared/CustomDropDownSelectDrawer';
import DrawerTagSelect from '../common/DrawerTagSelect';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import DrawerPostCountry from '../common/DrawerPostCountry';
import {LanguageType} from '@/app/NetWork/AuthNetwork';
enum CategoryTypes {
  Webtoon = 0,
  Drama = 1,
}

enum VisibilityType {
  Private = 0,
  Unlisted = 1,
  Public = 2,
}

interface CreateSeriesContentProps {
  onNext: () => void;
  onPrev: () => void;
}

const CreateSeriesContent: React.FC<CreateSeriesContentProps> = ({onNext, onPrev}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [tagOpen, setTagOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [genreList, setGenreList] = useState<string[]>([]);
  const maxTagCount = 5;
  const [selectedTagAlertOn, setSelectedTagAlertOn] = useState(false);
  const [selectedGenreAlertOn, setSelectedGenreAlertOn] = useState(false);
  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      handleTagRemove(tag);
    } else {
      if (selectedTags.length >= maxTagCount) {
        setSelectedTagAlertOn(true);
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleGenreRemove = (tag: string) => {
    setSelectedGenres(selectedGenres.filter(t => t !== tag));
  };

  const handleGenreSelect = (tag: string) => {
    if (selectedGenres.includes(tag)) {
      handleGenreRemove(tag);
    } else {
      if (selectedGenres.length >= maxTagCount) {
        setSelectedGenreAlertOn(true);
        return;
      }
      setSelectedGenres([...selectedGenres, tag]);
    }
  };
  const tagGroups = [
    {
      category: 'Genre',
      tags: [
        'Romance',
        'Fantasy',
        'Action',
        'Daily Life',
        'Thriller',
        'Comedy',
        'Martial Arts',
        'Drama',
        'Historical Drama',
        'Emotion',
        'Sports',
      ],
    },
    {
      category: 'Theme',
      tags: [
        'Male',
        'Female',
        'Boyfriend',
        'Girlfriend',
        'Hero',
        'Elf',
        'Romance',
        'Vanilla',
        'Contemporary Fantasy',
        'Isekai',
        'Flirting',
        'Dislike',
        'Comedy',
        'Noir',
        'Horror',
        'Demon',
        'SF',
        'Vampire',
        'Office',
        'Monster',
        'Anime',
        'Books',
        'Aliens',
      ],
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<CategoryTypes>(CategoryTypes.Webtoon);
  const [CategoryDrawerOpen, setCategoryDrawerOpen] = useState<boolean>(false);

  const publishItemsCategory: SelectDrawerItem[] = [
    {name: 'Webtoon', onClick: () => setSelectedCategory(CategoryTypes.Webtoon)},
    {name: 'Drama', onClick: () => setSelectedCategory(CategoryTypes.Drama)},
  ];

  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityType>(VisibilityType.Private);
  const [visibilityDrawerOpen, setVisibilityDrawerOpen] = useState<boolean>(false);

  const publishItemsVisibility: SelectDrawerItem[] = [
    {name: 'Private', onClick: () => setSelectedVisibility(VisibilityType.Private)},
    {name: 'Unlisted', onClick: () => setSelectedVisibility(VisibilityType.Unlisted)},
    {name: 'Public', onClick: () => setSelectedVisibility(VisibilityType.Public)},
  ];

  const [isPositionCountryOpen, setIsPositionCountryOpen] = useState(false);
  const handlePositionCountryChange = (value: number[]) => {
    setPositionCountryList(value);
  };
  const [isAll, setIsAll] = useState<boolean>(false);

  const [positionCountryList, setPositionCountryList] = useState<LanguageType[]>([]);
  const normalizedPostCountryList: LanguageType[] = positionCountryList ?? [];

  const handleConfirm = () => {
    onNext();
  };

  const [nameValue, setNameValue] = useState<string>('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setNameValue(e.target.value);
    }
  };

  const [summaryValue, setSummaryValue] = useState<string>('');
  const handleSummaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 50) {
      setSummaryValue(e.target.value);
    }
  };

  const [descValue, setrDescription] = useState<string>('');

  const renderDropDown = (
    title: string,
    selectedItem: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    return (
      <div className={styles.dropDownArea}>
        <h2 className={styles.title2}>{title}</h2>
        <div className={styles.selectItem}>
          <div className={styles.selectItemText}>{selectedItem}</div>
          <button
            className={styles.selectItemButton}
            onClick={() => setIsOpen(prev => !prev)} // 상태 토글
          >
            <img className={styles.selectItemIcon} src={BoldArrowDown.src} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        <CustomArrowHeader
          title="Create Series Contents"
          onClose={onPrev}
          children={
            <div className={styles.rightArea}>
              <button className={styles.dashBoard} onClick={() => {}}>
                <img className={styles.dashBoardIcon} src={LineDashboard.src} />
              </button>
            </div>
          }
        />
      </div>
      <div className={styles.container}>
        <MediaUpload></MediaUpload>
        <CustomInput
          inputType="Basic"
          textType="Label"
          value={nameValue}
          onChange={handleNameChange}
          label={
            <span>
              Name <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder="Enter a title for your post"
          customClassName={[styles.textInput]}
        />
        <CustomInput
          inputType="Basic"
          textType="Label"
          value={summaryValue}
          onChange={handleSummaryChange}
          label={
            <span>
              One Line Summary <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder="Enter one line summary"
          customClassName={[styles.textInput]}
        />

        <span className={styles.label}>
          One Line Summary <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
        </span>
        <MaxTextInput
          displayDataType={displayType.Hint}
          labelText="Introduction"
          promptValue={descValue}
          handlePromptChange={e => setrDescription(e.target.value)}
          maxPromptLength={500}
          style={{minHeight: '190px', width: '100%'}}
        />
        <CustomDropDownSelectDrawer
          title="Category"
          selectedItem={CategoryTypes[selectedCategory]}
          onClick={() => setCategoryDrawerOpen(true)}
        ></CustomDropDownSelectDrawer>
        <CustomDropDownSelectDrawer
          title="Genre"
          selectedItem={selectedGenres.length > 0 ? selectedGenres.join(', ') : 'Select'}
          onClick={() => {
            setGenreList(tagGroups[0].tags);
            setGenreOpen(true);
          }}
        ></CustomDropDownSelectDrawer>
        <CustomDropDownSelectDrawer
          title="Tag"
          selectedItem={selectedTags.length > 0 ? selectedTags.join(', ') : 'Select'}
          onClick={() => {
            setTagList(tagGroups[1].tags);
            setTagOpen(true);
          }}
        ></CustomDropDownSelectDrawer>
        <CustomDropDownSelectDrawer
          title="Post Country"
          selectedItem={
            positionCountryList.map(country => LanguageType[country]).length > 0
              ? positionCountryList.map(country => LanguageType[country]).join(', ')
              : 'Select'
          }
          onClick={() => setIsPositionCountryOpen(true)}
        ></CustomDropDownSelectDrawer>
        <CustomDropDownSelectDrawer
          title="Visibility"
          selectedItem={VisibilityType[selectedVisibility]}
          onClick={() => setVisibilityDrawerOpen(true)}
        ></CustomDropDownSelectDrawer>

        <button className={styles.confirmButton} onClick={handleConfirm}>
          Confirm
        </button>
      </div>
      <DrawerTagSelect
        isOpen={tagOpen}
        onClose={() => setTagOpen(false)}
        tagList={tagList}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onRefreshTags={() => setSelectedTags([])}
        maxTagCount={maxTagCount}
        selectedTagAlertOn={selectedTagAlertOn}
        setSelectedTagAlertOn={setSelectedTagAlertOn}
      />
      <DrawerTagSelect
        isOpen={genreOpen}
        onClose={() => setGenreOpen(false)}
        tagList={genreList}
        selectedTags={selectedGenres}
        onTagSelect={handleGenreSelect}
        onRefreshTags={() => setSelectedGenres([])}
        maxTagCount={maxTagCount}
        selectedTagAlertOn={selectedGenreAlertOn}
        setSelectedTagAlertOn={setSelectedGenreAlertOn}
      />
      <SelectDrawer
        name="Filter"
        items={publishItemsCategory}
        isOpen={CategoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
        selectedIndex={selectedCategory}
      />
      <SelectDrawer
        name="Filter"
        items={publishItemsVisibility}
        isOpen={visibilityDrawerOpen}
        onClose={() => setVisibilityDrawerOpen(false)}
        selectedIndex={selectedCategory}
      />
      <DrawerPostCountry
        isOpen={isPositionCountryOpen}
        onClose={() => setIsPositionCountryOpen(false)}
        selectableCountryList={Object.values(LanguageType).filter(value => typeof value === 'number') as LanguageType[]}
        postCountryList={normalizedPostCountryList}
        onUpdatePostCountry={handlePositionCountryChange}
        isAll={isAll}
        setIsAll={setIsAll}
      />
    </div>
  );
};

export default CreateSeriesContent;
