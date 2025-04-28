import React, {useState} from 'react';
import styles from './CharacterLevelGuage.module.css';
import ChatLevelModal from './ChatLevelModal';

interface LevelGaugeProps {
  level: number;
  exp: number; // 0~100
  canClick: boolean;
  profileImage?: string;
  bubbleText?: string;
  rewardItems?: any[];
}

const CharacterLevelGuage: React.FC<LevelGaugeProps> = ({
  level,
  exp,
  canClick,
  profileImage,
  bubbleText,
  rewardItems,
}) => {
  return (
    <>
      <div className={`${styles.levelGuageContainer}`}>
        <div className={styles.levelText}>Lv.{level}</div>
        <div className={styles.levelGauge}>
          <div
            style={{
              height: '100%',
              width: `${exp}%`,
              backgroundImage: `
              linear-gradient(
                to right,
                rgba(255, 107, 214, 0.3),
                rgba(255, 107, 214, 0.6),
                rgba(255, 107, 214, 1)
              ),
              repeating-linear-gradient(
                to right,
                rgba(255, 255, 255, 1) 0px,
                rgba(255, 255, 255, 1) 2px,
                transparent 2px,
                transparent 4px
              )
            `,
              backgroundBlendMode: 'overlay',
              borderRadius: '10px 0 0 10px',
            }}
          />
          <div
            style={{
              height: '100%',
              width: `calc(100% - ${exp}%)`,
              backgroundImage: ` 
            repeating-linear-gradient(
              to right, 
               #FFE6F8 0px,
               #FFE6F8 2px,
              transparent 2px,
              transparent 4px
            )
          `,
              backgroundBlendMode: 'overlay',
              borderRadius: '0 10px 10px 0',
            }}
          />
        </div>
        <div className={styles.levelText}>{exp}%</div>
      </div>
    </>
  );
};

export default CharacterLevelGuage;
