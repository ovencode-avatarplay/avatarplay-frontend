import React, {useState} from 'react';
import styles from './CharacterImageSet.module.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import CharacterCreateImageButton from './CreateCharacterImageButton';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import MaxTextInput from '@/components/create/MaxTextInput';
import {inputType, inputState, displayType} from '@/components/create/MaxTextInput';
import {BoldLock, BoldMenuDots, BoldRuby, BoldStar, BoldUnLock, LineAIImage, LineScaleUp, LineUpload} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import {GenerateImageReq2, sendGenerateImageReq2} from '@/app/NetWork/ImageNetwork';
import loRaStyles from '@/data/stable-diffusion/episode-temporary-character-lora.json'; // JSON 데이터 가져오기
import LoadingOverlay from '@/components/create/LoadingOverlay';
import getLocalizedText from '@/utils/getLocalizedText';

interface CharacterImageSetProps {
  createFinishAction?: (imgUrl: string) => void;
}

const Header = 'CreateCharacter';
const Common = 'Common';

const CharacterImageSet: React.FC<CharacterImageSetProps> = ({createFinishAction}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLora, setSelectedLora] = useState<number>(0);

  const [positivePrompt, setPositivePrompt] = useState<string>('');
  const positivePlaceHolder = `Please describe the image you want to create
    ex) yellow hair a girl, walking on the beach, Wearing a blue swimsuit
    `;
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const negativePlaceHolder = `Please entr the elements you want to exclude.
    Only English is possible, and plese separate with commas. (,)
    ex) Worst quality. low quality:1.4), monochrome, zombile, (interlocked fingers)
    `;
  const [seed, setSeed] = useState<number>(-1);
  const [seedLock, setSeedLock] = useState<boolean>(false);
  let seedToolTip = `The seed is a number that plays the role of a 'starting point' in the image generation process. Just as planting a specific seed in a garden produces a unique flower, this seed value produces a unique and predictable image. If you enter the same seed value, the image generation model will generate the same image every time, and if you use a different seed value, a completely different image will be generated. If you do not enter a seed value, a random value will be used. Seed values can only be integers between -2,147,483,648 and 2,147,483,647`;

  const [selectedImgCount, setSelectedImgCount] = useState<number>(3);

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedGeneratedItems, setSelectedGeneratedItems] = useState<number[]>([]);

  const loraOption = [
    {
      label: 'Anime',
      image: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
    },
    {
      label: 'Pixar',
      image: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
    },
    {
      label: 'J-Film',
      image: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
    },
    {
      label: 'Realism',
      image: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
    },
    {
      label: 'K-Film',
      image: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
    },
    {
      label: 'Hollywood',
      image: 'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
    },
  ];

  const aiTagOption = [
    {
      label: 'common_tagprompty_onegirl',
      value: '1girl',
    },
    {
      label: 'common_tagprompty_oneman',
      value: '1man',
    },
    {
      label: 'common_tagprompty_highlydetailed',
      value: 'highly detailed',
    },
    {
      label: 'common_tagprompty_highresolution',
      value: 'high resolution',
    },
    {
      label: 'common_tagprompty_highquality',
      value: 'high quality',
    },
    {
      label: 'common_tagprompty_uhd',
      value: '8K',
    },
    {
      label: 'common_tagprompty_illustration',
      value: 'illustration',
    },
    {
      label: 'common_tagprompty_manga',
      value: 'manga',
    },
    {
      label: 'common_tagprompty_anime',
      value: 'anime',
    },
    {
      label: 'common_tagprompty_cartoon',
      value: 'cartoon',
    },
    {
      label: 'common_tagprompty_japaneseanime',
      value: 'japanese anime',
    },
    {
      label: 'common_tagprompty_fullbody',
      value: 'full body',
    },
    {
      label: 'common_tagprompty_bustshot',
      value: 'bust shot',
    },
    {
      label: 'common_tagprompty_closeup',
      value: 'close up',
    },
  ];

  const bottomButtons = [
    {
      label: 'Upscale',
      icon: LineUpload.src,
      clickEvent: () => {
        console.log('Upscale');
      },
    },
    {
      label: 'Regenerate',
      icon: LineScaleUp.src,
      clickEvent: () => {
        console.log('Regenerate');
      },
    },
    {
      label: 'Use',
      icon: LineAIImage.src,
      clickEvent: () => {
        if (createFinishAction) {
          createFinishAction(generatedImages[selectedGeneratedItems[0]]);
        }
        console.log('Use');
      },
    },
    {
      label: 'More',
      icon: BoldMenuDots.src,
      clickEvent: () => {
        console.log('More');
      },
    },
  ];

  const handlePositivePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = event.target.value;
    setPositivePrompt(newPrompt);

    // 입력된 값에 포함된 태그를 찾고 선택 상태로 변경
    const newSelectedTags = aiTagOption.reduce((selectedTags, tag, index) => {
      if (newPrompt.includes(tag.value) && !selectedTags.includes(index)) {
        selectedTags.push(index);
      }
      return selectedTags;
    }, [] as number[]);
    setSelectedTags(newSelectedTags);
  };

  const handleNegativePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNegativePrompt(event.target.value);
  };

  const handleSeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSeed = Number(event.target.value);

    // NaN 방지: 값이 유효한 숫자일 경우에만 setSeed 호출
    if (!isNaN(newSeed)) {
      setSeed(newSeed);
    }
  };

  const handleAITagSelect = (index: number) => {
    setSelectedTags(prevSelectedTags => {
      let updatedTags;

      if (prevSelectedTags.includes(index)) {
        // 태그를 선택 해제하는 경우
        updatedTags = prevSelectedTags.filter(tagIndex => tagIndex !== index);
        setPositivePrompt(prevPrompt => prevPrompt.replace(' ,' + aiTagOption[index].value, '').trim());
      } else {
        // 태그를 선택하는 경우
        updatedTags = [...prevSelectedTags, index];
        setPositivePrompt(prevPrompt => prevPrompt + ' ,' + aiTagOption[index].value);
      }

      return updatedTags;
    });
  };

  const handleSelectGeneratedItem = (index: number) => {
    setSelectedGeneratedItems(prevSelectedGeneratedItems => {
      if (prevSelectedGeneratedItems.includes(index)) {
        // 이미 선택된 아이템이면 배열에서 제거
        return prevSelectedGeneratedItems.filter(item => item !== index);
      } else {
        // 선택되지 않은 아이템이면 배열에 추가
        return [...prevSelectedGeneratedItems, index];
      }
    });
  };
  const handleSelectedLora = (index: number) => {
    setSelectedLora(index);
  };

  // 이미지 생성
  const handleImageGeneration = async () => {
    try {
      setIsLoading(true);
      const selectedModel = loRaStyles.hairStyles.find(style => style.value === selectedLora);
      const modelId = selectedModel ? selectedModel.label : 'Animagine XL'; // 선택된 모델 ID 설정

      const payload: GenerateImageReq2 = {
        modelId: modelId,
        prompt: positivePrompt,
        negativePrompt: '',
        batchSize: selectedImgCount,
        seed: seed,
      };

      const response = await sendGenerateImageReq2(payload); // API 요청
      const newImages = (response.data?.imageUrl || []).filter(url => url.startsWith('https://'));

      setGeneratedImages(prev => {
        const updatedImages = [...prev];

        // 재귀적으로 빈 자리를 찾고 대체하는 함수
        const replaceEmptyWithNewImages = (images: string[], newImages: string[]): string[] => {
          if (newImages.length === 0) return images;

          const firstEmptyIndex = images.findIndex(img => img === '');
          if (firstEmptyIndex !== -1) {
            images[firstEmptyIndex] = newImages[0];
            return replaceEmptyWithNewImages(images, newImages.slice(1));
          }

          // 빈 자리가 없으면 새로운 이미지를 더해주기
          return [...images, ...newImages];
        };

        return replaceEmptyWithNewImages(updatedImages, newImages);
      });
    } catch (error) {
      alert('Failed to generate images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.aiGenerateArea}>
      <div className={styles.titleArea}>
        <h2 className={styles.title2}>{getLocalizedText(Header, 'createcharacter011_desc_002')}</h2>
        <CustomToolTip
          tooltipText={getLocalizedText(Common, 'common_alert_004')}
          tooltipStyle={{transform: 'translateX(-75%)'}}
        ></CustomToolTip>
      </div>
      <div className={styles.loraArea}>
        <Swiper
          className={styles.horizonSwiper}
          initialSlide={selectedLora}
          centeredSlides={true}
          slidesPerView="auto"
          spaceBetween={6}
          onSlideChange={swiper => handleSelectedLora(swiper.activeIndex)}
        >
          {loraOption.map((option, index) => (
            <SwiperSlide key={option.label} className={styles.swiperSmall} style={{width: '100px', height: '100px'}}>
              <CharacterCreateImageButton
                key={option.label}
                sizeType="small"
                label={getLocalizedText(Common, option.label)}
                image={option.image}
                selected={selectedLora === index}
                onClick={() => handleSelectedLora(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <MaxTextInput
        labelText={getLocalizedText(Header, 'createcharacter011_desc_003')}
        placeholder={positivePlaceHolder}
        inputDataType={inputType.None}
        stateDataType={inputState.Normal}
        displayDataType={displayType.Label}
        promptValue={positivePrompt}
        handlePromptChange={handlePositivePromptChange}
      />
      <div className={`${styles.aiTagArea} ${styles.buttonGap6}`}>
        {aiTagOption.map((tag, index) => (
          <CustomHashtag
            key={tag.label}
            text={getLocalizedText(Common, tag.label)}
            onClickAction={() => handleAITagSelect(index)}
            isSelected={selectedTags.includes(index)}
          />
        ))}
      </div>
      <MaxTextInput
        labelText="Please enter the elements you want to exclude"
        placeholder={negativePlaceHolder}
        inputDataType={inputType.None}
        stateDataType={inputState.Normal}
        displayDataType={displayType.Label}
        promptValue={negativePrompt}
        handlePromptChange={handleNegativePromptChange}
      />
      <div className={styles.seedArea}>
        <div className={styles.seedTitleArea}>
          <h2 className={styles.title2}>Seed</h2>
          <CustomToolTip tooltipText={seedToolTip} tooltipStyle={{transform: 'translateX(-15%)'}}></CustomToolTip>
        </div>
        <div className={styles.seedInputArea}>
          <button className={styles.lockButton} onClick={() => setSeedLock(!seedLock)}>
            <img className={styles.lockIcon} src={seedLock ? BoldLock.src : BoldUnLock.src} />
          </button>
          <CustomInput
            inputType="Basic"
            textType="Label"
            value={seed}
            onChange={handleSeedChange}
            onlyNumber={true}
            disabled={seedLock}
            customClassName={[styles.seedInputBox]}
          />
        </div>
      </div>

      <div className={styles.imageCountArea}>
        <h2 className={styles.title2}>Number of images</h2>
        <div className={styles.imageCountButtons}>
          {Array.from({length: 4}, (_, index) => (
            <button
              key={index}
              className={`${styles.imageCountButton} ${selectedImgCount === index ? styles.selected : ''}`}
              onClick={() => {
                setSelectedImgCount(index);
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.currencyArea}>
        <div className={styles.currencyItem}>
          <img className={styles.currencyIcon} src={BoldRuby.src} />
          <span className={styles.currencyText}>10.5K</span>
        </div>
        <div className={styles.currencyItem}>
          <img className={styles.currencyIcon} src={BoldStar.src} />
          <span className={styles.currencyText}>100</span>
        </div>
      </div>

      <div className={styles.generateButtonArea}>
        <CustomButton
          size="Medium"
          state="Normal"
          type="Primary"
          customClassName={[styles.generateButton]}
          onClick={handleImageGeneration}
        >
          <div className={styles.costDesc}>Generate</div>
          <div className={styles.costArea}>
            <img src={BoldRuby.src} className={`${styles.costIcon} ${styles.blackIcon}`} alt="cost-icon" />
            <div className={styles.costText}>50</div>
          </div>
        </CustomButton>
      </div>

      {generatedImages.length > 0 && (
        <div className={styles.generatedImageArea}>
          <h2 className={styles.generatedImageTitle}>Image generation history</h2>
          <ul className={styles.selectGrid}>
            {generatedImages.map((image, index) => (
              <CharacterCreateImageButton
                key={index}
                sizeType="large"
                selectType="multiple"
                image={image}
                label={null}
                selected={selectedGeneratedItems.includes(index)}
                onClick={() => handleSelectGeneratedItem(index)}
                isImageLoading={false}
              />
            ))}
          </ul>

          {generatedImages.length > 0 && (
            <CustomButton
              type="Primary"
              size="Medium"
              state="Normal"
              onClick={() => {
                if (createFinishAction) {
                  createFinishAction(generatedImages[selectedGeneratedItems[0]]);
                }
              }}
            >
              Confirm
            </CustomButton>
            // <div className={styles.bottomNavTab}>
            //   <div className={styles.bottomButtonArea}>
            //     {bottomButtons.map((buttonItem, index) => (
            //       <button key={index} className={styles.bottomButton} onClick={buttonItem.clickEvent}>
            //         <img className={styles.bottomButtonIcon} src={buttonItem.icon} alt={buttonItem.label} />
            //         <div className={styles.bottomButtonText}>{buttonItem.label}</div>
            //       </button>
            //     ))}
            //   </div>
            // </div>
          )}
        </div>
      )}
      <LoadingOverlay loading={isLoading} />
    </div>
  );
};

export default CharacterImageSet;
