import React, {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import styles from './CreateTempCharacterImage.module.css';
import {BoldRuby, LineCheck} from '@ui/Icons';
import MaxTextInput from '@/components/create/MaxTextInput';

interface StyleData {
  name: string;
  imageUrl: string;
}

interface CreateTempCharacterImageProps {
  styleData: StyleData[];
  generatePromptValue: string;
  maxGeneratePromptLength: number;
  handleGeneratePromptChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onClickGenerate: () => void;
  selectedIdx: number;
  onSelect: (idx: number) => void;
}

const CreateTempCharacterImage: React.FC<CreateTempCharacterImageProps> = ({
  styleData,
  generatePromptValue,
  maxGeneratePromptLength,
  handleGeneratePromptChange,
  onClickGenerate,
  selectedIdx,
  onSelect,
}) => {
  return (
    <>
      <div className={styles.promptArea}>
        <div className={styles.characterDesc}>
          <div className={styles.title}>CharacterPrompt</div>
          <MaxTextInput
            promptValue={generatePromptValue}
            handlePromptChange={handleGeneratePromptChange}
            maxPromptLength={maxGeneratePromptLength}
          />
        </div>
        <button className={styles.generateButton} onClick={onClickGenerate}>
          <div className={styles.buttonText}>Generate</div>
          <div className={styles.costArea}>
            <img src={BoldRuby.src} className={`${styles.costIcon} ${styles.blackIcon}`} alt="cost-icon" />
            <div className={styles.costText}>50</div>
          </div>
        </button>
      </div>
      {/* Style 선택용 Swiper */}
      <div className={styles.styleArea}>
        <div className={styles.title}>Styles</div>
        <Swiper
          slidesPerView={4.2}
          modules={[Navigation]}
          navigation={false}
          className={styles.styleSwiper}
          initialSlide={selectedIdx}
          spaceBetween={6}
        >
          {styleData.map((style, idx) => {
            const isSelected = selectedIdx === idx; // 선택 여부 확인

            return (
              <SwiperSlide key={idx} className={styles.swiperSlide} onClick={() => onSelect(idx)}>
                <div
                  className={styles.slideBackground}
                  style={{
                    backgroundImage: isSelected
                      ? `linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%), url(${style.imageUrl})`
                      : `url(${style.imageUrl})`,
                  }}
                >
                  {isSelected && <img src={LineCheck.src} className={styles.selectedIcon} alt="Selected Icon" />}
                </div>
                <div className={styles.slideText}>{style.name}</div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </>
  );
};

export default CreateTempCharacterImage;
