import React, {useEffect, useRef, useState} from 'react';
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import styles from './CreateCharacterSequence.module.css';
import GirlIcon from '@mui/icons-material/Female';
import BoyIcon from '@mui/icons-material/Male';
import TransgenderIcon from '@mui/icons-material/Transgender';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// Json Data
import characterOptionsMaleReal from '@/data/create/create-character-male-real.json';
import characterOptionsFemaleReal from '@/data/create/create-character-female-real.json';
import characterOptionsNonBinaryReal from '@/data/create/create-character-non-binary-real.json';
import characterOptionsMaleAnime from '@/data/create/create-character-male-anime.json';
import characterOptionsFemaleAnime from '@/data/create/create-character-female-anime.json';
import characterOptionsNonBinaryAnime from '@/data/create/create-character-non-binary-anime.json';

// Network
import {GenerateImageReq, sendGenerateImageReq} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';

// Components
import CharacterCreateImageButton from './CreateCharacterImageButton';

// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import PublishCharacter from './PublishCharacter';
import {CreateCharacterOption, GeneratedOptionsState} from './CreateCharacterType';

interface Props {
  closeAction: () => void;
}

const CharacterCreate: React.FC<Props> = ({closeAction}) => {
  const [activeStep, setActiveStep] = useState(0);
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);

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

  const [characterOptions, setCharacterOptions] = useState(defaultOptions);
  const [generatedOptions, setGeneratedOptions] = useState<GeneratedOptionsState[]>([]);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null); // Add fullscreen image state

  const steps = [
    'Gender',
    'Style',
    'Ethnicity',
    'HairStyle',
    'BodyShape',
    'OutfitClothes',
    'ThumbnailBackground',
    'Personality',
    'Summary',
    'Result',
    'Publish',
  ];

  const isStepFailed = (step: number) => {
    return step === 1;
  };

  // States
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

  // gender 0 Male / 1 Female, style 0 Real / 1 Anime
  useEffect(() => {
    if (steps[activeStep] === 'Result' && generatedOptions.length === 0) {
      handleGenerate();
    }
  }, [activeStep]);

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

  const [clothesInputValue, setClothesInputValue] = useState('');
  const maxLength = 200;

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

  const [customClothesActive, setCustomClothesActive] = useState(false);

  // Handler
  const handleClose = () => {
    closeAction();
  };

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeStep > 0) {
      setActiveStep(prev => prev - 1);
    }
  };

  const handleSelect = () => {
    let url = generatedOptions[selectedOptions.result];

    handleClose();
  };

  const handleCustomToggle = () => {
    setCustomClothesActive(!customClothesActive);
  };

  const handleGenerate = () => {
    const prompts = [
      ...summaryOptions.map(option => {
        const selectedIndex = selectedOptions[option.key as keyof typeof selectedOptions];
        const selectedOption = option.options[selectedIndex];

        return selectedOption?.value;
      }),
    ];

    const req: GenerateImageReq = {
      values: prompts,
    };

    GetImageGenerateImage(req);
  };

  const GetImageGenerateImage = async (req: GenerateImageReq) => {
    setLoading(true);
    try {
      const response = await sendGenerateImageReq(req);

      console.log(response);
      if (response?.data) {
        const imageUrls: string[] = response.data.imageUrl;

        console.log(imageUrls);
        setGeneratedOptions(imageUrls.map(url => ({url: url})));

        /*handleClose();*/
      } else {
        throw new Error(`No response for file`);
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error; // 에러를 상위로 전달
    } finally {
      setLoading(false);
    }
  };
  const handleOptionSelect = (key: keyof typeof selectedOptions, index: number) => {
    setSelectedOptions(prev => ({
      ...prev,
      [key]: index,
    }));
  };

  const handleImageToggle = (image: string) => {
    setFullscreenImage(fullscreenImage === image ? null : image); // Toggle full-screen image
  };

  const handleClothesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= maxLength) {
      setClothesInputValue(e.target.value);
    }
  };

  // Effects
  useEffect(() => {
    if (stepperRef.current) {
      const currentStepElement = stepperRef.current.querySelector(`.MuiStep-horizontal:nth-child(${activeStep + 1})`);
      if (currentStepElement) {
        currentStepElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest', // 요소가 중앙에 오도록 스크롤
          inline: 'center',
        });
      }
    }
  }, [activeStep]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 1: Select Gender</div>
            <Box className={styles.verticalButtonGroup}>
              {characterOptions.genderOptions.map((option, index) => (
                <Button
                  key={option.label}
                  variant={selectedOptions.gender === index ? 'contained' : 'outlined'}
                  startIcon={index === 0 ? <GirlIcon /> : index === 1 ? <BoyIcon /> : <TransgenderIcon />}
                  className={styles.genderButton}
                  onClick={() => handleOptionSelect('gender', index)}
                >
                  {option.label}
                </Button>
              ))}
            </Box>
          </div>
        );
      case 1:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 2: Select Style</div>
            <Box className={styles.horizontalButtonGroup}>
              {characterOptions.styleOptions.map((option, index) => (
                <CharacterCreateImageButton
                  key={option.label}
                  width={'40%'}
                  height={'30vh'}
                  label={option.label}
                  image={option.image}
                  selected={selectedOptions.style === index}
                  onClick={() => handleOptionSelect('style', index)} // Use handleImageToggle for full-screen toggle
                />
              ))}
            </Box>
          </div>
        );
      case 2:
        return (
          <div className={styles.createBox}>
            <Box className={styles.ethnicityContent}>
              <div className={styles.createTitle}>Step 3: Select Race</div>
              <Typography variant="h6">Race</Typography>
              <Swiper
                slidesPerView={4}
                spaceBetween={5}
                centeredSlides={false}
                pagination={{
                  clickable: true,
                }}
                modules={[Pagination]}
              >
                {characterOptions.raceOptions.map((race, index) => (
                  <SwiperSlide>
                    <CharacterCreateImageButton
                      key={race.label}
                      width={'100%'}
                      height={'20vh'}
                      label={race.label}
                      image={race.image}
                      selected={selectedOptions.race === index}
                      onClick={() => handleOptionSelect('race', index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              <Typography variant="h6">Age</Typography>
              <Box className={styles.horizontalButtonGroup}>
                {characterOptions.ageOptions.map((age, index) => (
                  <Button
                    key={age.label}
                    variant={selectedOptions.age === index ? 'contained' : 'outlined'}
                    className={styles.ethnicityButton}
                    onClick={() => handleOptionSelect('age', index)}
                  >
                    {age.label}
                  </Button>
                ))}
              </Box>
              <Typography variant="h6">Eye Color</Typography>
              <Box className={styles.horizontalButtonGroup}>
                {characterOptions.eyeColorOptions.map((color, index) => (
                  <Button
                    key={color.label}
                    variant={selectedOptions.eyeColor === index ? 'contained' : 'outlined'}
                    className={styles.ethnicityButton}
                    onClick={() => handleOptionSelect('eyeColor', index)}
                  >
                    {color.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </div>
        );
      case 3:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 4: Select Hair Style</div>
            <Box>
              <Typography variant="h6">Hair Style</Typography>
              <Box className={styles.gridContainer}>
                {characterOptions.hairStyles.map((style, index) => (
                  <CharacterCreateImageButton
                    key={style.label}
                    width={'100%'}
                    height={'15vh'}
                    label={style.label}
                    image={style.image}
                    selected={selectedOptions.hairStyle === index}
                    onClick={() => handleOptionSelect('hairStyle', index)}
                  />
                ))}
              </Box>
              <Typography variant="h6" style={{marginTop: '16px'}}>
                Hair Color
              </Typography>
              <Box className={styles.horizontalButtonGroup}>
                {characterOptions.hairColors.map((color, index) => (
                  <Button
                    key={color.label}
                    variant={selectedOptions.hairColor === index ? 'contained' : 'outlined'}
                    onClick={() => handleOptionSelect('hairColor', index)}
                    className={styles.colorButton}
                  >
                    {color.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </div>
        );
      case 4:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 5: Select Body Shape</div>
            <Box className={styles.bodyContent}>
              <Typography variant="h6">Body Type</Typography>
              <Box className={styles.gridContainer}>
                {characterOptions.bodyTypes.map((style, index) => (
                  <CharacterCreateImageButton
                    key={style.label}
                    width={'100%'}
                    height={'12vh'}
                    label={style.label}
                    image={style.image}
                    selected={selectedOptions.bodyType === index}
                    onClick={() => handleOptionSelect('bodyType', index)}
                  />
                ))}
              </Box>
              {selectedOptions.gender === 0 && (
                <>
                  <Typography variant="h6">Top Size</Typography>
                  <Box className={styles.gridContainer}>
                    {characterOptions.topSizes.map((style, index) => (
                      <CharacterCreateImageButton
                        key={style.label}
                        width={'100%'}
                        height={'15vh'}
                        label={style.label}
                        image={style.image}
                        selected={selectedOptions.topSize === index}
                        onClick={() => handleOptionSelect('topSize', index)}
                      />
                    ))}
                  </Box>
                  <Typography variant="h6">Bottom Size</Typography>
                  <Box className={styles.gridContainer}>
                    {characterOptions.bottomSizes.map((style, index) => (
                      <CharacterCreateImageButton
                        key={style.label}
                        width={'100%'}
                        height={'15vh'}
                        label={style.label}
                        image={style.image}
                        selected={selectedOptions.bottomSize === index}
                        onClick={() => handleOptionSelect('bottomSize', index)}
                      />
                    ))}
                  </Box>
                </>
              )}
            </Box>
          </div>
        );
      case 5:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 6: Select Outfit Clothes</div>
            <Box className={styles.bodyContent}>
              <Swiper
                slidesPerView={4} // 한 번에 표시되는 슬라이드 개수
                spaceBetween={5} // 슬라이드 간격
                centeredSlides={false} // 슬라이드 중앙 정렬 여부
                style={{pointerEvents: customClothesActive ? 'none' : 'auto', opacity: customClothesActive ? 0.5 : 1}}
              >
                {characterOptions.clothing.map((style, index) => (
                  <SwiperSlide key={index}>
                    <CharacterCreateImageButton
                      key={style.label}
                      width={'100%'}
                      height={'20vh'}
                      label={style.label}
                      image={style.image}
                      selected={selectedOptions.clothing === index}
                      onClick={() => handleOptionSelect('clothing', index)}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <br />
              <Box
                className={styles.horizontalButtonGroup}
                style={{pointerEvents: customClothesActive ? 'none' : 'auto', opacity: customClothesActive ? 0.5 : 1}}
              >
                {characterOptions.clothingColor.map((style, index) => (
                  <Button
                    key={index}
                    variant={selectedOptions.clothingColor === index ? 'contained' : 'outlined'}
                    className={styles.colorButton}
                    onClick={() => handleOptionSelect('clothingColor', index)}
                    style={{fontSize: 10}}
                  >
                    {style.label}
                  </Button>
                ))}
              </Box>
              {/* Custom Setup Accordion */}
              <Accordion expanded={customClothesActive} onChange={handleCustomToggle}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="custom-setup-content"
                  id="custom-setup-header"
                >
                  <Typography>Custom Setup</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TextField
                    label="Custom Outfit"
                    variant="outlined"
                    fullWidth
                    value={clothesInputValue}
                    onChange={handleClothesInputChange}
                  />
                </AccordionDetails>
              </Accordion>
            </Box>
          </div>
        );
      case 6:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 7: Thumbnail Background</div>
            <Box className={styles.bodyContent}>
              <Box className={styles.horizontalButtonGroup}>
                {characterOptions.background.map((style, index) => (
                  <Button
                    key={index}
                    variant={selectedOptions.background === index ? 'contained' : 'outlined'}
                    className={styles.colorButton}
                    onClick={() => handleOptionSelect('background', index)}
                    style={{fontSize: 10}}
                  >
                    {style.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </div>
        );
      case 7:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 8: Choose Personality</div>
            <Box className={styles.bodyContent}>
              <Box className={styles.horizontalButtonGroup}>
                {characterOptions.personality.map((style, index) => (
                  <Button
                    key={index}
                    variant={selectedOptions.personality === index ? 'contained' : 'outlined'}
                    className={styles.colorButton}
                    onClick={() => handleOptionSelect('personality', index)}
                    style={{fontSize: 10}}
                  >
                    {style.label}
                  </Button>
                ))}
              </Box>
            </Box>
          </div>
        );
      case 8:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 9: Summary</div>
            <Box>
              <Typography variant="h6">Summary</Typography>
              <Box className={styles.gridContainer}>
                {summaryOptions.map((option, index) => (
                  <Box key={option.key} className={styles.summaryItem}>
                    <Box
                      className={styles.summaryImage}
                      style={{
                        backgroundImage: `url(${
                          option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.image || ''
                        })`,
                        backgroundSize: 'cover',
                      }}
                    />
                    <Typography variant="subtitle1" className={styles.summaryLabel}>
                      {option.key === 'clothing' && customClothesActive
                        ? 'Custom'
                        : `${option.label}: ${
                            option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.label || 'N/A'
                          }`}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            {customClothesActive && (
              <Typography variant="subtitle1" className={styles.summaryClothes}>
                Clothes: {clothesInputValue}
              </Typography>
            )}
          </div>
        );
      case 9:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 10: Choose Generated Image</div>
            <Box>
              <Box className={styles.gridContainer2}>
                {generatedOptions.map((option, index) => (
                  <CharacterCreateImageButton
                    key={index}
                    width={'95%'}
                    height={'23vh'}
                    label={''}
                    image={option.url}
                    selected={selectedOptions.result === index}
                    onClick={() =>
                      selectedOptions.result === index
                        ? handleImageToggle(option.url)
                        : handleOptionSelect('result', index)
                    }
                  />
                ))}
              </Box>

              <Button onClick={() => handleGenerate()} className={styles.colorButton}>
                Regenerate
              </Button>
            </Box>
          </div>
        );
      case 10:
        return (
          <div className={styles.createBox}>
            <PublishCharacter url={generatedOptions[selectedOptions.result].url} />
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  const renderBottom = () => {
    return (
      <>
        {activeStep < steps.length - 1 && (
          <>
            <Button className={styles.stepButton} variant="outlined" onClick={handlePrev} disabled={activeStep === 0}>
              Prev
            </Button>

            <Button className={styles.stepButton} variant="contained" onClick={handleNext}>
              {steps[activeStep] === 'Summary'
                ? generatedOptions.length === 0 /* 이미 생성된 후에는 Regenerate 버튼으로 수정 가능 */
                  ? 'Next (Generate)'
                  : 'Next (isGenerated)'
                : 'Next'}
            </Button>
          </>
        )}
      </>
    );
  };

  return (
    <Box className={styles.container}>
      <LoadingOverlay loading={loading} />
      <Typography variant="h5" className={styles.title}>
        Create My Character
      </Typography>

      <Box className={styles.stepperContainer} ref={stepperRef}>
        <Stepper activeStep={activeStep} alternativeLabel className={styles.stepper}>
          {steps.map((label, index) => {
            const labelProps: {
              optional?: React.ReactNode;
              error?: boolean;
            } = {};
            if (isStepFailed(index)) {
              labelProps.optional = (
                <Typography variant="caption" color="error">
                  Alert message
                </Typography>
              );
              labelProps.error = true;
            }

            return (
              <Step key={label} className={styles.stepItem}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>

      <Box className={styles.stepContent}>{getStepContent(activeStep)}</Box>

      <Box className={styles.buttonContainer}>{renderBottom()}</Box>

      {fullscreenImage && (
        <Box
          className={styles.fullscreenOverlay}
          onClick={() => setFullscreenImage(null)} // Close full-screen on overlay click
          sx={{
            flexGrow: 1,
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url(${fullscreenImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            width: '100%',
          }}
        ></Box>
      )}
    </Box>
  );
};

export default CharacterCreate;