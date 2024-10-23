import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, Stepper, Step, StepLabel, Typography, LinearProgress, TextField} from '@mui/material';
import styles from './CharacterCreate.module.css';
import GirlIcon from '@mui/icons-material/Female';
import BoyIcon from '@mui/icons-material/Male';

import characterOptionsMaleReal from '@/data/create/create-character-male-anime.json';
import characterOptionsFeMaleReal from '@/data/create/create-character-female-anime.json';
import characterOptionsMaleAnime from '@/data/create/create-character-male-anime.json';
import characterOptionsFeMaleAnime from '@/data/create/create-character-female-anime.json';
import CharacterCreateImageButton from './CharacterCreateImageButton';
// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import {Pagination} from 'swiper/modules';
import {GenerateImageReq, sendGenerateImageReq} from '@/app/NetWork/ImageNetwork';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

interface Props {}

const CharacterCreate: React.FC<Props> = () => {
  const [activeStep, setActiveStep] = useState(0);
  const stepperRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.user.userId);
  const [characterOptions, setCharacterOptions] = useState(characterOptionsFeMaleReal);

  const steps = ['Gender', 'Style', 'Ethnicity', 'HairStyle', 'BodyShape', 'OutfitClothes', 'Summary'];
  const genderOptions = [
    {label: 'Girls', icon: <GirlIcon />},
    {label: 'Guys', icon: <BoyIcon />},
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
  });

  // gender 0 Male / 1 Female, style 0 Real / 1 Anime

  useEffect(() => {
    // Define character options based on gender and style selection
    const newCharacterOptions =
      selectedOptions.gender === 0
        ? selectedOptions.style === 0
          ? characterOptionsFeMaleReal
          : characterOptionsFeMaleAnime
        : selectedOptions.style === 0
        ? characterOptionsMaleReal
        : characterOptionsMaleAnime;

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
  ];

  // Handler
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

  const handleGenerate = () => {
    const genderPrompt = selectedOptions.gender === 0 ? 'Female' : 'Male';
    const prompts = [
      genderPrompt,
      ...summaryOptions.map(option => {
        const selectedIndex = selectedOptions[option.key as keyof typeof selectedOptions];
        const selectedOption = option.options[selectedIndex];

        return selectedOption?.prompt || 'N/A';
      }),
      clothesInputValue || 'No clothes description provided',
    ].join(', ');

    console.log('Generated Prompt:', prompts);

    GetImageGenerateImage(prompts);
  };

  const GetImageGenerateImage = async (prompt: string) => {
    setLoading(true);

    try {
      const req: GenerateImageReq = {userId: userId, imagePrompt: prompt};
      const response = await sendGenerateImageReq(req);

      if (response?.data) {
        const imgUrl: string = response.data;
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
              {genderOptions.map((option, index) => (
                <Button
                  key={option.label}
                  variant={selectedOptions.gender === index ? 'contained' : 'outlined'}
                  startIcon={option.icon}
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
                  width={'40vw'}
                  height={'40vw'}
                  label={option.label}
                  image={'/Images/001.png'}
                  selected={selectedOptions.style === index}
                  onClick={() => handleOptionSelect('style', index)}
                />
              ))}
            </Box>
          </div>
        );
      case 2:
        return (
          <div className={styles.createBox}>
            <Box className={styles.ethnicityContent}>
              <div className={styles.createTitle}>Step 3: Select Ethnicity</div>
              <Typography variant="h6">Race</Typography>
              <Swiper
                slidesPerView={4}
                spaceBetween={30}
                centeredSlides={true}
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
                      height={'40vw'}
                      label={race.label}
                      image={'/Images/001.png'}
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
                    width={'20vw'}
                    height={'20vw'}
                    label={style.label}
                    image={'/Images/001.png'}
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
              <Box className={styles.scrollableContainer}>
                {characterOptions.bodyTypes.map((style, index) => (
                  <CharacterCreateImageButton
                    key={style.label}
                    width={'20vw'}
                    height={'20vw'}
                    label={style.label}
                    image={'/Images/001.png'}
                    selected={selectedOptions.bodyType === index}
                    onClick={() => handleOptionSelect('bodyType', index)}
                  />
                ))}
              </Box>
              <Typography variant="h6">Top Size</Typography>
              <Box className={styles.scrollableContainer}>
                {characterOptions.topSizes.map((style, index) => (
                  <CharacterCreateImageButton
                    key={style.label}
                    width={'20vw'}
                    height={'20vw'}
                    label={style.label}
                    image={'/Images/001.png'}
                    selected={selectedOptions.topSize === index}
                    onClick={() => handleOptionSelect('topSize', index)}
                  />
                ))}
              </Box>
              <Typography variant="h6">Bottom Size</Typography>
              <Box className={styles.scrollableContainer}>
                {characterOptions.bottomSizes.map((style, index) => (
                  <CharacterCreateImageButton
                    key={style.label}
                    width={'20vw'}
                    height={'20vw'}
                    label={style.label}
                    image={'/Images/001.png'}
                    selected={selectedOptions.bottomSize === index}
                    onClick={() => handleOptionSelect('bottomSize', index)}
                  />
                ))}
              </Box>
            </Box>
          </div>
        );
      case 5:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 6: Select Outfit Clothes</div>
            <Box>
              <Typography variant="h6">Clothes</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={clothesInputValue}
                onChange={handleClothesInputChange}
                placeholder="Enter up to 200 characters"
                inputProps={{maxLength}}
              />
              <Typography className={styles.characterCount}>
                {clothesInputValue.length}/{maxLength} characters
              </Typography>
            </Box>
          </div>
        );
      case 6:
        return (
          <div className={styles.createBox}>
            <div className={styles.createTitle}>Step 7: Summary</div>
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
                      {option.label}:{' '}
                      {option.options[selectedOptions[option.key as keyof typeof selectedOptions]]?.label || 'N/A'}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Typography variant="subtitle1" className={styles.summaryClothes}>
              Clothes: {clothesInputValue}
            </Typography>
          </div>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box className={styles.container}>
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

      {/* <Box className={styles.progressBarContainer}>
        <LinearProgress variant="determinate" value={(activeStep / (steps.length - 1)) * 100} />
      </Box> */}

      <Box className={styles.stepContent}>{getStepContent(activeStep)}</Box>

      <Box className={styles.buttonContainer}>
        <Button className={styles.stepButton} variant="outlined" onClick={handlePrev} disabled={activeStep === 0}>
          Prev
        </Button>
        {activeStep === steps.length - 1 ? (
          <Button className={styles.stepButton} variant="contained" color="primary" onClick={handleGenerate}>
            Generate
          </Button>
        ) : (
          <Button className={styles.stepButton} variant="contained" onClick={handleNext}>
            Next
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CharacterCreate;
