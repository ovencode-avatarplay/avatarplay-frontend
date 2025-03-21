import React, {useEffect, useRef, useState} from 'react';
import styles from './CreateCharacterSequence.module.css';

// redux
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';

// Json Data
import characterOptionsMaleReal from '@/data/create/create-character-male-real.json';
import characterOptionsFemaleReal from '@/data/create/create-character-female-real.json';
import characterOptionsMaleAnime from '@/data/create/create-character-male-anime.json';
import characterOptionsFemaleAnime from '@/data/create/create-character-female-anime.json';
import backgroundData from '@/data/create/background.json';

// Network
import {GenerateImageReq, GenerateImageRes, GenerateParameter, sendGenerateImageReq} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';

// Swiper
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

// Components
import CharacterCreateImageButton from './CreateCharacterImageButton';
import FullScreenImage, {FullViewImageData} from '@/components/layout/shared/FullViewImage';
import PublishCharacterBottom from './PublishCharacterBottom';
import CustomStepper from '@/components/layout/shared/CustomStepper';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldRuby, LineArrowLeft, LineArrowRight, LineCharacter, LineUpload} from '@ui/Icons';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import getLocalizedText from '@/utils/getLocalizedText';

export type CreateType = 'create' | 'modify' | 'create2';

interface Props {
  closeAction: () => void;
  characterInfo?: CharacterInfo;
  publishFinishAction?: () => void;
  createType?: CreateType;
  createFinishAction?: (imgUrl: string) => void;
}

const Header = 'CreateCharacter';
const Common = 'Common';

// Main Component
const CharacterCreateSequence: React.FC<Props> = ({
  closeAction,
  characterInfo,
  publishFinishAction,
  createType = 'create',
  createFinishAction,
}) => {
  //#region Types & Default Options
  interface CreateCharacterOption {
    label: string;
    image: string;
    value?: number;
    prompts?: string[];
  }

  const defaultOptions: Record<string, CreateCharacterOption[]> = {
    styleOptions: [],
    genderOptions: [],
    raceOptions: [],
    ageOptions: [],
    eyeColorOptions: [],
    hairStyles: [],
    hairColors: [],
    bodyTypes: [],
    clothing: [],
    clothingColor: [],
    personality: [],
    background: [],
  };

  enum CreateCharacterStep {
    Gender = 'Gender',
    Style = 'Style',
    Race = 'Race',
    HairStyle = 'HairStyle',
    BodyShape = 'BodyShape',
    OutfitClothes = 'OutfitClothes',
    ThumbnailBackground = 'ThumbnailBackground',
    Personality = 'Personality',
    Summary = 'Summary',
    Result = 'Result',
    Publish = 'Publish',
  }

  const ModifySteps: CreateCharacterStep[] = [
    CreateCharacterStep.HairStyle,
    CreateCharacterStep.OutfitClothes,
    CreateCharacterStep.ThumbnailBackground,
    CreateCharacterStep.Summary,
    CreateCharacterStep.Result,
    CreateCharacterStep.Publish,
  ];
  const Create2Steps: CreateCharacterStep[] = [
    CreateCharacterStep.Gender,
    CreateCharacterStep.Style,
    CreateCharacterStep.Race,
    CreateCharacterStep.HairStyle,
    CreateCharacterStep.BodyShape,
    CreateCharacterStep.OutfitClothes,
    CreateCharacterStep.ThumbnailBackground,
    CreateCharacterStep.Summary,
    CreateCharacterStep.Result,
    CreateCharacterStep.Publish,
  ];

  const maxLength = 200;
  const imageLoc = '/create_character/';
  //#endregion

  //#region States
  const [loading, setLoading] = useState(false);
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [publishClick, setPublishClick] = useState(false);
  const [publishRequested, setPublishRequested] = useState(false);
  const [characterOptions, setCharacterOptions] = useState(defaultOptions);
  const [generatedOptions, setGeneratedOptions] = useState<GenerateImageRes | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<FullViewImageData | null>(null);

  const [maxStep] = useState<number>(11);
  const showCreateStep = 8;
  const showCreate2Step = 7;
  const showModifyStep = 3;
  const [showStep, setShowStep] = useState<number>(showCreateStep);
  const [curStep, setCurStep] = useState<number>(0);

  const createStepTexts: string[] = [
    getLocalizedText(Header, 'createcharacter003_desc_002'),
    getLocalizedText(Header, 'createcharacter004_desc_001'),
    getLocalizedText(Header, 'createcharacter005_desc_001'),
    getLocalizedText(Header, 'createcharacter006_desc_001'),
    getLocalizedText(Header, 'createcharacter007_desc_001'),
    getLocalizedText(Header, 'createcharacter008_desc_001'),
    getLocalizedText(Header, 'createcharacter009_desc_001'),
    '',
    '',
    'Step 9. Choose one as a character thumbnail',
    '',
  ];
  const create2StepTexts: string[] = [
    getLocalizedText(Header, 'createcharacter003_desc_002'),
    getLocalizedText(Header, 'createcharacter004_desc_001'),
    getLocalizedText(Header, 'createcharacter005_desc_001'),
    getLocalizedText(Header, 'createcharacter006_desc_001'),
    getLocalizedText(Header, 'createcharacter007_desc_001'),
    getLocalizedText(Header, 'createcharacter008_desc_001'),
    getLocalizedText(Header, 'createcharacter009_desc_001'),
    '',
    '',
  ];
  const modifyStepTexts: string[] = [
    'Step 1. Choose hair style',
    'Step 2. Outfit of clothes',
    'Step 3. Thumbnail background',
    '',
    'Step 4. Choose one as a character thumbnail',
    '',
  ];
  const finalStepText = 'Write the title of the episode';

  const CreateSteps: CreateCharacterStep[] = Object.values(CreateCharacterStep);
  const steps = createType === 'modify' ? ModifySteps : createType === 'create2' ? Create2Steps : CreateSteps;

  const [selectedOptions, setSelectedOptions] = useState({
    gender: 0,
    style: 0,
    race: 0,
    age: 0,
    eyeColor: 0,
    hairStyle: 0,
    hairColor: 0,
    bodyType: 0,
    topSize: 0,
    bottomSize: 2,
    clothing: 0,
    clothingColor: 0,
    personality: 0,
    background: 0,
    result: 0,
  });

  const [swipers, setSwipers] = useState<{[key: string]: any}>({});
  const optionKeys = ['race', 'bodyType', 'topSize', 'bottomSize', 'clothing'] as const;
  const [isCentered, setIsCentered] = useState<{[key: string]: boolean}>({
    race: false,
    bodyType: false,
    topSize: false,
    bottomSize: false,
    clothing: false,
  });
  const [centerThreshold, setCenterThreshold] = useState(Math.round(window.innerWidth / 116));
  const [clothesInputValue, setClothesInputValue] = useState('');
  const [customClothesActive, setCustomClothesActive] = useState(false);
  const [backgroundInputValue, setBackgroundInputValue] = useState('');
  //#endregion

  //#region Summary Options
  const summaryOptions = [
    {
      key: 'style',
      label: getLocalizedText(Header, 'createcharacter010_label_001'),
      options: characterOptions.styleOptions,
    },
    {
      key: 'race',
      label: getLocalizedText(Header, 'createcharacter005_label_002'),
      options: characterOptions.raceOptions,
    },
    {key: 'age', label: getLocalizedText(Header, 'createcharacter005_label_003'), options: characterOptions.ageOptions},
    {
      key: 'eyeColor',
      label: getLocalizedText(Header, 'createcharacter005_label_004'),
      options: characterOptions.eyeColorOptions,
    },
    {
      key: 'hairStyle',
      label: getLocalizedText(Header, 'createcharacter006_label_002'),
      options: characterOptions.hairStyles,
    },
    {
      key: 'hairColor',
      label: getLocalizedText(Header, 'createcharacter006_label_003'),
      options: characterOptions.hairColors,
    },
    {
      key: 'bodyType',
      label: getLocalizedText(Header, 'createcharacter007_label_002'),
      options: characterOptions.bodyTypes,
    },
    {
      key: 'topSize',
      label: getLocalizedText(Header, 'createcharacter007_label_003'),
      options: characterOptions.topSizes,
    },
    {
      key: 'bottomSize',
      label: getLocalizedText(Header, 'createcharacter007_label_004'),
      options: characterOptions.bottomSizes,
    },
    {
      key: 'clothing',
      label: getLocalizedText(Header, 'createcharacter008_label_002'),
      options: characterOptions.clothing,
    },
    {
      key: 'clothingColor',
      label: getLocalizedText(Header, 'createcharacter008_label_003'),
      options: characterOptions.clothingColor,
    },
    {
      key: 'background',
      label: getLocalizedText(Header, 'createcharacter009_label_002'),
      options: characterOptions.background,
    },
  ];
  //#endregion

  //#region Handlers
  const handleClose = () => closeAction();

  const addStep = () => {
    if (!checkEssential()) {
      alert('필수 선택 항목이 선택되지 않았습니다.');
      return;
    }
    if (createFinishAction && steps[curStep] === CreateCharacterStep.Result) {
      handleConfirm();
    } else {
      setCurStep(prev => Math.min(prev + 1, maxStep));
    }
  };

  const subStep = () => setCurStep(prev => Math.max(prev - 1, 0));

  const checkEssential = () => true;

  const handleConfirm = async () => {
    if (generatedOptions && createFinishAction) {
      createFinishAction(generatedOptions.imageUrl[selectedOptions.result]);
    }
  };

  const handleCustomToggle = () => setCustomClothesActive(prev => !prev);

  const handleGenerate = () => {
    const prompts: GenerateParameter[] = generatePrompts(summaryOptions, selectedOptions);
    const req: GenerateImageReq = {values: prompts};
    GetImageGenerateImage(req);
  };

  const handleOptionSelect = (key: keyof typeof selectedOptions, index: number, autoNextStep?: boolean) => {
    setSelectedOptions(prev => ({...prev, [key]: index}));
    setIsCentered(prev => ({...prev, [key]: index >= centerThreshold}));
    if (autoNextStep) addStep();
  };

  const handleImageToggle = (image: string, parameter: string) => {
    if (!image) return;
    setFullscreenImage({url: image, parameter});
  };

  const handleClothesInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) setClothesInputValue(e.target.value);
  };

  const handleBackgroundInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) setBackgroundInputValue(e.target.value);
  };

  const handlePublishFinishAction = () => publishFinishAction && publishFinishAction();
  //#endregion

  //#region Effects
  // Update step count based on createType
  useEffect(() => {
    setShowStep(createType === 'modify' ? showModifyStep : createType === 'create2' ? showCreate2Step : showCreateStep);
  }, [createType]);

  useEffect(() => {
    if (publishClick) {
      setPublishRequested(true);
      setPublishClick(false);
    }
  }, [publishClick]);

  // Auto-generate image if at Result step
  useEffect(() => {
    if (steps[curStep] === CreateCharacterStep.Result && generatedOptions === null) {
      handleGenerate();
    }
    if (stepperRef.current) {
      const currentStepElement = stepperRef.current.querySelector(`.MuiStep-horizontal:nth-child(${curStep + 1})`);
      currentStepElement?.scrollIntoView({behavior: 'smooth', block: 'nearest', inline: 'center'});
    }
  }, [curStep]);

  // Update character options based on gender and style, and add background data
  useEffect(() => {
    const newOptions =
      selectedOptions.gender === 0
        ? selectedOptions.style === 0
          ? characterOptionsFemaleReal
          : characterOptionsFemaleAnime
        : selectedOptions.gender === 1
        ? selectedOptions.style === 0
          ? characterOptionsMaleReal
          : characterOptionsMaleAnime
        : characterOptionsFemaleReal;

    const updatedOptions = {...newOptions, background: backgroundData};
    setCharacterOptions(updatedOptions);
  }, [selectedOptions.gender, selectedOptions.style]);

  // Update center threshold on resize
  useEffect(() => {
    const updateThreshold = () => setCenterThreshold(Math.round(window.innerWidth / 116));
    updateThreshold();
    window.addEventListener('resize', updateThreshold);
    return () => window.removeEventListener('resize', updateThreshold);
  }, []);

  // Slide Swiper when selectedOptions change
  useEffect(() => {
    optionKeys.forEach(key => {
      if (swipers[key]) swipers[key].slideTo(selectedOptions[key], 300);
    });
  }, [selectedOptions, swipers]);

  const handleSwiperInit = (key: string, swiperInstance: any) => {
    setSwipers(prev => ({...prev, [key]: swiperInstance}));
  };
  //#endregion

  //#region Helper Functions
  const getStyleImgLoc = (imgName: string) => `${imageLoc}${imgName}`;

  const getImgLoc = (imgName: string) => {
    const {gender, style} = selectedOptions;
    const genderStylePath =
      gender === 0
        ? style === 0
          ? 'female_real'
          : 'female_anime'
        : gender === 1
        ? style === 0
          ? 'male_real'
          : 'male_anime'
        : style === 0
        ? 'nonbinary_real'
        : 'nonbinary_anime';
    return `${imageLoc}${genderStylePath}/${imgName}`;
  };

  const getStepText = () =>
    curStep >= maxStep
      ? finalStepText
      : createType === 'modify'
      ? modifyStepTexts[curStep]
      : createType === 'create2'
      ? create2StepTexts[curStep]
      : createStepTexts[curStep] || '';

  const getSplitedPersonalityButton = (label: string, index: number, isSelected: boolean) => {
    const [line1, line2] = label.split('\n');
    return (
      <button
        key={index}
        className={`${styles.personalityButton} ${isSelected ? styles.selected : ''}`}
        onClick={() => handleOptionSelect('personality', index)}
      >
        <div className={`${styles.personalityLabel1} ${isSelected ? styles.selected : ''}`}>{line1}</div>
        <div className={`${styles.personalityLabel2} ${isSelected ? styles.selected : ''}`}>{line2}</div>
      </button>
    );
  };

  const generatePrompts = (
    summaryOptions: {key: string; options: CreateCharacterOption[]}[],
    selectedOptions: Record<string, number>,
  ): GenerateParameter[] => {
    return summaryOptions.map(option => {
      const selectedIndex = selectedOptions[option.key as keyof typeof selectedOptions];
      if (option.options.length > 0) {
        const selectedOption = option.options[selectedIndex];
        if (option.key === 'background' || option.key == 'clothing') {
          let promptText = '';
          if (selectedOption && Array.isArray(selectedOption.prompts) && selectedOption.prompts.length > 0) {
            const randomIndex = Math.floor(Math.random() * selectedOption.prompts.length);
            promptText = selectedOption.prompts[randomIndex];
          }
          return {name: option.key, value: 0, prompt: promptText};
        }
        return {name: option.key, value: selectedOption?.value ?? 0, prompt: ''};
      }
      return {name: option.key, value: 0, prompt: ''};
    });
  };

  const GetImageGenerateImage = async (req: GenerateImageReq) => {
    setLoading(true);
    try {
      const response = await sendGenerateImageReq(req);
      if (response?.data) {
        const newImages = (response.data.imageUrl || []).filter((url: string) => url.startsWith('https://'));
        setGeneratedOptions({...response.data, imageUrl: newImages});
      } else {
        throw new Error('No response for file');
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  //#endregion

  //#region Render Functions
  const getStepContent = (step: CreateCharacterStep) => {
    switch (step) {
      case CreateCharacterStep.Gender:
        return (
          <div className={styles.verticalButtonGroup}>
            {characterOptions.genderOptions.map((option, index) => (
              <button
                key={option.label}
                className={styles.uploadButton}
                onClick={() => handleOptionSelect('gender', index, true)}
              >
                <div className={styles.buttonIconBack}>
                  <img className={styles.buttonIcon} src={index === 0 ? LineCharacter.src : LineUpload.src} />
                </div>
                <div className={styles.buttonText}>{getLocalizedText(Common, option.label)}</div>
              </button>
            ))}
          </div>
        );
      case CreateCharacterStep.Style:
        return (
          <div className={styles.createContentBox}>
            <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap11}`}>
              {characterOptions.styleOptions.map((option, index) => (
                <CharacterCreateImageButton
                  key={option.label}
                  sizeType="large"
                  label={option.label}
                  image={getStyleImgLoc(option.image)}
                  selected={selectedOptions.style === index}
                  onClick={() => handleOptionSelect('style', index)}
                />
              ))}
            </div>
          </div>
        );
      case CreateCharacterStep.Race:
        return (
          <div className={styles.createContentBox}>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>
                {getLocalizedText(Header, 'createcharacter005_label_002')}
                <span className={styles.redAstrisk}>*</span>
              </h3>
              <Swiper
                className={styles.horizonSwiper}
                initialSlide={selectedOptions.race}
                centeredSlides={isCentered['race']}
                slidesPerView="auto"
                spaceBetween={6}
                onSlideChange={() => setIsCentered(prev => ({...prev, race: false}))}
                onSwiper={swiper => handleSwiperInit('race', swiper)}
              >
                {characterOptions.raceOptions.map((race, index) => (
                  <SwiperSlide
                    key={race.label}
                    className={styles.swiperSmall}
                    style={{width: '100px', height: '100px'}}
                  >
                    <CharacterCreateImageButton
                      key={race.label}
                      sizeType="small"
                      label={race.label}
                      image={getImgLoc(race.image)}
                      selected={selectedOptions.race === index}
                      onClick={() => handleOptionSelect('race', index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </article>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>
                {getLocalizedText(Header, 'createcharacter005_label_003')}
                <span className={styles.redAstrisk}>*</span>
              </h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
                {characterOptions.ageOptions.map((age, index) => (
                  <CustomHashtag
                    key={age.label}
                    text={getLocalizedText(Common, age.label)}
                    onClickAction={() => handleOptionSelect('age', index)}
                    isSelected={selectedOptions.age === index}
                  />
                ))}
              </div>
            </article>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>
                {getLocalizedText(Header, 'createcharacter005_label_004')}
                <span className={styles.redAstrisk}>*</span>
              </h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
                {characterOptions.eyeColorOptions.map((eyeColor, index) => (
                  <CharacterCreateImageButton
                    key={eyeColor.label}
                    sizeType="small"
                    label={eyeColor.label}
                    image={getImgLoc(eyeColor.image)}
                    selected={selectedOptions.eyeColor === index}
                    onClick={() => handleOptionSelect('eyeColor', index)}
                  />
                ))}
              </div>
            </article>
          </div>
        );
      case CreateCharacterStep.HairStyle:
        return (
          <div className={styles.createContentBox}>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>
                {getLocalizedText(Header, 'createcharacter006_label_002')}
                <span className={styles.redAstrisk}>*</span>
              </h3>
              <div className={`${styles.gridButtonGroup3x3} ${styles.buttonGap6}`}>
                {characterOptions.hairStyles.map((style, index) => (
                  <CharacterCreateImageButton
                    key={style.label}
                    sizeType="middle"
                    label={style.label}
                    image={getImgLoc(style.image)}
                    selected={selectedOptions.hairStyle === index}
                    onClick={() => handleOptionSelect('hairStyle', index)}
                  />
                ))}
              </div>
            </article>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>
                {getLocalizedText(Header, 'createcharacter006_label_003')}
                <span className={styles.redAstrisk}>*</span>
              </h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
                {characterOptions.hairColors.map((color, index) => (
                  <CustomHashtag
                    key={color.label}
                    text={getLocalizedText(Common, color.label)}
                    onClickAction={() => handleOptionSelect('hairColor', index)}
                    isSelected={selectedOptions.hairColor === index}
                    color={color.image}
                  />
                ))}
              </div>
            </article>
          </div>
        );
      case CreateCharacterStep.BodyShape:
        return (
          <div className={styles.createContentBox}>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>
                {getLocalizedText(Header, 'createcharacter007_label_002')}
                <span className={styles.redAstrisk}>*</span>
              </h3>
              <Swiper
                className={styles.horizonSwiper}
                initialSlide={selectedOptions.bodyType}
                slidesPerView="auto"
                spaceBetween={6}
                centeredSlides={isCentered['bodyType']}
                onSlideChange={() => setIsCentered(prev => ({...prev, bodyType: false}))}
                onSwiper={swiper => handleSwiperInit('bodyType', swiper)}
              >
                {characterOptions.bodyTypes.map((style, index) => (
                  <SwiperSlide
                    key={style.label}
                    className={styles.swiperSmall}
                    style={{width: '100px', height: '100px'}}
                  >
                    <CharacterCreateImageButton
                      sizeType="small"
                      label={style.label}
                      image={getImgLoc(style.image)}
                      selected={selectedOptions.bodyType === index}
                      onClick={() => handleOptionSelect('bodyType', index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </article>
            {selectedOptions.gender === 0 && (
              <>
                <article className={styles.createContentArea}>
                  <h3 className={styles.createSubTitle}>
                    {getLocalizedText(Header, 'createcharacter007_label_003')}
                    <span className={styles.redAstrisk}>*</span>
                  </h3>
                  <Swiper
                    className={styles.horizonSwiper}
                    initialSlide={selectedOptions.topSize}
                    slidesPerView="auto"
                    spaceBetween={6}
                    centeredSlides={isCentered['topSize']}
                    onSlideChange={() => setIsCentered(prev => ({...prev, topSize: false}))}
                    onSwiper={swiper => handleSwiperInit('topSize', swiper)}
                  >
                    {characterOptions.topSizes.map((style, index) => (
                      <SwiperSlide
                        key={style.label}
                        className={styles.swiperSmall}
                        style={{width: '100px', height: '100px'}}
                      >
                        <CharacterCreateImageButton
                          sizeType="small"
                          label={style.label}
                          image={getImgLoc(style.image)}
                          selected={selectedOptions.topSize === index}
                          onClick={() => handleOptionSelect('topSize', index)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </article>
                <article className={styles.createContentArea}>
                  <h3 className={styles.createSubTitle}>
                    {getLocalizedText(Header, 'createcharacter007_label_004')}
                    <span className={styles.redAstrisk}>*</span>
                  </h3>
                  <Swiper
                    className={styles.horizonSwiper}
                    initialSlide={selectedOptions.bottomSize}
                    slidesPerView="auto"
                    spaceBetween={6}
                    centeredSlides={isCentered['bottomSize']}
                    onSlideChange={() => setIsCentered(prev => ({...prev, bottomSize: false}))}
                    onSwiper={swiper => handleSwiperInit('bottomSize', swiper)}
                  >
                    {characterOptions.bottomSizes.map((style, index) => (
                      <SwiperSlide
                        key={style.label}
                        className={styles.swiperSmall}
                        style={{width: '100px', height: '100px'}}
                      >
                        <CharacterCreateImageButton
                          sizeType="small"
                          label={style.label}
                          image={getImgLoc(style.image)}
                          selected={selectedOptions.bottomSize === index}
                          onClick={() => handleOptionSelect('bottomSize', index)}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </article>
              </>
            )}
          </div>
        );
      case CreateCharacterStep.OutfitClothes:
        return (
          <div className={styles.createContentBox}>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>
                {getLocalizedText(Header, 'createcharacter008_label_002')}
                <span className={styles.redAstrisk}>*</span>
              </h3>
              <Swiper
                className={styles.horizonSwiper}
                initialSlide={selectedOptions.clothing}
                slidesPerView="auto"
                spaceBetween={6}
                centeredSlides={isCentered['clothing']}
                onSlideChange={() => setIsCentered(prev => ({...prev, clothing: false}))}
                onSwiper={swiper => handleSwiperInit('clothing', swiper)}
              >
                {characterOptions.clothing.map((style, index) => (
                  <SwiperSlide
                    key={style.label}
                    className={styles.swiperSmall}
                    style={{width: '100px', height: '100px'}}
                  >
                    <CharacterCreateImageButton
                      sizeType="small"
                      label={style.label}
                      image={getImgLoc(style.image)}
                      selected={selectedOptions.clothing === index}
                      onClick={() => handleOptionSelect('clothing', index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </article>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>
                {getLocalizedText(Header, 'createcharacter008_label_003')}
                <span className={styles.redAstrisk}>*</span>
              </h3>
              <div
                className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}
                style={{pointerEvents: customClothesActive ? 'none' : 'auto', opacity: customClothesActive ? 0.5 : 1}}
              >
                {characterOptions.clothingColor.map((style, index) => (
                  <CustomHashtag
                    key={style.label}
                    text={getLocalizedText(Common, style.label)}
                    onClickAction={() => handleOptionSelect('clothingColor', index)}
                    isSelected={selectedOptions.clothingColor === index}
                    color={style.image}
                  />
                ))}
              </div>
            </article>
            <article className={styles.createContentArea}>
              <MaxTextInput
                displayDataType={displayType.Label}
                promptValue={clothesInputValue}
                handlePromptChange={handleClothesInputChange}
                maxPromptLength={maxLength}
                labelText={getLocalizedText(Header, 'createcharacter008_label_004')}
              />
            </article>
          </div>
        );
      case CreateCharacterStep.ThumbnailBackground:
        return (
          <div className={styles.createContentBox}>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>{getLocalizedText(Header, 'createcharacter009_label_002')}</h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
                {backgroundData.slice(0, 20).map((style, index) => (
                  <CustomHashtag
                    key={style.label}
                    text={getLocalizedText(Common, style.label)}
                    onClickAction={() => handleOptionSelect('background', index)}
                    isSelected={selectedOptions.background === index}
                  />
                ))}
              </div>
            </article>
            <article className={styles.createContentArea}>
              <MaxTextInput
                displayDataType={displayType.Label}
                promptValue={backgroundInputValue}
                handlePromptChange={handleBackgroundInputChange}
                maxPromptLength={maxLength}
                labelText={getLocalizedText(Header, 'createcharacter009_label_003')}
              />
            </article>
          </div>
        );
      case CreateCharacterStep.Personality:
        return <div>not use</div>;
      case CreateCharacterStep.Summary:
        return (
          <div className={styles.createContentBox}>
            <div className={`${styles.gridButtonGroup3x3} ${styles.buttonGap6}`}>
              {summaryOptions
                .filter(
                  option =>
                    !(selectedOptions.gender === 1 && (option.key === 'topSize' || option.key === 'bottomSize')),
                )
                .map(option => (
                  <div key={option.key} className={styles.summaryItem}>
                    <div className={styles.summaryLabel}>{option.label}</div>
                    <CharacterCreateImageButton
                      key={option.key}
                      label={
                        option.key === 'personality'
                          ? option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.label.split(
                              '\n',
                            )[0]
                          : option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.label || ''
                      }
                      onClick={() => {}}
                      image={
                        option.key !== 'hairColor' && option.key !== 'clothingColor'
                          ? getImgLoc(
                              option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.image,
                            )
                          : ''
                      }
                      color={
                        option.key === 'hairColor' || option.key === 'clothingColor'
                          ? option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.image
                          : undefined
                      }
                      selected={false}
                      sizeType="middle"
                    />
                  </div>
                ))}
            </div>
          </div>
        );
      case CreateCharacterStep.Result:
        return (
          <article className={styles.createContentArea}>
            {generatedOptions === null || generatedOptions.imageUrl.length < 1 ? (
              <></>
            ) : (
              <div className={styles.createContentBox}>
                <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap11}`}>
                  {(generatedOptions?.imageUrl ?? []).map((imgUrl, index) => (
                    <CharacterCreateImageButton
                      key={index}
                      sizeType="large"
                      label={null}
                      image={imgUrl}
                      selected={selectedOptions.result === index}
                      onClick={() =>
                        selectedOptions.result === index
                          ? handleImageToggle(imgUrl, generatedOptions?.debugParameter ?? '')
                          : handleOptionSelect('result', index)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </article>
        );
      default:
        return 'Unknown step';
    }
  };

  const renderBottom = () => (
    <>
      {((curStep > 0 && createType === 'create') || createType !== 'create') && (
        <>
          {curStep < steps.length - 1 ? (
            <>
              <CustomButton
                size="Medium"
                type="Tertiary"
                state="IconLeft"
                onClick={subStep}
                isDisabled={curStep === 0}
                icon={LineArrowLeft.src}
                iconClass="blackIcon"
                customClassName={[styles.stepButton]}
              >
                {getLocalizedText(Common, 'common_button_previous')}
              </CustomButton>
              <CustomButton
                size="Medium"
                type="Primary"
                state="IconRight"
                onClick={addStep}
                icon={
                  steps[curStep] === CreateCharacterStep.Summary && generatedOptions === null ? '' : LineArrowRight.src
                }
                customClassName={[styles.stepButton]}
              >
                {steps[curStep] === CreateCharacterStep.Summary ? (
                  generatedOptions === null ? (
                    <>
                      {getLocalizedText(Common, 'common_button_generate')}
                      <img className={styles.rubyIcon} src={BoldRuby.src} />
                      50
                    </>
                  ) : (
                    getLocalizedText(Common, 'common_button_next')
                  )
                ) : steps[curStep] === CreateCharacterStep.Result ? (
                  getLocalizedText(Common, 'common_button_confirm')
                ) : (
                  getLocalizedText(Common, 'common_button_next')
                )}
              </CustomButton>
            </>
          ) : (
            <PublishCharacterBottom onPrevClick={subStep} onPublishClick={() => setPublishClick(true)} />
          )}
        </>
      )}
    </>
  );
  //#endregion

  return (
    <main className={styles.container}>
      {curStep < showStep && <CustomStepper curStep={curStep + 1} maxStep={showStep} />}
      <article className={styles.stepContent}>
        <div className={styles.createBox}>
          <h2 className={getStepText() !== '' ? styles.createTitle : ''}>{getStepText()}</h2>
          {getStepContent(steps[curStep])}
          {/* <h1 onClick={handleGenerate}>ReGenerate</h1> */}
        </div>
      </article>
      <footer className={styles.buttonContainer}>{renderBottom()}</footer>
      {fullscreenImage && <FullScreenImage imageData={fullscreenImage} onClick={() => setFullscreenImage(null)} />}
      <LoadingOverlay loading={loading} />
    </main>
  );
};

export default CharacterCreateSequence;
