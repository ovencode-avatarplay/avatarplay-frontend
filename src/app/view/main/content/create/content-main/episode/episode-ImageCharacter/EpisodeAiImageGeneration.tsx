import React, {useEffect, useState} from 'react';
import styles from './EpisodeAiImageGeneration.module.css'; // CSS Module import
import {Dialog, DialogTitle, Button, Box, Typography, TextField} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {Swiper, SwiperSlide} from 'swiper/react'; // Swiper components import
import 'swiper/css'; // 기본 Swiper 스타일 가져오기
import 'swiper/css/pagination';
import loRaStyles from '@/data/stable-diffusion/episode-temporary-character-lora.json'; // JSON 데이터 가져오기
import DiamondIcon from '@mui/icons-material/Diamond';
import CollectionsIcon from '@mui/icons-material/Collections';

import Slider from '@mui/material/Slider';
import {GenerateImageReq2, sendGenerateImageReq2} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';
// Import Swiper React components

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/pagination';

import {Grid, Pagination} from 'swiper/modules';
interface EpisodeAiImageGenerationProps {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // 모달 닫기 함수
  uploadImage: (url: string) => void;
}

const EpisodeAiImageGeneration: React.FC<EpisodeAiImageGenerationProps> = ({open, closeModal, uploadImage}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0); // 선택된 index 저장
  const [selectedMainIndex, setSelectedMainIndex] = useState<number>(0); // 선택된 index 저장
  const [selectedValue, setSelectedValue] = useState<number>(1); // Number of images 선택 값
  const [generatedImages, setGeneratedImages] = useState<string[]>([]); // 생성된 이미지 URL 저장
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    const savedImages = localStorage.getItem('generatedImages');
    if (savedImages) {
      setGeneratedImages(JSON.parse(savedImages));
    }
  }, []);
  const handleSelectItem = (index: number) => {
    setSelectedIndex(index); // 선택된 index 저장
    console.log('Selected index:', index); // 콘솔에 선택된 index 출력
  };

  const handleSelectMainItem = (index: number) => {
    setSelectedMainIndex(index); // 선택된 index 저장
    console.log('Selected index:', index); // 콘솔에 선택된 index 출력
  };
  const [promptText, setPromptText] = useState<string>(
    /* currentEpisodeInfo.episodeDescription.characterDescription || '',*/ '',
  );
  const onChangePromptText = (text: string) => {
    setPromptText(text);
  };

  const [negativePrompt, setNegativePrompt] = useState<string>(
    /* currentEpisodeInfo.episodeDescription.characterDescription || '',*/ '',
  );
  const onChangeNegativePrompt = (text: string) => {
    setNegativePrompt(text);
  };

  const [seedText, setSeedText] = useState<string>(
    /* currentEpisodeInfo.episodeDescription.characterDescription || '',*/ '',
  );
  const onChangSeeedText = (text: string) => {
    console.log(text);
    setSeedText(text);
  };

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue === 'number') setSelectedValue(newValue); // 슬라이더 값 저장
  };

  const marks = [
    {value: 1, label: '1'},
    {value: 2, label: '2'},
    {value: 3, label: '3'},
    {value: 4, label: '4'},
  ];
  const handleImageGeneration = async () => {
    setLoading(true);
    try {
      const selectedModel = loRaStyles.hairStyles.find(style => style.value === selectedIndex);
      const modelId = selectedModel ? selectedModel.label : 'MeinaHentai'; // 선택된 모델 ID 설정

      const payload: GenerateImageReq2 = {
        modelId: modelId, // 필요한 모델 ID를 지정
        prompt: promptText,
        negativePrompt,
        batchSize: selectedValue, // 슬라이더 값 사용
        seed: seedText === '' ? 0 : parseInt(seedText, 10), // Seed 처리
      };

      const response = await sendGenerateImageReq2(payload); // API 요청
      const newImages = (response.data?.imageUrl || []).filter(url => url.startsWith('https://'));

      console.log(newImages);
      // 기존 로컬스토리지 값 가져오기
      addToLocalStorage(newImages);

      // 상태도 업데이트
      setGeneratedImages(prev => [...prev, ...newImages]);
    } catch (error) {
      alert('Failed to generate images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToLocalStorage = (newImages: string[]) => {
    // 기존 로컬 스토리지 데이터 가져오기
    const savedImages = JSON.parse(localStorage.getItem('generatedImages') || '[]');

    // 기존 데이터와 새 데이터를 병합
    const updatedImages = [...savedImages, ...newImages];

    // 병합된 데이터를 로컬 스토리지에 저장
    localStorage.setItem('generatedImages', JSON.stringify(updatedImages));
  };

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={closeModal}
      fullScreen
      className={styles['modal-body']}
      disableAutoFocus={true}
      disableEnforceFocus={true} // disableEnforceFocus 속성 사용
      BackdropProps={{
        style: {
          backgroundColor: 'transparent', // 배경을 완전히 투명하게 설정
        },
      }}
    >
      <DialogTitle className={styles.modalHeader}>
        <Button onClick={closeModal} className={styles['close-button']}>
          <ArrowBackIosIcon />
        </Button>
        <span className={styles['modal-title']}>AI Image Generation</span>
      </DialogTitle>

      {/* main box */}
      <Box className={styles.mainBox}>
        <div className={styles.itemBox}>
          <Typography>Select AI Model used for image generation</Typography>

          {/* Swiper 추가 */}
          <Swiper
            spaceBetween={20}
            slidesPerView={3}
            pagination={{clickable: true}}
            style={{width: '100%', marginTop: '20px'}} // 화살표 제거
          >
            {loRaStyles.hairStyles.map((hairStyle, index) => (
              <SwiperSlide key={hairStyle.value} onClick={() => handleSelectItem(index)}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer', // 선택 가능한 느낌을 주기 위한 커서 스타일
                  }}
                >
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '10px',
                      marginBottom: '8px',
                      backgroundImage: `url(${hairStyle.image})`, // backgroundImage로 설정
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: selectedIndex === index ? '2px solid blue' : 'none', // 선택된 경우 강조
                    }}
                  />
                  <Typography variant="caption">{hairStyle.label}</Typography>
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className={styles.itemBox}>
          <Typography>Prompt</Typography>

          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={promptText}
            onChange={e => onChangePromptText(e.target.value)}
          />
        </div>

        <div className={styles.itemBox}>
          <Typography>Negative Prompt</Typography>

          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={negativePrompt}
            onChange={e => onChangeNegativePrompt(e.target.value)}
          />
        </div>

        <div className={styles.itemBox}>
          <Typography>Seed</Typography>
          <TextField
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={1}
            value={seedText}
            onChange={e => {
              const value = e.target.value;

              // 입력값이 비어있다면 상태를 빈 문자열로 업데이트
              if (value === '') {
                onChangSeeedText(value);
                return;
              }

              // 1. `-` 기호만 입력된 경우 상태 업데이트
              if (value === '-') {
                onChangSeeedText(value);
                return;
              }

              // 2. 정규식으로 숫자와 음수만 허용
              if (/^-?\d*$/.test(value)) {
                // 3. 값이 32비트 정수 범위를 넘지 않도록 제한
                const parsedValue = parseInt(value, 10);

                if (
                  !isNaN(parsedValue) && // 숫자인지 확인
                  parsedValue >= -2147483648 && // 최소값
                  parsedValue <= 2147483647 // 최대값
                ) {
                  onChangSeeedText(value); // 유효한 값만 상태 업데이트
                }
              }
            }}
            helperText="Enter a number between -2,147,483,648 and 2,147,483,647 (or leave it empty)"
          />
        </div>

        <div className={styles.itemBox}>
          <Typography>Number Of Images</Typography>
          <div className={styles.itemitemBox}>
            <Box sx={{width: 300}}>
              <Slider
                value={selectedValue}
                step={1} // 한 번에 이동하는 값
                marks={marks}
                min={1}
                max={4}
                valueLabelDisplay="auto"
                onChange={handleSliderChange} // 값 변경 핸들러
                sx={{
                  marginTop: 2,
                  '& .MuiSlider-markLabel': {
                    // 마크 라벨 스타일링
                    fontSize: '14px',
                  },
                }}
              />
            </Box>
          </div>
        </div>

        <div className={styles.itemBox}>
          <div
            className={styles.itemSideGapBox}
            style={{
              gap: '50px', // 아이템 간격
            }}
          >
            <Typography>My Ruby</Typography>
            <div
              style={{
                display: 'flex',
              }}
            >
              <DiamondIcon className={styles.generateIcon} /> {/* 아이콘 스타일 적용 */}
              <Typography>99.999</Typography>
            </div>
          </div>
        </div>

        <div className={styles.itemBox}>
          <div className={styles.itemitemBox}>
            <Button
              className={styles.generateButton}
              variant="outlined"
              onClick={handleImageGeneration} // Confirm 시 선택된 index 출력
            >
              <span className={styles.generateText}>Generate</span> {/* 텍스트 스타일 적용 */}
              <DiamondIcon className={styles.generateIcon} /> {/* 아이콘 스타일 적용 */}
              <span className={styles.generateCount}>99</span> {/* 숫자 스타일 적용 */}
            </Button>
          </div>
        </div>

        <div className={styles.itemBox}>
          <div
            className={styles.itemSideGapBox}
            style={{
              gap: '70px', // 아이템 간격
              borderBottom: '1px solid #ccc', // 밑줄 추가
              paddingBottom: '8px', // 밑줄과 콘텐츠 사이 간격
            }}
          >
            <Typography>Image Output</Typography>
            <div
              style={{
                display: 'flex',
              }}
            >
              <CollectionsIcon></CollectionsIcon>
              <Typography>Gallery</Typography>
            </div>
          </div>
        </div>

        <div className={styles.itemBox}>
          <Swiper
            spaceBetween={10}
            slidesPerView={3}
            pagination={{clickable: true}}
            style={{width: '100%'}} // 화살표 제거
          >
            {generatedImages.map((image, index) => (
              <SwiperSlide key={index} onClick={() => handleSelectMainItem(index)}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer', // 선택 가능한 느낌을 주기 위한 커서 스타일
                  }}
                >
                  <div
                    style={{
                      width: '100px',
                      height: '100px',
                      borderRadius: '10px',
                      marginBottom: '8px',
                      backgroundImage: `url(${image})`, // backgroundImage로 설정
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      border: selectedMainIndex === index ? '2px solid blue' : 'none', // 선택된 경우 강조
                    }}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div
          className={styles.itemBox}
          style={{
            alignItems: 'center',
          }}
        >
          <Button
            onClick={() => {
              uploadImage(generatedImages[selectedMainIndex]);
              closeModal();
            }} // Confirm 시 선택된 index 출력
            sx={{
              m: 1,
              color: 'black',
              borderColor: 'gray',
              width: '100px',
            }}
            variant="outlined"
          >
            Confirm
          </Button>
        </div>
      </Box>

      <LoadingOverlay loading={isLoading} />
    </Dialog>
  );
};

export default EpisodeAiImageGeneration;
