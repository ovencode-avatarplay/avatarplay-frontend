import React, {useEffect, useState} from 'react';
import styles from './CharacterImageSet.module.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import CharacterCreateImageButton from './CreateCharacterImageButton';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import MaxTextInput from '@/components/create/MaxTextInput';
import {inputType, inputState, displayType} from '@/components/create/MaxTextInput';
import {BoldLock, BoldRuby, BoldStar, BoldUnLock} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import {GenerateImageReq2, sendGenerateImageReq2} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import getLocalizedText from '@/utils/getLocalizedText';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {formatCurrency} from '@/utils/util-1';

interface CharacterImageSetProps {
  createFinishAction?: (imgUrl: string) => void;
  onClickPreview: (imgUrl: string) => void;
}

const Header = 'CreateCharacter';
const Common = 'Common';

const CharacterImageSet: React.FC<CharacterImageSetProps> = ({createFinishAction, onClickPreview}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLora, setSelectedLora] = useState<number>(0);

  const [positivePrompt, setPositivePrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');

  const [seed, setSeed] = useState<number>(-1);
  const [seedLock, setSeedLock] = useState<boolean>(false);
  const [selectedImgCount, setSelectedImgCount] = useState<number>(3);

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [selectedGeneratedItems, setSelectedGeneratedItems] = useState<number[]>([]);

  const [swiper, setSwiper] = useState<any | null>(null);
  const [isCentered, setIsCentered] = useState<boolean>(false);

  const [centerThreshold, setCenterThreshold] = useState(Math.round(window.innerWidth / 116));

  const [selectAlertOpen, setSelectAlertOpen] = useState<boolean>(false);

  const dataStarInfo = useSelector((state: RootState) => state.starInfo);
  const starAmount = dataStarInfo.star;

  const loraOption = [
    {
      label: 'XBrush Pro',
      image: 'https://simplegen-model-image.s3.ap-northeast-2.amazonaws.com/Junggernaut/.jpg',
      model: 'XB Pro v1',
    },
    {
      label: 'Anime XL',
      image: 'https://simplegen-model-image.s3.ap-northeast-2.amazonaws.com/Animagine+XL/.jpg',
      model: 'AAM XL',
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

  // const bottomButtons = [
  //   {
  //     label: 'Upscale',
  //     icon: LineUpload.src,
  //     clickEvent: () => {
  //       console.log('Upscale');
  //     },
  //   },
  //   {
  //     label: 'Regenerate',
  //     icon: LineScaleUp.src,
  //     clickEvent: () => {
  //       console.log('Regenerate');
  //     },
  //   },
  //   {
  //     label: 'Use',
  //     icon: LineAIImage.src,
  //     clickEvent: () => {
  //       if (createFinishAction) {
  //         createFinishAction(generatedImages[selectedGeneratedItems[0]]);
  //       }
  //       console.log('Use');
  //     },
  //   },
  //   {
  //     label: 'More',
  //     icon: BoldMenuDots.src,
  //     clickEvent: () => {
  //       console.log('More');
  //     },
  //   },
  // ];

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
        setPositivePrompt(prevPrompt => {
          const tagToRemove = aiTagOption[index].value;
          let updatedPrompt = prevPrompt;

          updatedPrompt = updatedPrompt
            .replace(new RegExp(`(^|, )${tagToRemove}(, |$)`, 'g'), ', ')
            .replace(/^, |, $/g, '')
            .trim();

          return updatedPrompt.length === 0 ? '' : updatedPrompt;
        });
      } else {
        // 태그를 선택하는 경우
        updatedTags = [...prevSelectedTags, index];
        setPositivePrompt(prevPrompt =>
          prevPrompt.length === 0 ? aiTagOption[index].value : prevPrompt + ', ' + aiTagOption[index].value,
        );
      }

      return updatedTags;
    });
  };

  const handleViewImage = (imgUrl: string) => {
    onClickPreview(imgUrl);
  };

  const handleSelectGeneratedItem = (index: number) => {
    // 실장님 요청으로 하나만 선택하도록 변경 0325
    const tmpItem = [index];
    setSelectedGeneratedItems(tmpItem);

    // setSelectedGeneratedItems(prevSelectedGeneratedItems => {
    //   if (prevSelectedGeneratedItems.includes(index)) {
    //     // 이미 선택된 아이템이면 배열에서 제거
    //     return prevSelectedGeneratedItems.filter(item => item !== index);
    //   } else {
    //     // 선택되지 않은 아이템이면 배열에 추가
    //     return [...prevSelectedGeneratedItems, index];
    //   }
    // });
  };
  const handleSelectedLora = (index: number) => {
    setSelectedLora(index);
    setIsCentered(index >= centerThreshold);
  };

  // 이미지 생성
  const handleImageGeneration = async () => {
    try {
      setIsLoading(true);
      const modelId = loraOption[selectedLora]; // 선택된 모델 ID 설정
      const tmpSeed = seedLock ? seed : Math.floor(Math.random() * 2100000000);
      setSeed(tmpSeed);

      const payload: GenerateImageReq2 = {
        modelId: modelId.model,
        prompt: positivePrompt,
        negativePrompt: negativePrompt,
        batchSize: selectedImgCount + 1,
        seed: tmpSeed,
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
          return [...newImages, ...images];
        };

        return replaceEmptyWithNewImages(updatedImages, newImages);
      });
    } catch (error) {
      alert('Failed to generate images. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const updateThreshold = () => {
      setCenterThreshold(Math.round(window.innerWidth / 116));
    };

    updateThreshold();

    window.addEventListener('resize', updateThreshold);

    return () => {
      window.removeEventListener('resize', updateThreshold);
    };
  }, []);

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(selectedLora, 300);
    }
  }, [selectedLora, swiper]);

  const handleSwiperInit = (swiperInstance: any) => {
    setSwiper(swiperInstance);
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
          centeredSlides={isCentered}
          slidesPerView="auto"
          spaceBetween={6}
          onSlideChange={
            swiper => setIsCentered(false)
            // handleSelectedLora(swiper.activeIndex)
          }
          onSwiper={handleSwiperInit}
        >
          {loraOption.map((option, index) => (
            <SwiperSlide key={option.label} className={styles.swiperSmall} style={{width: '100px', height: '100px'}}>
              <CharacterCreateImageButton
                key={option.label}
                sizeType="small"
                label={option.label}
                image={option.image}
                selected={selectedLora === index}
                onSelectClick={() => handleSelectedLora(index)}
                skipLocalize={true}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <MaxTextInput
        labelText={getLocalizedText(Header, 'createcharacter011_desc_003')}
        placeholder={getLocalizedText(Common, 'common_sample_071')}
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
        labelText={getLocalizedText(Header, 'createcharacter011_desc_004')}
        placeholder={getLocalizedText(Common, 'common_sample_075')}
        inputDataType={inputType.None}
        stateDataType={inputState.Normal}
        displayDataType={displayType.Label}
        promptValue={negativePrompt}
        handlePromptChange={handleNegativePromptChange}
      />
      <div className={styles.seedArea}>
        <div className={styles.seedTitleArea}>
          <h2 className={styles.title2}>{getLocalizedText(Header, 'createcharacter011_label_005')}</h2>
          <CustomToolTip
            tooltipText={getLocalizedText(Common, 'common_alert_061')}
            tooltipStyle={{transform: 'translateX(-15%)'}}
          ></CustomToolTip>
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
        <h2 className={styles.title2}>{getLocalizedText(Header, 'createcharacter011_label_006')}</h2>
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
          <span className={styles.currencyText}>10.5K</span> {/* TODO : Currency */}
        </div>
        <div className={styles.currencyItem}>
          <img className={styles.currencyIcon} src={BoldStar.src} />
          <span className={styles.currencyText}>{formatCurrency(starAmount)}</span> {/* TODO : Currency */}
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
          <div className={styles.costDesc}>{getLocalizedText(Common, 'common_button_generate')}</div>
          <div className={styles.costArea}>
            <img src={BoldRuby.src} className={`${styles.costIcon} ${styles.blackIcon}`} alt="cost-icon" />
            <div className={styles.costText}>50</div> {/* TODO : Currency */}
          </div>
        </CustomButton>
      </div>

      {generatedImages.length > 0 && (
        <div className={styles.generatedImageArea}>
          <h2 className={styles.generatedImageTitle}>{getLocalizedText(Header, 'createcharacter012_label_001')}</h2>
          <ul className={styles.selectGrid}>
            {generatedImages.map((image, index) => (
              <CharacterCreateImageButton
                key={index}
                sizeType="large"
                selectType="one"
                selectButtonType="button"
                image={image}
                label={null}
                selected={selectedGeneratedItems.includes(index)}
                onSelectClick={() => handleSelectGeneratedItem(index)}
                onImageClick={() => handleViewImage(generatedImages[index])}
                isImageLoading={false}
              />
            ))}
          </ul>

          {generatedImages.length > 0 && (
            <CustomButton
              type="Primary"
              size="Medium"
              state="Normal"
              isDisabled={selectedGeneratedItems.length == 0}
              onClick={() => {
                if (createFinishAction) {
                  createFinishAction(generatedImages[selectedGeneratedItems[0]]);
                }
              }}
            >
              {getLocalizedText(Common, 'common_button_confirm')}
            </CustomButton>
          )}
        </div>
      )}
      <LoadingOverlay loading={isLoading} />
    </div>
  );
};

export default CharacterImageSet;
