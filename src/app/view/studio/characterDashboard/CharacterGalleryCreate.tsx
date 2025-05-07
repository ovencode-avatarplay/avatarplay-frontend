import React, {useEffect, useState} from 'react';
import styles from './CharacterGalleryCreate.module.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import {GalleryCategory, galleryCategoryText} from './CharacterGalleryData';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldRuby, LineArrowLeft, LineCheck, LineRegenerate} from '@ui/Icons';
import {
  GenerateExpressionReq,
  GeneratePoseReq,
  sendGenerateExpressionReq,
  sendGeneratePoseReq,
} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CharacterCreateImageButton from '../../main/content/create/character/CreateCharacterImageButton';
import MaxTextInput from '@/components/create/MaxTextInput';
import getLocalizedText from '@/utils/getLocalizedText';
import WorkroomSelectingMenu from '../workroom/WorkroomSelectingMenu';
import {useAtom} from 'jotai';
import {ToastMessageAtom} from '@/app/Root';

interface CategoryCreateProps {
  open: boolean;
  onClose: () => void;
  category: GalleryCategory;
  // characterInfo: CharacterInfo;
  selectedPortraitUrl: string;
  onUploadGalleryImages: (category: GalleryCategory, urls: string[], parameter: string) => void;
}

const CharacterGalleryCreate: React.FC<CategoryCreateProps> = ({
  open,
  onClose,
  category,
  // characterInfo,
  selectedPortraitUrl,
  onUploadGalleryImages,
}) => {
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);

  const [loading, setLoading] = useState(false);

  const [portraitPrompt, setPortraitPrompt] = useState('');
  const [posePrompt, setPosePrompt] = useState('');
  const [expressionPrompt, setExpressionPrompt] = useState('');

  const [selectedPortraitIndex, setSelectedPortraitIndex] = useState<number>(0);
  const [selectedPoseIndex, setSelectedPoseIndex] = useState<number>(0);
  const [selectedExpressionIndex, setSelectedExpressionIndex] = useState<number>(0);

  const [selectedGeneratedItems, setSelectedGeneratedItems] = useState<number[]>([]); // 선택된 아이템의 인덱스를 배열로 저장

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

  const portraitData = [
    {image: '/create_character/portrait/portrait_01_lookingforward.png', id: 1, prompt: 'looking forward'},
    {image: '/create_character/portrait/portrait_02_lookingleft.png', id: 2, prompt: 'looking left'},
    {image: '/create_character/portrait/portrait_03_lookingright.png', id: 3, prompt: 'looking right'},
  ];

  const poseData = [
    {image: '/create_character/pose/pose_01_sitaside.png', id: 1, prompt: 'sit, a side'},
    {image: '/create_character/pose/pose_02_standheadtilited.png', id: 2, prompt: 'stand, head tilted'},
    {image: '/create_character/pose/pose_03_standarchback.png', id: 3, prompt: 'stand, arch back'},
    {image: '/create_character/pose/pose_04_lyingonback.png', id: 4, prompt: 'lying, on back'},
    {image: '/create_character/pose/pose_05_sitseiza.png', id: 5, prompt: 'sit, seiza'},
    {image: '/create_character/pose/pose_06_standarmsup.png', id: 6, prompt: 'stand, arms up'},
  ];

  const ExpressionData = [
    {image: '/create_character/expression/expression_01_delight.png', id: 1, prompt: 'delight'},
    {image: '/create_character/expression/expression_02_angry.png', id: 2, prompt: 'angry'},
    {image: '/create_character/expression/expression_03_sad.png', id: 3, prompt: 'sad'},
    {image: '/create_character/expression/expression_04_excited.png', id: 4, prompt: 'excited'},
    {image: '/create_character/expression/expression_05_boring.png', id: 5, prompt: 'boring'},
  ];

  const [selectionImages, setSelectionImages] = useState(poseData);
  const [generatedImages, setGeneratedImages] = useState<string[]>(['', '', '', '']);

  const [createStep, setCreateStep] = useState<number>(0);

  const [generatedPortrait, setGeneratedPortrait] = useState<string[]>([]);
  const [generatedPose, setGeneratedPose] = useState<string[]>([]);
  const [generatedExpression, setGeneratedExpression] = useState<string[]>([]);

  //#region Handle

  const handleClose = () => {
    onClose();
  };

  const handleGenerateClick = () => {
    if (category === GalleryCategory.Pose) handlePoseCreate();
    else if (category === GalleryCategory.Expression) handleExpressionCreate();
    else if (category === GalleryCategory.Portrait) handlePortraitCreate();
    else {
      console.log('Err');
    }
  };

  const handlePoseCreate = async () => {
    setLoading(true);
    try {
      setCreateStep(1);
      const generationData = {
        // mainImageUrl: characterInfo.mainImageUrl,
        mainImageUrl: selectedPortraitUrl,
        category: category,
        selectedImage: selectedPoseIndex,
      };

      console.log('Generation Data:', generationData);

      const payload: GeneratePoseReq = {
        // url: characterInfo.mainImageUrl,
        url: selectedPortraitUrl,
        pose: selectionImages[selectedPoseIndex].prompt + ', ' + posePrompt,
        // ID : selectionImages[selectedItemIndex].id
        // Prompt : selectionImages[selectedItemIndex].prompt,
      };

      const response = await sendGeneratePoseReq(payload); // API 요청
      const newImages = response.data?.imageUrl || [
        selectedPortraitUrl,
        selectedPortraitUrl,
        selectedPortraitUrl,
        selectedPortraitUrl,
      ]; // API null 나오는경우 임시처리

      if (newImages.length > 0) {
        setGeneratedPose(prevImages => [...prevImages, ...newImages]); // 상태 업데이트
        setGeneratedPose(newImages); // 생성된 이미지 갱신
      }
    } catch (error) {
      // alert('Failed to generate images. Please try again.');
      alert('임시처리');

      const newImages = [selectedPortraitUrl, selectedPortraitUrl, selectedPortraitUrl, selectedPortraitUrl]; // API null 나오는경우 임시처리

      if (newImages.length > 0) {
        setGeneratedPose(prevImages => [...prevImages, ...newImages]); // 상태 업데이트
        setGeneratedPose(newImages); // 생성된 이미지 갱신
      }

      // setCreateStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleExpressionCreate = async () => {
    setLoading(true);
    try {
      setCreateStep(1);
      const generationData = {
        // mainImageUrl: characterInfo.mainImageUrl,
        mainImageUrl: selectedPortraitUrl,
        category: category,
        selectedImage: selectedExpressionIndex,
      };

      console.log('Generation Data:', generationData);

      const payload: GenerateExpressionReq = {
        // url: characterInfo.mainImageUrl,
        url: selectedPortraitUrl,
        expression: selectionImages[selectedExpressionIndex].prompt + ', ' + expressionPrompt,
        // ID : selectionImages[selectedItemIndex].id
        // Prompt : selectionImages[selectedItemIndex].prompt,
      };

      const response = await sendGenerateExpressionReq(payload);
      const newImages = response.data?.imageUrl || [
        selectedPortraitUrl,
        selectedPortraitUrl,
        selectedPortraitUrl,
        selectedPortraitUrl,
      ]; // API null 나오는경우 임시처리

      if (newImages.length > 0) {
        setGeneratedExpression(prevImages => [...prevImages, ...newImages]); // 상태 업데이트
        setGeneratedExpression(newImages); // 생성된 이미지 갱신
      }
    } catch (error) {
      alert('Failed to generate images. Please try again.');
      setCreateStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handlePortraitCreate = () => {
    console.log('Portrait Create');
  };

  const handleSelected = () => {
    let selectedItemList: string[] = selectedGeneratedItems.map(index => generatedImages[index]);

    onUploadGalleryImages(
      category,
      selectedItemList,
      category === GalleryCategory.Pose
        ? poseData[selectedPoseIndex].prompt
        : category === GalleryCategory.Expression
        ? ExpressionData[selectedExpressionIndex].prompt
        : portraitData[selectedPortraitIndex].prompt,
    );
    //TODO 선택된 아이템 업로드 해서 Character Gallery 갱신
  };

  const handleDownloadSelectedItems = () => {
    if (generatedImages.length === 0) return;

    const itemsToDownload = selectedGeneratedItems.map(index => generatedImages[index]);

    itemsToDownload.forEach(item => {
      const link = document.createElement('a');
      link.href = item || '';
      link.download = item || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });

    setSelectedGeneratedItems([]);

    dataToast.open(
      getLocalizedText(
        `TODO : Download ${itemsToDownload.length} item${itemsToDownload.length > 1 ? 's' : ''} successful!`,
      ),
    );
  };

  const handleMoveToFolder = () => {
    // Workroom 폴더 이동
    console.log('Move to Folder');
  };

  const handleMoveToTrash = () => {
    // Workroom 휴지통 이동
    console.log('Move to Trash');
  };

  //#endregion

  useEffect(() => {
    if (category === GalleryCategory.Pose) {
      setSelectionImages(poseData);
      setGeneratedImages(generatedPose);
    } else if (category === GalleryCategory.Expression) {
      setSelectionImages(ExpressionData);
      setGeneratedImages(generatedExpression);
    } else if (category === GalleryCategory.Portrait) {
      setSelectionImages(portraitData);
      setGeneratedImages(generatedPortrait);
    } else {
      console.log('Err');
    }

    setSelectedGeneratedItems([]);
  }, [category]);

  useEffect(() => {
    if (category === GalleryCategory.Pose) {
      setGeneratedImages(generatedPose);
    }
  }, [generatedPose]);

  useEffect(() => {
    if (category === GalleryCategory.Expression) {
      setGeneratedImages(generatedExpression);
    }
  }, [generatedExpression]);

  useEffect(() => {
    if (category === GalleryCategory.Portrait) {
      setGeneratedImages(generatedPortrait);
    }
  }, [generatedPortrait]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isSelected = (index: number) =>
    (category === GalleryCategory.Pose && selectedPoseIndex === index) ||
    (category === GalleryCategory.Expression && selectedExpressionIndex === index) ||
    (category === GalleryCategory.Portrait && selectedPortraitIndex === index);

  return (
    <div className={styles.container}>
      <div className={styles.editArea}>
        <div className={styles.basePortraitArea}>
          <h2 className={styles.title}>{getLocalizedText(`TODO : Base Portrait`)}</h2>
          <div className={styles.basePortraitItem}>
            <div
              className={styles.portraitImage}
              style={{
                // backgroundImage: `url(${characterInfo.mainImageUrl})`,
                backgroundImage: `url(${selectedPortraitUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          </div>
        </div>

        <div className={styles.promptArea}>
          <div className={styles.promptDesc}>
            {getLocalizedText(`TODO :You can select a pose, describe it yourself, or combine both! Either way, you'll get the
            Portaits you want.`)}
          </div>
          <MaxTextInput
            promptValue={
              category === GalleryCategory.Pose
                ? posePrompt
                : category === GalleryCategory.Expression
                ? expressionPrompt
                : portraitPrompt
            }
            placeholder={getLocalizedText('TODO : Prompt')}
            handlePromptChange={e => {
              if (category === GalleryCategory.Pose) setPosePrompt(e.target.value);
              else if (category === GalleryCategory.Expression) setExpressionPrompt(e.target.value);
              else if (category === GalleryCategory.Portrait) setPortraitPrompt(e.target.value);
            }}
          />
        </div>

        {/* Swiper Section */}
        <div className={styles.swiperSection}>
          <h2 className={styles.title}>{getLocalizedText(`TODO : Select ${galleryCategoryText[category]}`)}</h2>
          <Swiper
            spaceBetween={6}
            slidesPerView="auto"
            centeredSlides={false}
            // 슬라이드 변경 시 활성화된 인덱스 업데이트
            // onSlideChange={swiper => {
            //   if (category === GalleryCategory.Pose) setSelectedPoseIndex(swiper.activeIndex);
            //   else if (category === GalleryCategory.Expression) setSelectedExpressionIndex(swiper.activeIndex);
            //   else if (category === GalleryCategory.Portrait) setSelectedPortraitIndex(swiper.activeIndex);
            // }}

            initialSlide={
              category === GalleryCategory.Pose
                ? selectedPoseIndex
                : category === GalleryCategory.Expression
                ? selectedExpressionIndex
                : selectedPortraitIndex
            }
            onSwiper={swiper => {
              if (category === GalleryCategory.Pose) setSelectedPoseIndex(swiper.activeIndex);
              else if (category === GalleryCategory.Expression) setSelectedExpressionIndex(swiper.activeIndex);
              else if (category === GalleryCategory.Portrait) setSelectedPortraitIndex(swiper.activeIndex);
            }} // Swiper 초기화 시 활성화된 인덱스 설정
            className={styles.swiper}
          >
            {selectionImages.map((data, index) => (
              <SwiperSlide
                key={index}
                style={{
                  width: '138px',
                }}
              >
                <div
                  className={`${styles.swiperItem}  ${isSelected(index) ? styles.selected : ''}`}
                  style={{
                    backgroundImage: isSelected(index)
                      ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data.image})`
                      : `url(${data.image})`,
                  }}
                  onClick={() => {
                    if (category === GalleryCategory.Pose) setSelectedPoseIndex(index);
                    else if (category === GalleryCategory.Expression) setSelectedExpressionIndex(index);
                    else if (category === GalleryCategory.Portrait) setSelectedPortraitIndex(index);
                  }}
                >
                  {isSelected(index) && <img className={styles.checkIcon} src={LineCheck.src} />}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className={styles.generateSection}>
        <CustomButton
          size="Large"
          state="Normal"
          type="Primary"
          onClick={handleGenerateClick}
          customClassName={[styles.generateButton]}
        >
          Generate
          <div className={styles.currency}>
            <img src={BoldRuby.src} />
            <div>50</div>
          </div>
        </CustomButton>
        {/* {createStep === 0 ? (
          
        ) : (
          <>
            {!loading && (
              <div className={styles.buttonArea}>
                <CustomButton
                  size="Large"
                  state="IconLeft"
                  type="Tertiary"
                  onClick={() => {
                    setCreateStep(0);
                  }}
                  icon={LineArrowLeft.src}
                  customClassName={[styles.selectButton]}
                >
                  {getLocalizedText('TODO : Previous')}
                </CustomButton>
                <CustomButton
                  size="Large"
                  state="Normal"
                  type="Tertiary"
                  onClick={handleExpressionCreate}
                  customClassName={[styles.selectButton]}
                >
                  <div className={styles.regenerateContent}>
                    {getLocalizedText(`TODO : Regenerate`)}
                    <div className={styles.currency}>
                      <img className={styles.grayIcon} src={BoldRuby.src} />
                      <div>50</div>
                    </div>
                  </div>
                </CustomButton>
                <CustomButton
                  size="Large"
                  state="Normal"
                  type="Primary"
                  onClick={handleSelected}
                  customClassName={[styles.selectButton]}
                >
                  {getLocalizedText(`TODO : Add`)}
                </CustomButton>
              </div>
            )}
          </>
        )} */}
      </div>
      {createStep === 1 /* API 연동 되기 전에 임시로 0 으로 처리 */ && (
        <div className={styles.selectArea}>
          <div className={styles.selectDesc}>
            {getLocalizedText(`TODO : Choose photo(s) to add. Multiple choose available`)}
          </div>
          {
            <ul className={styles.selectGrid}>
              {generatedImages.map((image, index) => (
                <CharacterCreateImageButton
                  key={index}
                  sizeType="large"
                  selectType="multiple"
                  image={image}
                  label={null}
                  selected={selectedGeneratedItems.includes(index)}
                  onSelectClick={() => {
                    handleSelectGeneratedItem(index);
                  }}
                  isImageLoading={loading}
                />
              ))}
            </ul>
          }

          {selectedGeneratedItems.length > 0 && (
            <div className={styles.selectingMenuContainer}>
              <WorkroomSelectingMenu
                selectedCount={selectedGeneratedItems.length}
                onDownload={handleDownloadSelectedItems}
                onMoveToFolder={handleMoveToFolder}
                onMoveToTrash={handleMoveToTrash}
                onExitSelecting={() => {
                  setSelectedGeneratedItems([]);
                }}
              />
            </div>
          )}
        </div>
      )}

      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default CharacterGalleryCreate;
