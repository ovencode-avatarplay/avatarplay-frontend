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
  const [loading, setLoading] = useState(false);

  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);

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
  const [generatedImages, setGeneratedImages] = useState<string[]>(['', '', '', '']); // 생성된 이미지 URL 저장
  const [createStep, setCreateStep] = useState<number>(0);

  const handleClose = () => {
    onClose();
  };

  // const handleGenerateClick = () => {
  //   switch (category) {
  //   }
  // };

  const handlePoseCreate = async () => {
    setLoading(true);
    try {
      setCreateStep(1);
      const generationData = {
        // mainImageUrl: characterInfo.mainImageUrl,
        mainImageUrl: selectedPortraitUrl,
        category: category,
        selectedImage: selectedItemIndex,
      };

      console.log('Generation Data:', generationData);

      const payload: GeneratePoseReq = {
        // url: characterInfo.mainImageUrl,
        url: selectedPortraitUrl,
        pose: selectionImages[selectedItemIndex].prompt,
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
        setGeneratedImages(prevImages => [...prevImages, ...newImages]); // 상태 업데이트
        setGeneratedImages(newImages); // 생성된 이미지 갱신
      }
    } catch (error) {
      alert('Failed to generate images. Please try again.');
      setCreateStep(0);
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
        selectedImage: selectedItemIndex,
      };

      console.log('Generation Data:', generationData);

      const payload: GenerateExpressionReq = {
        // url: characterInfo.mainImageUrl,
        url: selectedPortraitUrl,
        expression: selectionImages[selectedItemIndex].prompt,
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
        setGeneratedImages(prevImages => [...prevImages, ...newImages]); // 상태 업데이트
        setGeneratedImages(newImages); // 생성된 이미지 갱신
      }
    } catch (error) {
      alert('Failed to generate images. Please try again.');
      setCreateStep(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSelected = () => {
    let selectedItemList: string[] = selectedGeneratedItems.map(index => generatedImages[index]);

    onUploadGalleryImages(
      category,
      selectedItemList,
      category === GalleryCategory.Pose ? poseData[selectedItemIndex].prompt : ExpressionData[selectedItemIndex].prompt,
    );
    //TODO 선택된 아이템 업로드 해서 Character Gallery 갱신
  };

  useEffect(() => {
    if (category === GalleryCategory.Pose) setSelectionImages(poseData);
    else if (category === GalleryCategory.Expression) setSelectionImages(ExpressionData);
    else {
      console.log('Err');
    }
  }, [category]);

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

  return (
    <div className={styles.container}>
      {createStep === 0 ? (
        <div className={styles.editArea}>
          <div className={styles.basePortraitArea}>
            <h2 className={styles.title}>Base Portrait</h2>
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

              {/* 기능 기획이 없는 버튼 */
              /* <CustomButton size="Small" type="Tertiary" state="Normal">
                Change
              </CustomButton> */}
            </div>
          </div>

          {/* Swiper Section */}
          <div className={styles.swiperSection}>
            <h2 className={styles.title}>Select {galleryCategoryText[category]}</h2>
            <Swiper
              spaceBetween={6}
              slidesPerView="auto"
              centeredSlides={true}
              onSlideChange={swiper => setSelectedItemIndex(swiper.activeIndex)} // 슬라이드 변경 시 활성화된 인덱스 업데이트
              onSwiper={swiper => setSelectedItemIndex(swiper.activeIndex)} // Swiper 초기화 시 활성화된 인덱스 설정
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
                    className={`${styles.swiperItem}  ${selectedItemIndex === index ? styles.selected : ''}`}
                    style={{
                      backgroundImage:
                        selectedItemIndex === index
                          ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${data.image})`
                          : `url(${data.image})`,
                    }}
                  >
                    {selectedItemIndex === index && <img className={styles.checkIcon} src={LineCheck.src} />}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      ) : (
        <div className={styles.selectArea}>
          <div className={styles.selectDesc}>Choose photo(s) to add. Multiple choose available</div>
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
        </div>
      )}

      <div className={styles.generateSection}>
        {createStep === 0 ? (
          <CustomButton
            size="Large"
            state="Normal"
            type="Primary"
            onClick={category === GalleryCategory.Pose ? handlePoseCreate : handleExpressionCreate}
            customClassName={[styles.generateButton]}
          >
            Generate
            <div className={styles.currency}>
              <img src={BoldRuby.src} />
              <div>50</div>
            </div>
          </CustomButton>
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
                  Previous
                </CustomButton>
                <CustomButton
                  size="Large"
                  state="Normal"
                  type="Tertiary"
                  onClick={handleExpressionCreate}
                  customClassName={[styles.selectButton]}
                >
                  <div className={styles.regenerateContent}>
                    Regenerate
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
                  Add
                </CustomButton>
              </div>
            )}
          </>
        )}
      </div>
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default CharacterGalleryCreate;
