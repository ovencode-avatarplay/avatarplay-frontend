import React, {useState} from 'react';
import styles from './CharacterLevelGuage.module.css';
import {ChatGrade, ChatLevelInfo} from '../MainChat/ChatTypes';
interface LevelGaugeProps {
  levelInfo: ChatLevelInfo | null;
  canClick: boolean;
  profileImage?: string;
  bubbleText?: string;
  rewardItems?: any[];
}

const CharacterLevelGuage: React.FC<LevelGaugeProps> = ({
  levelInfo,
  canClick,
  profileImage,
  bubbleText,
  rewardItems,
}) => {
  return (
    <>
      <div className={`${styles.levelGuageContainer}`}>
        <div
          className={styles.characterLevel}
          style={{
            backgroundColor:
              levelInfo !== null
                ? levelInfo.levelPanelGrade === ChatGrade.Gold
                  ? rewardItems?.[3]?.color
                  : levelInfo.levelPanelGrade === ChatGrade.Silver
                  ? rewardItems?.[2]?.color
                  : levelInfo.levelPanelGrade === ChatGrade.Bronze
                  ? rewardItems?.[1]?.color
                  : rewardItems?.[0]?.color
                : undefined,
          }}
        >
          Lv.{levelInfo?.level ?? 0}
        </div>
        <div className={styles.levelGauge}>
          <div
            style={{
              height: '100%',
              width: `${((levelInfo?.exp ?? 0) / (levelInfo?.requireExp ?? 1)) * 100}%`,
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
              width: `calc(100% - ${((levelInfo?.exp ?? 0) / (levelInfo?.requireExp ?? 1)) * 100}%)`,
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
        <div className={styles.expText}>
          {(((levelInfo?.exp ?? 0) / (levelInfo?.requireExp ?? 1)) * 100).toFixed(2)}%
        </div>
      </div>
    </>
  );
};

export default CharacterLevelGuage;
