import React, {useEffect, useState} from 'react';
import styles from './CreateSeriesContent.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {BoldArrowDown, LineClose, LineDashboard} from '@ui/Icons';
import MediaUpload from './MediaUpload/MediaUpload';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import CustomDropDownSelectDrawer from '@/components/layout/shared/CustomDropDownSelectDrawer';
import DrawerTagSelect from '../common/DrawerTagSelect';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import DrawerPostCountry from '../common/DrawerPostCountry';
import {LanguageType} from '@/app/NetWork/AuthNetwork';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {
  ContentInfo,
  ContentType,
  CreateContentReq,
  GetContentReq,
  sendCreateContent,
  sendGetContent,
} from '@/app/NetWork/ContentNetwork';
import {RootState} from '@/redux-store/ReduxStore';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
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
  urlLinkKey?: string;
}

const CreateSeriesContent: React.FC<CreateSeriesContentProps> = ({urlLinkKey}) => {
  const router = useRouter();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [tagOpen, setTagOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [genreList, setGenreList] = useState<string[]>([]);
  const maxTagCount = 5;
  const [selectedTagAlertOn, setSelectedTagAlertOn] = useState(false);
  const [selectedGenreAlertOn, setSelectedGenreAlertOn] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
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
  const handlePositionCountryRemove = (country: LanguageType) => {
    setPositionCountryList(positionCountryList.filter(c => c !== country));
  };
  const [isAll, setIsAll] = useState<boolean>(false);

  const [positionCountryList, setPositionCountryList] = useState<LanguageType[]>([]);
  const normalizedPostCountryList: LanguageType[] = positionCountryList ?? [];

  const [editContentInfo, setEditContentInfo] = useState<ContentInfo>();

  const [defaultImage, setDefaultImage] = useState<string>();

  useEffect(() => {
    if (urlLinkKey === undefined) return;

    const fetchData = async () => {
      try {
        const response = await sendGetContent({urlLinkKey});

        if (response.data) {
          console.log('콘텐츠 정보:', response.data.contentInfo);
          const content = response.data.contentInfo;
          setEditContentInfo(content);

          // 기존 데이터로 초기화
          setNameValue(content.name || '');
          setSummaryValue(content.oneLineSummary || '');
          setrDescription(content.description || '');
          setMediaUrls([content.thumbnailUrl || '']);
          setSelectedCategory(content.categoryType);
          setSelectedGenres(content.genre ? content.genre.split(', ') : []);
          setSelectedTags(content.tags || []);
          setPositionCountryList(
            content.postCountry
              ? content.postCountry.map(country => LanguageType[country as keyof typeof LanguageType]).filter(Boolean) // 유효한 값만 필터링
              : [],
          );

          setSelectedVisibility(content.visibility);
          setIsNsfw(content.nsfw);
          setDefaultImage(content.thumbnailUrl);
        }
      } catch (error) {
        console.error('콘텐츠 조회 실패:', error);
      }
    };

    fetchData();
  }, [urlLinkKey]);

  const handleConfirm = async () => {
    if (!nameValue.trim()) {
      alert('Name을 입력해주세요.');
      return;
    }
    if (!summaryValue.trim()) {
      alert('One Line Summary를 입력해주세요.');
      return;
    }
    if (!descValue.trim()) {
      alert('Description을 입력해주세요.');
      return;
    }
    if (!mediaUrls[0]) {
      alert('Thumbnail을 업로드해주세요.');
      return;
    }
    if (selectedGenres.length === 0) {
      alert('최소 하나의 Genre를 선택해주세요.');
      return;
    }
    if (selectedTags.length === 0) {
      alert('최소 하나의 Tag를 선택해주세요.');
      return;
    }
    if (positionCountryList.length === 0) {
      alert('Post Country를 선택해주세요.');
      return;
    }
    const payload: CreateContentReq = {
      contentInfo: {
        id: editContentInfo?.id,
        profileId: 0,
        contentType: ContentType.Series, // 시리즈로 고정
        name: nameValue || 'Untitled Series',
        oneLineSummary: summaryValue || '',
        description: descValue || '',
        thumbnailUrl: mediaUrls[0], // 썸네일 업로드 구현 필요
        categoryType: selectedCategory,
        genre: selectedGenres.length > 0 ? selectedGenres.join(', ') : '',
        tags: selectedTags,
        postCountry: positionCountryList.map(country => LanguageType[country]), // 국가 정보
        visibility: selectedVisibility,
        nsfw: isNsfw, // 기본값
        monetization: false,
        salesStarEa: 0, //추후 구현 필요
        maxSeasonNo: 1, // 기본 시즌 1개부터 시작
        urlLinkKey: '',
      },
    };

    try {
      const response = await sendCreateContent(payload);
      if (response.data) {
        console.log('콘텐츠 생성 성공:', response.data.contentId);
        pushLocalizedRoute(`/create/content`, router);
      }
    } catch (error) {
      console.error('콘텐츠 생성 실패:', error);
    }
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

  const [isNsfw, setIsNsfw] = useState<boolean>(false);

  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        <CustomArrowHeader
          title="Create Series Contents"
          onClose={() => {
            pushLocalizedRoute(`/create/content/condition/series`, router);
          }}
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
        <MediaUpload
          setContentMediaUrls={setMediaUrls}
          defaultImage={defaultImage ? defaultImage : undefined}
        ></MediaUpload>
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
          Description <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
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

        <div className={styles.tagContainer}>
          <CustomDropDownSelectDrawer
            title="Genre"
            selectedItem={selectedGenres.length > 0 ? selectedGenres.join(', ') : ''}
            onClick={() => {
              setGenreList(tagGroups[0].tags);
              setGenreOpen(true);
            }}
          ></CustomDropDownSelectDrawer>
          <div className={styles.blackTagContainer}>
            {selectedGenres.map((tag, index) => (
              <div key={index} className={styles.blackTag}>
                {tag}
                <img
                  src={LineClose.src}
                  className={styles.lineClose}
                  onClick={() => handleGenreRemove(tag)} // 클릭하면 해당 태그 삭제
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tagContainer}>
          <CustomDropDownSelectDrawer
            title="Tag"
            selectedItem={selectedTags.length > 0 ? selectedTags.join(', ') : ''}
            onClick={() => {
              setTagList(tagGroups[1].tags);
              setTagOpen(true);
            }}
          ></CustomDropDownSelectDrawer>
          <div className={styles.blackTagContainer}>
            {selectedTags.map((tag, index) => (
              <div key={index} className={styles.blackTag}>
                {tag}
                <img
                  src={LineClose.src}
                  className={styles.lineClose}
                  onClick={() => handleTagRemove(tag)} // 클릭하면 해당 태그 삭제
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tagContainer}>
          <CustomDropDownSelectDrawer
            title="Post Country"
            selectedItem={
              positionCountryList.map(country => LanguageType[country]).length > 0
                ? positionCountryList.map(country => LanguageType[country]).join(', ')
                : 'Select'
            }
            onClick={() => setIsPositionCountryOpen(true)}
          ></CustomDropDownSelectDrawer>
          <div className={styles.blackTagContainer}>
            {positionCountryList.map((tag, index) => (
              <div key={index} className={styles.blackTag}>
                {LanguageType[tag]}
                <img
                  src={LineClose.src}
                  className={styles.lineClose}
                  onClick={() => handlePositionCountryRemove(tag)} // 클릭하면 해당 태그 삭제
                />
              </div>
            ))}
          </div>
        </div>
        <CustomDropDownSelectDrawer
          title="Visibility"
          selectedItem={VisibilityType[selectedVisibility]}
          onClick={() => setVisibilityDrawerOpen(true)}
        ></CustomDropDownSelectDrawer>
        <span className={styles.label}>
          NSFW <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
        </span>

        <div className={styles.radioButtonGroup}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="On"
            label="On"
            onSelect={() => setIsNsfw(true)}
            selectedValue={isNsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label="Off"
            onSelect={() => setIsNsfw(false)}
            selectedValue={isNsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
        </div>

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
        maxTagCount={1}
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
