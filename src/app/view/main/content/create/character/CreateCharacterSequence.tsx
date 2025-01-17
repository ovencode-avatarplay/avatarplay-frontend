import React, {useEffect, useRef, useState} from 'react';
import styles from './CreateCharacterSequence.module.css';

// redux
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

// Json Data
import characterOptionsMaleReal from '@/data/create/create-character-male-real.json';
import characterOptionsFemaleReal from '@/data/create/create-character-female-real.json';
import characterOptionsNonBinaryReal from '@/data/create/create-character-non-binary-real.json';
import characterOptionsMaleAnime from '@/data/create/create-character-male-anime.json';
import characterOptionsFemaleAnime from '@/data/create/create-character-female-anime.json';
import characterOptionsNonBinaryAnime from '@/data/create/create-character-non-binary-anime.json';

// Network
import {GenerateImageReq, GenerateImageRes, GenerateParameter, sendGenerateImageReq} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';

// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// Components
import CharacterCreateImageButton from './CreateCharacterImageButton';
import PublishCharacter from './PublishCharacter';
import {CreateCharacterOption} from './CreateCharacterType';
import FullScreenImage, {FullViewImageData} from '@/components/layout/shared/FullViewImage';
import PublishCharacterBottom from './PublishCharacterBottom';
import CustomStepper from '@/components/layout/shared/CustomStepper';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldRuby, LineArrowLeft, LineArrowRight} from '@ui/Icons';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';

interface Props {
  closeAction: () => void;
  isModify: boolean;
  characterInfo?: CharacterInfo;
  publishFinishAction?: () => void;
}

const CharacterCreateSequence: React.FC<Props> = ({closeAction, isModify, characterInfo, publishFinishAction}) => {
  //#region Pre Define
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
    background: [],
    personality: [],
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

  const maxLength = 200;

  const imageLoc = '/create_character/';
  //#endregion

  //#region State
  const [loading, setLoading] = useState(false);

  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [publishClick, setPublishClick] = useState(Boolean);
  const [publishReqested, setPublishReqested] = useState(Boolean);

  const [characterOptions, setCharacterOptions] = useState(defaultOptions);
  const [generatedOptions, setGeneratedOptions] = useState<GenerateImageRes | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<FullViewImageData | null>(null); // Add fullscreen image state

  // Step
  const [maxStep, setMaxStep] = useState<number>(11);
  const showStep = 8;
  const [curStep, setCurStep] = useState<number>(0); // 0일때는 max 수치가 변동이 있을 수 있기때문에 step이 가려집니다.
  const stepTexts: string[] = [
    'Step 1. Select gender',
    'Step 2. Select style',
    'Step 3. Choose ethnicity',
    'Step 4. Choose hair style',
    'Step 5. Body shape',
    'Step 6. Outfit of clothes',
    'Step 7. Thumbnail background',
    'Step 8. Choose personality',
    '',
    'Step 9. Choose one as a character thumbnail',
    '',
  ];
  const finalStepText = 'Write the title of the episode';

  const CreateSteps: CreateCharacterStep[] = Object.values(CreateCharacterStep);

  const steps = isModify ? ModifySteps : CreateSteps;

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
    bottomSize: 0,
    clothing: 0,
    clothingColor: 0,
    background: 0,
    personality: 0,
    result: 0,
  });

  const [clothesInputValue, setClothesInputValue] = useState('');
  const [customClothesActive, setCustomClothesActive] = useState(false);
  //#endregion

  //#region Post Define
  const summaryOptions = [
    {key: 'style', label: 'Style', options: characterOptions.styleOptions},
    {key: 'race', label: 'Race', options: characterOptions.raceOptions},
    {key: 'age', label: 'Age', options: characterOptions.ageOptions},
    {key: 'eyeColor', label: 'Eye Color', options: characterOptions.eyeColorOptions},
    {key: 'hairStyle', label: 'Hair Style', options: characterOptions.hairStyles},
    {key: 'hairColor', label: 'Hair Color', options: characterOptions.hairColors},
    {key: 'bodyType', label: 'Body Type', options: characterOptions.bodyTypes},
    {key: 'topSize', label: 'Top Size', options: characterOptions.topSizes},
    {key: 'bottomSize', label: 'Bottom Size', options: characterOptions.bottomSizes},
    {key: 'clothing', label: 'Clothing', options: characterOptions.clothing},
    {key: 'background', label: 'Background', options: characterOptions.background},
    {key: 'personality', label: 'Personality', options: characterOptions.personality},
  ];

  //#endregion

  //#region  Handler
  const handleClose = () => {
    closeAction();
  };

  function addStep() {
    if (!checkEssential()) {
      alert('필수 선택 항목이 선택되지 않았습니다.');
      return;
    }

    setCurStep(prev => Math.min(prev + 1, maxStep));
    handleConfirm();
  }
  function subStep() {
    setCurStep(prev => Math.max(prev - 1, 0));
  }

  function checkEssential() {
    {
      if (curStep > 0) {
        return true;
      }
    }
    return true;
  }

  const handleConfirm = async () => {};

  const handleCustomToggle = () => {
    setCustomClothesActive(!customClothesActive);
  };

  const handleGenerate = () => {
    const prompts: GenerateParameter[] = generatePrompts(summaryOptions, selectedOptions);

    const req: GenerateImageReq = {
      values: prompts,
    };

    GetImageGenerateImage(req);
  };

  const handleOptionSelect = (key: keyof typeof selectedOptions, index: number, autoNextStep?: boolean) => {
    setSelectedOptions(prev => ({
      ...prev,
      [key]: index,
    }));

    if (autoNextStep) addStep();
  };

  const handleImageToggle = (image: string, parameter: string) => {
    if (image === null) return;

    setFullscreenImage({url: image, parameter: parameter});
  };

  const handleClothesInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (e.target.value.length <= maxLength) {
      setClothesInputValue(e.target.value);
    }
  };

  const handlePublishFinishAction = () => {
    if (publishFinishAction) {
      publishFinishAction();
    }
  };
  //#endregion

  //#region Hook
  useEffect(() => {
    if (publishClick) {
      setPublishReqested(true);
      setPublishClick(false);
    }
  }, [publishClick]);

  // gender 0 Male / 1 Female, style 0 Real / 1 Anime
  useEffect(() => {
    if (steps[curStep] === 'Result' && generatedOptions === null) {
      handleGenerate();
    }
    if (stepperRef.current) {
      const currentStepElement = stepperRef.current.querySelector(`.MuiStep-horizontal:nth-child(${curStep + 1})`);
      if (currentStepElement) {
        currentStepElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  }, [curStep]);

  useEffect(() => {
    // Define character options based on gender and style selection
    const newCharacterOptions =
      selectedOptions.gender === 0
        ? selectedOptions.style === 0
          ? characterOptionsFemaleReal
          : characterOptionsFemaleAnime
        : selectedOptions.gender === 1
        ? selectedOptions.style === 0
          ? characterOptionsMaleReal
          : characterOptionsMaleAnime
        : selectedOptions.style === 0
        ? characterOptionsNonBinaryReal
        : characterOptionsNonBinaryAnime;

    // Update character options
    setCharacterOptions(newCharacterOptions);
  }, [selectedOptions.gender, selectedOptions.style]);

  //#endregion

  //#region Function

  const getImgLoc = (imgName: string) => {
    return imageLoc + imgName;
  };

  const getStepText = () => {
    if (curStep >= maxStep) {
      return finalStepText;
    }
    const currentStep = stepTexts[curStep];
    return currentStep || '';
  };

  const getSplitedPersonalityButton = (label: string, index: number, isSelected: boolean) => {
    const [label1, label2] = label.split('\n');

    return (
      <button
        key={index}
        className={`${styles.personalityButton} ${isSelected && styles.selected}`}
        onClick={() => handleOptionSelect('personality', index)}
      >
        <div className={`${styles.personalityLabel1} ${isSelected && styles.selected}`}>{label1}</div>

        <div className={`${styles.personalityLabel2} ${isSelected && styles.selected}`}>{label2}</div>
      </button>
    );
  };

  const generatePrompts = (
    summaryOptions: {key: string; options: {value: number}[]}[],
    selectedOptions: Record<string, number>,
  ): GenerateParameter[] => {
    return summaryOptions.map(option => {
      const selectedIndex = selectedOptions[option.key as keyof typeof selectedOptions];
      const selectedOption = option.options[selectedIndex];

      return {name: option.key, value: selectedOption?.value ?? 0};
    });
  };

  const GetImageGenerateImage = async (req: GenerateImageReq) => {
    setLoading(true);
    try {
      const response = await sendGenerateImageReq(req);

      if (response?.data) {
        setGeneratedOptions(response.data);

        /*handleClose();*/
      } else {
        throw new Error(`No response for file`);
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStepContent = (step: CreateCharacterStep) => {
    switch (step) {
      case CreateCharacterStep.Gender:
        return (
          <div className={styles.verticalButtonGroup}>
            {characterOptions.genderOptions.map((option, index) => (
              <button className={styles.uploadButton} onClick={() => handleOptionSelect('gender', index, true)}>
                <img className={styles.buttonIconBack} src={LineArrowLeft.src} />
                <div className={styles.buttonText}>{option.label}</div>
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
                  image={getImgLoc(option.image)}
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
              <h3 className={styles.createSubTitle}>Ethnicity</h3>
              <Swiper
                className={styles.horizonSwiper}
                initialSlide={selectedOptions.race}
                centeredSlides={true}
                slidesPerView="auto"
                spaceBetween={6}
                onSlideChange={swiper => handleOptionSelect('race', swiper.activeIndex)}
              >
                {characterOptions.raceOptions.map((race, index) => (
                  <SwiperSlide className={styles.swiperSmall} style={{width: '100px', height: '100px'}}>
                    <CharacterCreateImageButton
                      key={race.label}
                      sizeType="small"
                      label={race.label}
                      image={getImgLoc(race.image)}
                      selected={selectedOptions.race === index}
                      onClick={() => {} /*handleOptionSelect('race', index)*/}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </article>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>Age</h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
                {characterOptions.ageOptions.map((age, index) => (
                  <CustomHashtag
                    key={age.label}
                    text={age.label}
                    onClickAction={() => handleOptionSelect('age', index)}
                    isSelected={selectedOptions.age === index}
                  />
                ))}
              </div>
            </article>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>Eye Color</h3>
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
              <h3 className={styles.createSubTitle}>Hair Style</h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
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
              <h3 className={styles.createSubTitle}>Hair Color</h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
                {characterOptions.hairColors.map((color, index) => (
                  <CustomHashtag
                    key={color.label}
                    text={color.label}
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
              <h3 className={styles.createSubTitle}>Body Type</h3>
              <Swiper
                className={styles.horizonSwiper}
                initialSlide={selectedOptions.bodyType}
                slidesPerView="auto"
                spaceBetween={6}
                centeredSlides={true}
                onSlideChange={swiper => handleOptionSelect('bodyType', swiper.activeIndex)}
              >
                {characterOptions.bodyTypes.map((style, index) => (
                  <SwiperSlide
                    className={styles.swiperSmall}
                    style={{width: '100px', height: '100px'}}
                    key={style.label}
                  >
                    <CharacterCreateImageButton
                      sizeType="small"
                      label={style.label}
                      image={getImgLoc(style.image)}
                      selected={selectedOptions.bodyType === index}
                      onClick={() => {}}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {selectedOptions.gender === 0 && (
                <>
                  <h3 className={styles.createSubTitle}>Top Size</h3>
                  <Swiper
                    className={styles.horizonSwiper}
                    initialSlide={selectedOptions.topSize}
                    slidesPerView="auto"
                    spaceBetween={6}
                    centeredSlides={true}
                    onSlideChange={swiper => handleOptionSelect('topSize', swiper.activeIndex)}
                  >
                    {characterOptions.topSizes.map((style, index) => (
                      <SwiperSlide
                        className={styles.swiperSmall}
                        style={{width: '100px', height: '100px'}}
                        key={style.label}
                      >
                        <CharacterCreateImageButton
                          sizeType="small"
                          label={style.label}
                          image={getImgLoc(style.image)}
                          selected={selectedOptions.topSize === index}
                          onClick={() => {}}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>

                  <h3 className={styles.createSubTitle}>Bottom Size</h3>
                  <Swiper
                    className={styles.horizonSwiper}
                    initialSlide={selectedOptions.bottomSize}
                    slidesPerView="auto"
                    spaceBetween={6}
                    centeredSlides={true}
                    onSlideChange={swiper => handleOptionSelect('bottomSize', swiper.activeIndex)}
                  >
                    {characterOptions.bottomSizes.map((style, index) => (
                      <SwiperSlide
                        className={styles.swiperSmall}
                        style={{width: '100px', height: '100px'}}
                        key={style.label}
                      >
                        <CharacterCreateImageButton
                          sizeType="small"
                          label={style.label}
                          image={getImgLoc(style.image)}
                          selected={selectedOptions.bottomSize === index}
                          onClick={() => {}}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </>
              )}
            </article>
          </div>
        );
      case CreateCharacterStep.OutfitClothes:
        return (
          <div className={styles.createContentBox}>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>Outfit Style</h3>
              <Swiper
                className={styles.horizonSwiper}
                slidesPerView="auto"
                spaceBetween={6}
                initialSlide={selectedOptions.clothing}
                centeredSlides={true}
                onSlideChange={swiper => handleOptionSelect('clothing', swiper.activeIndex)}
                style={{pointerEvents: customClothesActive ? 'none' : 'auto', opacity: customClothesActive ? 0.5 : 1}}
              >
                {characterOptions.clothing.map((style, index) => (
                  <SwiperSlide
                    className={styles.swiperSmall}
                    style={{width: '100px', height: '100px'}}
                    key={style.label}
                  >
                    <CharacterCreateImageButton
                      key={style.label}
                      sizeType="small"
                      label={style.label}
                      image={getImgLoc(style.image)}
                      selected={selectedOptions.clothing === index}
                      onClick={() => {
                        handleOptionSelect('clothing', index);
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <h3 className={styles.createSubTitle}>Theme Color</h3>
              <div
                className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}
                style={{pointerEvents: customClothesActive ? 'none' : 'auto', opacity: customClothesActive ? 0.5 : 1}}
              >
                {characterOptions.clothingColor.map((style, index) => (
                  <CustomHashtag
                    key={style.label}
                    text={style.label}
                    onClickAction={() => handleOptionSelect('clothingColor', index)}
                    isSelected={selectedOptions.clothingColor === index}
                    color={style.image}
                  />
                ))}
              </div>
              <MaxTextInput
                displayDataType={displayType.Label}
                promptValue={clothesInputValue}
                handlePromptChange={handleClothesInputChange}
                maxPromptLength={500}
                labelText="Custom Setup"
              />
            </article>
          </div>
        );
      case CreateCharacterStep.ThumbnailBackground:
        return (
          <div className={styles.createContentBox}>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>Background</h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
                {characterOptions.background.map((style, index) => (
                  <CustomHashtag
                    key={style.label}
                    text={style.label}
                    onClickAction={() => handleOptionSelect('background', index)}
                    isSelected={selectedOptions.background === index}
                  />
                ))}
              </div>
            </article>
          </div>
        );
      case CreateCharacterStep.Personality:
        return (
          <div className={styles.createContentBox}>
            <article className={styles.createContentArea}>
              <h3 className={styles.createSubTitle}>Personality</h3>
              <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap10}`}>
                {characterOptions.personality.map((style, index) =>
                  getSplitedPersonalityButton(style.label, index, selectedOptions.personality === index),
                )}
              </div>
            </article>
          </div>
        );
      case CreateCharacterStep.Summary:
        return (
          <div className={styles.createContentBox}>
            <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap6}`}>
              {summaryOptions.map((option, index) => (
                <div className={styles.summaryItem}>
                  <CharacterCreateImageButton
                    key={index}
                    label={
                      option.key === 'personality'
                        ? option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.label.split(
                            '\n',
                          )[0]
                        : option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.label || ''
                    }
                    onClick={() => {}}
                    image={
                      option.key !== 'hairColor'
                        ? getImgLoc(option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.image)
                        : ''
                    }
                    color={
                      option.key === 'hairColor'
                        ? option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.image
                        : undefined // 다른 경우에는 color를 전달하지 않음
                    }
                    selected={false}
                    sizeType="middle"
                  />
                  <div className={styles.summaryLabel}>{option.label}</div>
                </div>
              ))}
              {/* {customClothesActive && (
                  <Typography variant="subtitle1" className={styles.summaryClothes}>
                    Clothes: {clothesInputValue}
                  </Typography>
                )} */}
            </div>
          </div>
        );
      case CreateCharacterStep.Result:
        return (
          <article className={styles.createContentArea}>
            {generatedOptions === null ||
              (generatedOptions.imageUrl.length < 1 ? (
                <>GenerateFailed</>
              ) : (
                <div className={styles.createContentBox}>
                  <div className={`${styles.horizontalButtonGroup} ${styles.buttonGap11}`}>
                    {(generatedOptions?.imageUrl ?? []).map((option, index) => (
                      <CharacterCreateImageButton
                        key={index}
                        sizeType="large"
                        label={null}
                        image={option}
                        selected={selectedOptions.result === index}
                        onClick={() =>
                          selectedOptions.result === index
                            ? handleImageToggle(option, generatedOptions?.debugParameter ?? '')
                            : handleOptionSelect('result', index)
                        }
                      />
                    ))}
                  </div>
                </div>
              ))}
          </article>
        );
      case CreateCharacterStep.Publish:
        return (
          <div className={styles.createBox}>
            <PublishCharacter
              characterInfo={{
                ...(characterInfo ?? {
                  id: 0,
                  name: '',
                  introduction: '',
                  description: '',
                  genderType: selectedOptions.gender,
                  mainImageUrl: generatedOptions?.imageUrl[selectedOptions.result] ?? '',
                  portraitGalleryImageUrl: [],
                  poseGalleryImageUrl: [],
                  expressionGalleryImageUrl: [],
                  visibilityType: 0,
                  isMonetization: false,
                  state: 0,
                }),
                mainImageUrl: generatedOptions?.imageUrl[selectedOptions.result] ?? '',
                genderType: selectedOptions.gender,
              }}
              // createOption={generatePrompts(summaryOptions, selectedOptions)}
              debugparam={generatedOptions?.debugParameter ?? 'not generated image'}
              publishRequested={publishReqested}
              publishRequestedAction={() => {
                setPublishReqested(false);
              }}
              publishFinishAction={handlePublishFinishAction}
            />
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  const renderBottom = () => {
    return (
      <>
        {curStep > 0 && (
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
                  {'Previous'}
                </CustomButton>

                <CustomButton
                  size="Medium"
                  type="Primary"
                  state="IconRight"
                  onClick={addStep}
                  icon={steps[curStep] === 'Summary' && generatedOptions === null ? '' : LineArrowRight.src}
                  iconClass="blackIcon"
                  customClassName={[styles.stepButton]}
                >
                  {steps[curStep] === 'Summary' ? (
                    generatedOptions === null /* 이미 생성된 후에는 Regenerate 버튼으로 수정 가능 */ ? (
                      <>
                        Generate
                        <img className={styles.rubyIcon} src={BoldRuby.src} />
                        50
                      </>
                    ) : (
                      'Next (isGenerated)'
                    )
                  ) : steps[curStep] === 'Result' ? (
                    'Confirm'
                  ) : (
                    'Next'
                  )}
                </CustomButton>
              </>
            ) : (
              <>
                <PublishCharacterBottom
                  onPrevClick={subStep}
                  onPublishClick={() => {
                    setPublishClick(true);
                  }}
                />
              </>
            )}
          </>
        )}
      </>
    );
  };
  //#endregion

  return (
    <main className={styles.container}>
      {curStep < showStep && <CustomStepper curStep={curStep + 1} maxStep={showStep} />}

      <article className={styles.stepContent}>
        <div className={styles.createBox}>
          <h2 className={getStepText() !== '' ? styles.createTitle : ''}>{getStepText()}</h2>
          {getStepContent(steps[curStep])}
        </div>
      </article>

      <footer className={styles.buttonContainer}>{renderBottom()}</footer>

      {fullscreenImage && <FullScreenImage imageData={fullscreenImage} onClick={() => setFullscreenImage(null)} />}

      <LoadingOverlay loading={loading} />
    </main>
  );
};

export default CharacterCreateSequence;
