import {useState, useEffect} from 'react';

// publish가 끝나고 다른곳으로 이동하기
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';

import {GenerateImageReq2, sendGenerateImageReq2} from '@/app/NetWork/ImageNetwork';

import loRaStyles from '@/data/stable-diffusion/episode-temporary-character-lora.json'; // JSON 데이터 가져오기

import styles from './CreateCharacterMain2.module.css';
import {BoldLock, BoldMixture, BoldRuby, BoldUnLock, LineAIImage, LineEdit, LineUpload} from '@ui/Icons';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {Swiper, SwiperSlide} from 'swiper/react';
import CustomButton from '@/components/layout/shared/CustomButton';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import CustomInput from '@/components/layout/shared/CustomInput';
import CharacterCreateImageButton from '../character/CreateCharacterImageButton';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';

import CharacterCreateSequence from './../character/CreateCharacterSequence';

interface CreateCharacterProps {}

const CreateCharacterMain2: React.FC<CreateCharacterProps> = () => {
  const router = useRouter();

  //#region  Thumbnail
  const [imgUrl, setImgUrl] = useState(
    'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
  );
  const [imgUploadOpen, setImgUploadOpen] = useState(false);
  //#endregion

  //#region Edit Thumbnail
  type UploadType = 'Mixture' | 'AIGenerate' | 'Upload';
  const [imgUploadType, setImgUploadType] = useState<UploadType | null>(null);

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

  const [selectedImgCount, setSelectedImgCount] = useState<number>(4);

  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [generatedImages, setGeneratedImages] = useState<string[]>(['', '', '', '']);
  const [selectedGeneratedItems, setSelectedGeneratedItems] = useState<number[]>([]);
  //#endregion

  const handleOnClose = () => {
    router.back();
  };

  const handlerPublishFinish = () => {
    pushLocalizedRoute('/studio/character', router);
  };

  const handlerSetImage = (img: string) => {
    setImgUrl(img);
    setImgUploadOpen(false);
  };

  const handleOnClickThumbnail = () => {
    setImgUploadOpen(true);
  };

  const handleSelectedLora = (index: number) => {
    setSelectedLora(index);
  };

  const handlePositivePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPositivePrompt(event.target.value);
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
      if (prevSelectedTags.includes(index)) {
        return prevSelectedTags.filter(tagIndex => tagIndex !== index);
      } else {
        return [...prevSelectedTags, index];
      }
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

  // 이미지 생성
  const handleImageGeneration = async () => {
    try {
      const selectedModel = loRaStyles.hairStyles.find(style => style.value === selectedLora);
      const modelId = selectedModel ? selectedModel.label : 'MeinaHentai'; // 선택된 모델 ID 설정

      const payload: GenerateImageReq2 = {
        modelId: modelId, // 필요한 모델 ID를 지정
        prompt: positivePrompt,
        negativePrompt: '',
        batchSize: 4, // 슬라이더 값 사용
        seed: -1, // Seed 처리
      };

      const response = await sendGenerateImageReq2(payload); // API 요청
      const newImages = (response.data?.imageUrl || []).filter(url => url.startsWith('https://'));

      // 상태도 업데이트
      setGeneratedImages(prev => [...prev, ...newImages]);
    } catch (error) {
      alert('Failed to generate images. Please try again.');
    } finally {
    }
  };

  useEffect(() => {
    if (imgUploadOpen === true) {
      setImgUploadType(null);
    }
  }, [imgUploadOpen]);

  const splitterData = [
    {
      label: 'Basic',
      preContent: '',
      content: <>BasicContent</>,
    },
    {
      label: 'LLM',
      preContent: '',
      content: <>LLM Content</>,
    },
    {
      label: 'Media',
      preContent: '',
      content: <>Media Content</>,
    },
    {
      label: 'Conversation',
      preContent: '',
      content: <>Conversation Content</>,
    },
    {
      label: 'Policy',
      preContent: '',
      content: <>Policy Content</>,
    },
  ];

  const typeOption = [
    {
      label: 'Mixture',
      type: 'Mixture' as UploadType,
    },
    {
      label: 'Generated by AI',
      type: 'AIGenerate' as UploadType,
    },
    {
      label: 'Upload',
      type: 'Upload' as UploadType,
    },
  ];

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
      label: '1girl',
    },
    {
      label: '1man',
    },
    {
      label: 'higly detailed',
    },
    {
      label: 'high resolution',
    },
    {
      label: 'high quality',
    },
    {
      label: '8k',
    },
    {
      label: 'illustration',
    },
    {
      label: 'manga',
    },
    {
      label: 'anime',
    },
    {
      label: 'cartoon',
    },
    {
      label: 'japanese anime',
    },
    {
      label: 'full body',
    },
    {
      label: 'bust shot',
    },
    {
      label: 'close up',
    },
  ];

  const renderSelectImageType = () => {
    return (
      <>
        <CreateDrawerHeader title="Create" onClose={() => setImgUploadOpen(false)} />
        <div className={styles.imageTypeArea}>
          {imgUploadType === null && (
            <div className={styles.verticalButtonGroup}>
              {typeOption.map((option, index) => (
                <button key={index} className={styles.uploadButton} onClick={() => setImgUploadType(option.type)}>
                  <div className={styles.buttonIconBack}>
                    <img
                      className={styles.buttonIcon}
                      src={index === 0 ? BoldMixture.src : index === 1 ? LineAIImage.src : LineUpload.src}
                      alt={option.label}
                    />
                  </div>
                  <div className={styles.buttonText}>{option.label}</div>
                </button>
              ))}
            </div>
          )}
          {imgUploadType === 'Mixture' && (
            <CharacterCreateSequence
              closeAction={() => {}}
              isModify={false}
              publishFinishAction={handlerPublishFinish}
              createFinishAction={handlerSetImage}
            />
          )}
          {imgUploadType === 'AIGenerate' && (
            <div className={styles.aiGenerateArea}>
              <h2 className={styles.title2}> Please select AI model used for image</h2>
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
                    <SwiperSlide className={styles.swiperSmall} style={{width: '100px', height: '100px'}}>
                      <CharacterCreateImageButton
                        key={option.label}
                        sizeType="small"
                        label={option.label}
                        image={option.image}
                        selected={selectedLora === index}
                        onClick={() => handleSelectedLora(index)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <MaxTextInput
                labelText="Please enter a describe the image you want to create."
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
                    text={tag.label}
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
                  <button className={styles.btnQuestion}>
                    <img className={styles.iconQuestion} />
                  </button>
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

              <div className={styles.generateButtonArea}>
                <div className={styles.currencyArea}></div>
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
                  </div>{' '}
                </CustomButton>
              </div>

              <div className={styles.generatedImageArea}>
                <h2 className={styles.title2}>Image generation history</h2>
                <ul className={styles.selectGrid}>
                  {generatedImages.map((image, index) => (
                    <CharacterCreateImageButton
                      sizeType="large"
                      selectType="multiple"
                      image={image}
                      label={null}
                      selected={selectedGeneratedItems.includes(index)}
                      onClick={() => {
                        handleSelectGeneratedItem(index);
                      }}
                      isImageLoading={false}
                    />
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      {!imgUploadOpen && (
        <div className={styles.characterMain}>
          <CreateDrawerHeader title="Create" onClose={handleOnClose} />
          <div className={styles.createCharacterArea}>
            <div className={styles.thumbnailArea}>
              <h2 className={styles.title2}>Thumbnail</h2>
              <div
                className={styles.thumbnailImage}
                style={{background: `url(${imgUrl}) lightgray 50% / cover no-repeat`}}
              >
                <button className={styles.editButton} onClick={handleOnClickThumbnail}>
                  <img className={styles.editIcon} src={LineEdit.src} />
                </button>
              </div>
            </div>
            <Splitters splitters={splitterData} headerStyle={{padding: '0'}} contentStyle={{padding: '0'}} />
          </div>
          <footer>
            <div className={styles.floatButtonArea}>
              <CustomButton
                size="Medium"
                type="Tertiary"
                state="Normal"
                customClassName={[styles.floatButton]}
                onClick={() => {}}
              >
                Import
              </CustomButton>
              <CustomButton
                size="Medium"
                type="Primary"
                state="Normal"
                customClassName={[styles.floatButton]}
                onClick={() => {}}
              >
                Submit
              </CustomButton>
            </div>
          </footer>
          {/* <CharacterCreateSequence closeAction={() => {}} isModify={false} publishFinishAction={handlerPublishFinish} /> */}
        </div>
      )}
      {imgUploadOpen && <>{renderSelectImageType()}</>}
    </>
  );
};

export default CreateCharacterMain2;
