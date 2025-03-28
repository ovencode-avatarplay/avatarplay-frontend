import React, {useEffect, useState} from 'react';
import styles from './CreateSingleContent.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {BoldArrowDown, BoldQuestion, BoldStar, LineClose, LineDashboard} from '@ui/Icons';
import MediaUpload from './MediaUpload/MediaUpload';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import CustomDropDownSelectDrawer from '@/components/layout/shared/CustomDropDownSelectDrawer';
import DrawerTagSelect from '../common/DrawerTagSelect';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import DrawerPostCountry from '../common/DrawerPostCountry';
import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import VideoContentUpload from './MediaUpload/VideoContentUpload';
import {ToastMessageAtom, ToastType} from '@/app/Root';
import WebtoonContentUpload from './MediaUpload/WebtoonContentUpload';
import {
  ContentType,
  CreateContentReq,
  ContentEpisodeWebtoonInfo,
  sendCreateContent,
  ContentLanguageType,
  ContentEpisodeVideoInfo,
  sendGetContent,
  ContentInfo,
} from '@/app/NetWork/ContentNetwork';
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import useCustomRouter from '@/utils/useCustomRouter';
import getLocalizedText from '@/utils/getLocalizedText';
import {useAtom} from 'jotai';
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
interface CreateSingleContentProps {
  urlLinkKey?: string;
}

const CreateSingleContent: React.FC<CreateSingleContentProps> = ({urlLinkKey}) => {
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

  const [onSeta, setOnSeta] = useState<boolean>(false);
  const [isNsfw, setIsNsfw] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(false);
  const [priceValue, setPriceValue] = useState<number>(0);
  const [triggerWarning, setTriggerWarning] = useState<boolean>();

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10); // 정수 변환
    setPriceValue(isNaN(value) ? 0 : value); // 숫자가 아닐 경우 기본값 0 설정
  };

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

  const tagGroups = [
    {
      category: 'Genre',
      tags: [
        'common_genre_romance',
        'common_genre_fantasy',
        'common_genre_action',
        'common_genre_comedy',
        'common_genre_sliceoflife',
        'common_genre_thriller',
        'common_genre_comedy', // 중복 있음
        'common_genre_bl/gl',
        'common_genre_drama',
        'common_genre_historicaldrama',
        'common_genre_emotional',
        'common_genre_sports',
        'common_genre_wuxia',
      ],
    },
    {
      category: 'Theme',
      tags: [
        'common_tag_male',
        'common_tag_female',
        'common_tag_boyfriend',
        'common_tag_girlfriend',
        'common_tag_hero',
        'common_tag_elf',
        'common_tag_romance',
        'common_tag_vanilla',
        'common_tag_contemporaryfantasy',
        'common_tag_isekai',
        'common_tag_flirting',
        'common_tag_dislike',
        'common_tag_comedy',
        'common_tag_noir',
        'common_tag_horror',
        'common_tag_demon',
        'common_tag_sf',
        'common_tag_vampire',
        'common_tag_office',
        'common_tag_monster',
        'common_tag_anime',
        'common_tag_books',
        'common_tag_aliens',
      ],
    },
  ];
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

  const [isMonetization, setIsMonetization] = useState<boolean>(false);

  const [episodeVideoInfo, setEpisodeVideoInfo] = useState<ContentEpisodeVideoInfo>({
    likeCount: 0, // 기본 값: 0
    videoSourcePlayTime: '00:00', // 기본 값: 빈 시간 또는 "00:00"
    videoSourceFileInfo: {
      videoLanguageType: ContentLanguageType.Korean, // 기본 언어 설정
      videoSourceUrl: '', // 비디오 URL 초기값
      videoSourceName: '', // 비디오 이름 초기값
    },
    subTitleFileInfos: [], // 자막 파일 정보 (빈 배열)
    dubbingFileInfos: [], // 더빙 파일 정보 (빈 배열)
  });

  const [episodeWebtoonInfo, setEpisodeWebtoonInfo] = useState<ContentEpisodeWebtoonInfo>({
    likeCount: 0,
    webtoonSourceUrlList: [],
  });

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
          if (content.contentVideoInfo) setEpisodeVideoInfo(content.contentVideoInfo);
          if (content.contentWebtoonInfo) setEpisodeWebtoonInfo(content.contentWebtoonInfo);
          if (content.salesStarEa > 0) {
            setIsFree(true);
            setPriceValue(content.salesStarEa);
          }
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

    for (const {condition, message} of validations) {
      if (condition) {
        setTriggerWarning(true);
        dataToast.open(getLocalizedText('common_alert_093'), ToastType.Error);
        return;
      }
    }

    const payload: CreateContentReq = {
      contentInfo: {
        profileId: 0,
        id: editContentInfo?.id,
        contentType: ContentType.Single, // 시리즈로 고정
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
        contentWebtoonInfo: selectedCategory == CategoryTypes.Webtoon ? episodeWebtoonInfo : undefined,
        contentVideoInfo: selectedCategory == CategoryTypes.Drama ? episodeVideoInfo : undefined,
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
  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        <CustomArrowHeader
          title={urlLinkKey ? getLocalizedText('common_title_edit') : getLocalizedText('createcontent012_title_001')}
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
              {getLocalizedText('createcontent012_label_002')}{' '}
              <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder={getLocalizedText('createcontent012_label_003')}
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
              {getLocalizedText('createcontent012_label_004')}{' '}
              <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder={getLocalizedText('common_sample_047')}
          customClassName={[styles.textInput]}
          error={triggerWarning}
        />

        <span className={styles.label}>
          {getLocalizedText('createcontent012_label_004')}{' '}
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
            selectedItem={selectedGenres.length > 0 ? selectedGenres.map(v => getLocalizedText(v)).join(', ') : ''}
            onClick={() => {
              setGenreList(tagGroups[0].tags);
              setGenreOpen(true);
            }}
            error={triggerWarning}
          ></CustomDropDownSelectDrawer>
          <div className={styles.blackTagContainer}>
            {selectedGenres.map((value, index) => (
              <div key={index} className={styles.blackTag}>
                {getLocalizedText(value)}
                <img
                  src={LineClose.src}
                  className={styles.lineClose}
                  onClick={() => handleGenreRemove(value)} // 클릭하면 해당 태그 삭제
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.tagContainer}>
          <CustomDropDownSelectDrawer
            title={getLocalizedText('common_label_002')}
            selectedItem={selectedTags.length > 0 ? selectedTags.map(v => getLocalizedText(v)).join(', ') : ''}
            onClick={() => {
              setTagList(tagGroups[1].tags);
              setTagOpen(true);
            }}
            error={triggerWarning}
          ></CustomDropDownSelectDrawer>
          <div className={styles.blackTagContainer}>
            {selectedTags.map((tag, index) => (
              <div key={index} className={styles.blackTag}>
                {getLocalizedText(tag)}
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
            title={getLocalizedText('common_label_003')}
            selectedItem={
              positionCountryList.map(country => LanguageType[country]).length > 0
                ? positionCountryList.map(country => LanguageType[country]).join(', ')
                : ''
            }
            onClick={() => setIsPositionCountryOpen(true)}
            error={triggerWarning}
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
          title={getLocalizedText('common_label_001')}
          selectedItem={getVisibilityTypeKey(selectedVisibility)}
          onClick={() => setVisibilityDrawerOpen(true)}
          error={triggerWarning}
        ></CustomDropDownSelectDrawer>

        {selectedCategory === CategoryTypes.Drama && (
          <VideoContentUpload
            setEpisodeVideoInfo={setEpisodeVideoInfo}
            defaultEpisodeVideoInfo={editContentInfo?.contentVideoInfo} // 기존 데이터 전달
            hasError={triggerWarning}
          />
        )}

        {selectedCategory === CategoryTypes.Webtoon && (
          <WebtoonContentUpload
            setEpisodeWebtoonInfo={setEpisodeWebtoonInfo}
            defaultEpisodeWebtoonInfo={editContentInfo?.contentWebtoonInfo} // 기존 데이터 전달
            hasError={triggerWarning}
          />
        )}

        <div className={styles.moenetization}>
          <span className={styles.label}>{getLocalizedText('common_label_006')}</span>
          <button className={styles.questionButton}>
            <img src={BoldQuestion.src} className={styles.questionimg}></img>
          </button>
        </div>
        <div className={styles.radioButtonGroup}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="On"
            label={getLocalizedText('common_button_on')}
            onSelect={() => setIsMonetization(true)}
            selectedValue={isMonetization ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label={getLocalizedText('common_button_off')}
            onSelect={() => setIsMonetization(false)}
            selectedValue={isMonetization ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
        </div>
        <div className={styles.salesStar}>
          <span className={styles.label} style={{lineHeight: '24px'}}>
            {getLocalizedText('createcontent007_label_008')}
          </span>
          <div className={styles.salesStarSetting} onClick={() => setOnSeta(true)}>
            {' '}
            {getLocalizedText('common_button_setting')}
          </div>
        </div>
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

        <button className={styles.confirmButton} onClick={handleConfirm}>
          {getLocalizedText('common_button_submit')}
        </button>
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
        selectedIndex={selectedVisibility}
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
      <SelectDrawer
        isOpen={onSeta}
        onClose={() => setOnSeta(false)}
        items={[]}
        selectedIndex={0}
        tooltip=""
        name={getLocalizedText('common_alert_034')}
      >
        {' '}
        <div className={styles.setaTitleGroup}>
          <div style={{gap: '5px', display: 'flex', flexDirection: 'column', marginTop: '22px'}}>
            <span className={styles.setaName}> {nameValue != '' ? nameValue : 'No name'} </span>
          </div>
          <CustomRadioButton
            shapeType="square"
            displayType="buttonText"
            value={0}
            label={getLocalizedText('createcontent007_label_009')}
            onSelect={() => setIsFree(!isFree)}
            selectedValue={isFree == false ? 0 : 1}
            containterStyle={{gap: '0'}}
          ></CustomRadioButton>
          <div style={{gap: '10px', display: 'flex', flexDirection: 'column', width: '100%'}}>
            {isFree != false && (
              <div className={styles.inputBox}>
                <img src={BoldStar.src} className={styles.starstar}></img>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Enter Price..."
                  value={priceValue}
                  onChange={handlePriceChange}
                />
                <span className={styles.starlabel}>{getLocalizedText('createcontent007_label_010')}</span>
              </div>
            )}
            <button
              className={styles.setaConfirm}
              onClick={() => {
                setOnSeta(false);
              }}
            >
              {getLocalizedText('common_button_confirm')}
            </button>
          </div>
        </div>
      </SelectDrawer>
    </div>
  );
};

export default CreateSingleContent;
