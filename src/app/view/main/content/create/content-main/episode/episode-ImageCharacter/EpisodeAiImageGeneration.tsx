import React, {useState} from 'react';
import styles from './EpisodeAiImageGeneration.module.css'; // CSS Module import
import {Dialog, DialogTitle, Button, Box, Typography, TextField} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {Swiper, SwiperSlide} from 'swiper/react'; // Swiper components import
import 'swiper/css'; // 기본 Swiper 스타일 가져오기
import 'swiper/css/pagination';
import loRaStyles from '@/data/create/episode-temporary-character-lora.json'; // JSON 데이터 가져오기

interface EpisodeAiImageGenerationProps {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // 모달 닫기 함수
}

const EpisodeAiImageGeneration: React.FC<EpisodeAiImageGenerationProps> = ({open, closeModal}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null); // 선택된 index 저장

  const handleSelectItem = (index: number) => {
    setSelectedIndex(index); // 선택된 index 저장
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
    setSeedText(text);
  };
  const [selectedToggle, setSelectedToggle] = useState<number>(1); // 선택된 토글 숫자 저장
  const handleToggleSelect = (value: number) => {
    setSelectedToggle(value); // 선택된 숫자를 저장
    console.log('Selected Toggle:', value); // 콘솔에 선택된 숫자 출력
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
      <DialogTitle className={styles['modal-header']}>
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
            spaceBetween={10}
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
            rows={3}
            value={seedText}
            onChange={e => onChangSeeedText(e.target.value)}
          />
        </div>

        <div className={styles.itemBox}>
          <Typography>Number Of Images</Typography>
          <div className={styles.itemitemBox}>
            {[1, 2, 3, 4].map(num => (
              <Button
                key={num}
                variant={selectedToggle === num ? 'contained' : 'outlined'} // 선택된 버튼 스타일 변경
                sx={{
                  margin: '5px',
                  minWidth: '40px',
                  minHeight: '40px',
                  borderColor: selectedToggle === num ? 'blue' : 'gray',
                  color: selectedToggle === num ? 'white' : 'black',
                  backgroundColor: selectedToggle === num ? 'blue' : 'transparent',
                }}
                onClick={() => handleToggleSelect(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      </Box>

      <Box
        sx={{
          display: 'flex', // Flexbox 활성화
          justifyContent: 'center', // 가로 중앙 정렬
          alignItems: 'center', // 세로 중앙 정렬
        }}
        className={styles.buttonBox}
      >
        <Button
          sx={{
            m: 1,
            color: 'black',
            borderColor: 'gray',
            width: '100px',
          }}
          variant="outlined"
          onClick={() => console.log('Final selected index:', selectedIndex)} // Confirm 시 선택된 index 출력
        >
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};

export default EpisodeAiImageGeneration;
