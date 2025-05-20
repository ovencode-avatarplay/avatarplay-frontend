import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import styles from './CharacterGalleryViewer.module.css';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {GalleryCategory} from './CharacterGalleryData';
import {GalleryImageInfo, SelectImageReq, sendSelectImage} from '@/app/NetWork/CharacterNetwork';
import {BoldMenuDots, LineArrowLeft, LineDelete, LineInfo, LinePin, LineShare} from '@ui/Icons';
import CustomPopup from '@/components/layout/shared/CustomPopup';

interface CharacterGalleryViewerProps {
  characterInfo: CharacterInfo;
  selectedIndex: number | null;
  categoryType: GalleryCategory;
  onBack: () => void;
  onDelete: () => void;
  onSelectImage: (category: GalleryCategory, index: number) => void;
  onRefresh: () => void;
}

const CharacterGalleryViewer: React.FC<CharacterGalleryViewerProps> = ({
  characterInfo,
  selectedIndex,
  categoryType,
  onBack,
  onDelete,
  onSelectImage,
  onRefresh,
}) => {
  const [currentBackground, setCurrentBackground] = useState<string>(characterInfo.mainImageUrl);
  const [imageUrls, setImageUrls] = useState<GalleryImageInfo[]>([]);
  const [currentInfo, setCurrentInfo] = useState<string>('');
  const [infoOpen, setInfoOpen] = useState<boolean>(false);

  // Function
  function getImageUrls(info: CharacterInfo, type: GalleryCategory) {
    let tmp: GalleryImageInfo[] = [];
    switch (type) {
      case GalleryCategory.All:
        tmp = [
          ...(info.portraitGalleryImageUrl || []),
          ...(info.poseGalleryImageUrl || []),
          ...(info.expressionGalleryImageUrl || []),
        ];
        break;

      case GalleryCategory.Portrait:
        tmp = info.portraitGalleryImageUrl || [];
        break;

      case GalleryCategory.Pose:
        tmp = info.poseGalleryImageUrl || [];
        break;

      case GalleryCategory.Expression:
        tmp = info.expressionGalleryImageUrl || [];
        break;

      default:
        console.error(`Unknown category type: ${type}`);
    }
    return tmp;
  }

  const closeInfo = () => {
    setInfoOpen(false);
  };

  // Hooks
  useEffect(() => {
    setImageUrls(getImageUrls(characterInfo, categoryType));
  }, [characterInfo, categoryType]);

  useEffect(() => {
    if (imageUrls != null && imageUrls.length > 0 && selectedIndex !== null) {
      setCurrentBackground(imageUrls[selectedIndex].imageUrl);
      setCurrentInfo(imageUrls[selectedIndex].debugParameter);
      onSelectImage(categoryType, selectedIndex);
    }
  }, [imageUrls, selectedIndex]);

  // Handler
  const handleSwipeChange = (swiper: any) => {
    if (imageUrls.length > 0) {
      const newIndex = swiper.activeIndex;
      setCurrentBackground(imageUrls[newIndex].imageUrl);
      onSelectImage(categoryType, newIndex);
    }
  };

  const handleOnShare = () => {
    if (imageUrls && selectedIndex !== null && imageUrls[selectedIndex]) {
      const imageUrl = imageUrls[selectedIndex].imageUrl;

      navigator.clipboard
        .writeText(imageUrl)
        .then(() => {
          console.log('Image URL copied to clipboard:', imageUrl);
          alert('Image URL copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy URL to clipboard:', err);
          alert('Failed to copy URL. Please try again.');
        });
    } else {
      console.error('No valid image URL found for the current selection.');
      alert('No image URL available to copy.');
    }
  };

  const handleOnThumbnail = async () => {
    if (selectedIndex !== null) {
      const payload: SelectImageReq = {
        characterImageId: imageUrls[selectedIndex].galleryImageId,
      };

      try {
        // API 호출
        const response = await sendSelectImage(payload);

        if (response) {
          alert(`캐릭터 썸네일이 변경되었습니다.`);
          onRefresh();
        }
      } catch (error) {
        console.error('Error select Image:', error);
      }
    }
  };

  const handleOnInfo = () => {
    setInfoOpen(true);
  };

  return (
    <div className={styles.viewerContainer} onClick={() => infoOpen && closeInfo()}>
      <div
        className={styles.imageArea}
        style={{
          backgroundImage: `url(${currentBackground})`,
          background: 'cover',
        }}
      >
        <div className={styles.topNavArea}>
          <button onClick={onBack} className={styles.topNavBackButton}>
            <img className={styles.buttonIconBack} src={LineArrowLeft.src} />
          </button>

          <button className={styles.topNavButton}>
            <img className={styles.buttonIcon} src={BoldMenuDots.src} />
          </button>
        </div>

        <div className={styles.swiperArea}>
          <div className={styles.swiperCounter}>
            {' '}
            {selectedIndex === null ? 0 : selectedIndex + 1} / {imageUrls.length}{' '}
          </div>
          <Swiper
            initialSlide={selectedIndex ?? 0}
            slidesPerView="auto"
            spaceBetween={5}
            centeredSlides={true}
            onSlideChange={handleSwipeChange}
            className={styles.swiperContainer}
          >
            {imageUrls.map((url, index) => (
              <SwiperSlide key={index} style={{width: '31.452px', height: '50px'}}>
                <div
                  className={styles.swiperItem}
                  style={{
                    backgroundImage: `url(${url.imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Control Area */}
      <div className={styles.controlArea}>
        {/* Control Button Area */}
        <div className={styles.controlButtonArea}>
          <button onClick={handleOnShare} className={styles.controlButton}>
            <img className={styles.controlButtonIcon} src={LineShare.src} />
            <div className={styles.controlButtonText}>Share</div>
          </button>
          <button onClick={handleOnThumbnail} className={styles.controlButton}>
            <img className={styles.controlButtonIcon} src={LinePin.src} />
            <div className={styles.controlButtonText}>Thumbnail</div>
          </button>
          <button onClick={handleOnInfo} className={styles.controlButton}>
            <img className={styles.controlButtonIcon} src={LineInfo.src} />
            <div className={styles.controlButtonText}>Info</div>
          </button>
          <button onClick={onDelete} className={styles.controlButton}>
            <img className={styles.controlButtonIcon} src={LineDelete.src} />
            <div className={styles.controlButtonText}>Delete</div>
          </button>
        </div>
      </div>
      {/* Info Popup */}
      {infoOpen && selectedIndex !== null && (
        <CustomPopup
          title="Info"
          type="alert"
          buttons={[
            {
              label: 'Ok',
              onClick: () => {
                setInfoOpen(false);
              },
              isPrimary: true,
            },
          ]}
          description={currentInfo || 'No promptParameter available'}
        />
      )}
    </div>
  );
};

export default CharacterGalleryViewer;
