import React, {useEffect, useState} from 'react';
import styles from './CreateSeriesContent.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {LineArrowDown, LineClose, LineDashboard} from '@ui/Icons';
import MediaUpload from './MediaUpload/MediaUpload';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import CustomDropDownSelectDrawer from '@/components/layout/shared/CustomDropDownSelectDrawer';
import DrawerTagSelect from '../common/DrawerTagSelect';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import DrawerPostCountry from '../common/DrawerPostCountry';
import {getLangKey, LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
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
import getLocalizedText from '@/utils/getLocalizedText';
import useCustomRouter from '@/utils/useCustomRouter';
import {ToastMessageAtom, ToastType} from '@/app/Root';
import {useAtom} from 'jotai';
import CustomButton from '@/components/layout/shared/CustomButton';
import TagsData from 'data/create/tags.json';
import CustomChipSelector from '@/components/layout/shared/CustomChipSelector';

enum CategoryTypes {
  Webtoon = 0,
  Drama = 1,
}
export const getCategoryTypesKey = (key: number): string => {
  switch (key) {
    case CategoryTypes.Webtoon:
      return getLocalizedText('common_filter_webtoon');
    case CategoryTypes.Drama:
      return getLocalizedText('common_filter_video');
    default:
      return '';
  }
};
enum VisibilityType {
  Private = 0,
  Unlisted = 1,
  Public = 2,
}
export const getVisibilityTypeKey = (key: number): string => {
  switch (key) {
    case VisibilityType.Public:
      return getLocalizedText('common_filter_public');
    case VisibilityType.Private:
      return getLocalizedText('common_filter_private');
    case VisibilityType.Unlisted:
      return getLocalizedText('common_filter_unlisted');
    default:
      return '';
  }
};
interface CreateSeriesContentProps {
  urlLinkKey?: string;
}

const CreateSeriesContent: React.FC<CreateSeriesContentProps> = ({urlLinkKey}) => {
  const router = useRouter();
  const {back} = useCustomRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [tagOpen, setTagOpen] = useState(false);
  const [genreOpen, setGenreOpen] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const [genreList, setGenreList] = useState<string[]>([]);
  const maxTagCount = 5;
  const maxGenreCount = 1;
  const [selectedTagAlertOn, setSelectedTagAlertOn] = useState(false);
  const [selectedGenreAlertOn, setSelectedGenreAlertOn] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [triggerWarning, setTriggerWarning] = useState<boolean>();
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
      if (selectedGenres.length >= maxGenreCount) {
        setSelectedGenreAlertOn(true);
        return;
      }
      setSelectedGenres([...selectedGenres, tag]);
    }
  };
  const tagGroups = TagsData;

  const themeGroup = tagGroups.tagGroups.find(group => group.category === 'Theme');
  const genreGroup = tagGroups.tagGroups.find(group => group.category === 'Genre');

  const [selectedCategory, setSelectedCategory] = useState<CategoryTypes>(CategoryTypes.Webtoon);
  const [CategoryDrawerOpen, setCategoryDrawerOpen] = useState<boolean>(false);

  const publishItemsCategory: SelectDrawerItem[] = [
    {name: getLocalizedText('common_filter_webtoon'), onClick: () => setSelectedCategory(CategoryTypes.Webtoon)},
    {name: getLocalizedText('common_filter_video'), onClick: () => setSelectedCategory(CategoryTypes.Drama)},
  ];

  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityType>(VisibilityType.Private);
  const [visibilityDrawerOpen, setVisibilityDrawerOpen] = useState<boolean>(false);

  const publishItemsVisibility: SelectDrawerItem[] = [
    {name: getLocalizedText('common_filter_private'), onClick: () => setSelectedVisibility(VisibilityType.Private)},
    {name: getLocalizedText('common_filter_unlisted'), onClick: () => setSelectedVisibility(VisibilityType.Unlisted)},
    {name: getLocalizedText('common_filter_public'), onClick: () => setSelectedVisibility(VisibilityType.Public)},
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

  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const handleConfirm = async () => {
    const validations = [
      {condition: !nameValue.trim(), message: 'Name을 입력해주세요.'},
      {condition: !summaryValue.trim(), message: 'One Line Summary를 입력해주세요.'},
      {condition: !descValue.trim(), message: 'Description을 입력해주세요.'},
      {condition: !mediaUrls[0], message: 'Thumbnail을 업로드해주세요.'},
      {condition: selectedGenres.length === 0, message: '최소 하나의 Genre를 선택해주세요.'},
      {condition: selectedTags.length === 0, message: '최소 하나의 Tag를 선택해주세요.'},
      {condition: positionCountryList.length === 0, message: 'Post Country를 선택해주세요.'},
    ];

    for (const v of validations) {
      if (v.condition) {
        setTriggerWarning(true);
        dataToast.open(getLocalizedText('common_alert_093'), ToastType.Error);
        return;
      }
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
        genre: selectedGenres.length > 0 ? selectedGenres.join(',') : '',
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
        pushLocalizedRoute(`/create/content/series/${response.data.urlLinkKey}`, router);
      }
    } catch (error) {
      console.error('콘텐츠 생성 실패:', error);
    }
  };

  const [nameValue, setNameValue] = useState<string>('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 100) {
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
          title={urlLinkKey ? getLocalizedText('common_title_edit') : getLocalizedText('createcontent001_title_001')}
          onClose={() => {
            back();
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
          triggerWarning={triggerWarning}
        ></MediaUpload>
        <CustomInput
          inputType="Basic"
          textType="Label"
          value={nameValue}
          onChange={handleNameChange}
          label={
            <span>
              {getLocalizedText('createcontent003_label_001')}{' '}
              <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder={getLocalizedText('common_sample_087')}
          customClassName={[styles.textInput]}
          error={triggerWarning}
        />
        <CustomInput
          inputType="Basic"
          textType="Label"
          value={summaryValue}
          onChange={handleSummaryChange}
          label={
            <span>
              {getLocalizedText('createcontent003_label_002')}{' '}
              <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder={getLocalizedText('common_sample_089')}
          customClassName={[styles.textInput]}
          error={triggerWarning}
        />

        <span className={styles.label}>
          {getLocalizedText('createcontent003_label_003')}{' '}
          <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
        </span>
        <MaxTextInput
          displayDataType={displayType.Hint}
          labelText="Introduction"
          promptValue={descValue}
          handlePromptChange={e => setrDescription(e.target.value)}
          maxPromptLength={500}
          style={{minHeight: '190px', width: '100%'}}
          placeholder={getLocalizedText('common_sample_047')}
          isError={triggerWarning}
        />
        <CustomDropDownSelectDrawer
          title={getLocalizedText('createcontent003_label_004')}
          selectedItem={getCategoryTypesKey(selectedCategory)}
          onClick={() => setCategoryDrawerOpen(true)}
        ></CustomDropDownSelectDrawer>

        <div className={styles.tagContainer}>
          <CustomDropDownSelectDrawer
            title={getLocalizedText('createcontent003_label_005')}
            selectedItem={selectedGenres.length > 0 ? selectedGenres.map(v => getLocalizedText(v)).join(',') : ''}
            onClick={() => {
              setGenreList(genreGroup?.tags || []);
              setGenreOpen(true);
            }}
            error={triggerWarning}
          ></CustomDropDownSelectDrawer>
          <div className={styles.blackTagContainer}>
            {selectedGenres.map((tag, index) => (
              <div key={index} className={styles.blackTag}>
                {getLocalizedText(tag)}
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
          <CustomChipSelector
            label={getLocalizedText('common_label_002')}
            onClick={() => {
              setTagList(themeGroup?.tags || []);
              setTagOpen(true);
            }}
            tagType="tags"
            tags={selectedTags}
            handleTagSelect={handleTagSelect}
          />
          <DrawerTagSelect
            title={getLocalizedText('common_label_002')}
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
        </div>

        <div className={styles.tagContainer}>
          <CustomChipSelector
            label={
              <div className={styles.title2}>
                {getLocalizedText('common_label_003')}
                <div className={styles.titleAstrisk}>*</div>
              </div>
            }
            onClick={() => {
              setIsPositionCountryOpen(true);
            }}
            tagType="node"
            reactNode={
              <div className={styles.blackTagContainer}>
                {positionCountryList.length ===
                Object.values(LanguageType).filter(value => typeof value === 'number').length ? (
                  <div className={styles.blackTag}>
                    {getLocalizedText('shared017_label_002')}
                    <img
                      src={LineClose.src}
                      className={styles.lineClose}
                      onClick={() => {
                        setIsAll(false);
                        setPositionCountryList([]);
                      }}
                    />
                  </div>
                ) : (
                  positionCountryList.map((tag, index) => (
                    <div key={index} className={styles.blackTag}>
                      {getLocalizedText(getLangKey(tag))}
                      <img
                        src={LineClose.src}
                        className={styles.lineClose}
                        onClick={() => handlePositionCountryRemove(tag)}
                      />
                    </div>
                  ))
                )}
              </div>
            }
          />
        </div>

        <CustomDropDownSelectDrawer
          title={getLocalizedText('common_label_001')}
          selectedItem={getVisibilityTypeKey(selectedVisibility)}
          onClick={() => setVisibilityDrawerOpen(true)}
        ></CustomDropDownSelectDrawer>
        <span className={styles.label}>
          {getLocalizedText('common_label_008')} <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
        </span>

        <div className={styles.radioButtonGroup}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="On"
            label={getLocalizedText('common_button_on')}
            onSelect={() => setIsNsfw(true)}
            selectedValue={isNsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label={getLocalizedText('common_button_off')}
            onSelect={() => setIsNsfw(false)}
            selectedValue={isNsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
        </div>

        <div className={styles.confirmButtonBackground}></div>
        <div className={styles.confirmButtonContainer}>
          <CustomButton
            customClassName={[styles.confirmButton]}
            size="Medium"
            state="Normal"
            type="Primary"
            onClick={handleConfirm}
          >
            {getLocalizedText('common_button_submit')}
          </CustomButton>
        </div>
      </div>
      <DrawerTagSelect
        title={getLocalizedText('common_label_002')}
        isOpen={tagOpen}
        onClose={() => setTagOpen(false)}
        tagList={tagList}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onRefreshTags={() => setSelectedTags([])}
        maxTagCount={maxTagCount}
        selectedTagAlertOn={selectedTagAlertOn}
        setSelectedTagAlertOn={setSelectedTagAlertOn}
        descValue={getLocalizedText('common_label_002')}
      />
      <DrawerTagSelect
        title={getLocalizedText('createcontent003_label_005')}
        isOpen={genreOpen}
        onClose={() => setGenreOpen(false)}
        tagList={genreList}
        selectedTags={selectedGenres}
        onTagSelect={handleGenreSelect}
        onRefreshTags={() => setSelectedGenres([])}
        maxTagCount={maxGenreCount}
        selectedTagAlertOn={selectedGenreAlertOn}
        setSelectedTagAlertOn={setSelectedGenreAlertOn}
        descValue={getLocalizedText('createcontent003_label_005')}
      />
      <SelectDrawer
        name={getLocalizedText('createcontent001_label_007')}
        items={publishItemsCategory}
        isOpen={CategoryDrawerOpen}
        onClose={() => setCategoryDrawerOpen(false)}
        selectedIndex={selectedCategory}
      />
      <SelectDrawer
        name={getLocalizedText('createcontent001_label_007')}
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
