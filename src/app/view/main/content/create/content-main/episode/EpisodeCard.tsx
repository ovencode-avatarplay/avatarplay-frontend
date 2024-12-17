import React from 'react';
import styles from './EpisodeCard.module.css';
import {Avatar, Box, Typography, IconButton, Badge, Card} from '@mui/material';
import {EpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import {BoldCirclePlus} from '@ui/Icons';
interface EpisodeCardProps {
  episodeNum: number;
  episodeInfo: EpisodeInfo;
}

const EpisodeCard: React.FC<EpisodeCardProps> = ({episodeNum, episodeInfo}) => {
  return (
    <div className={styles.episodeCard}>
      {/* 상단 제목 영역 */}
      <Box className={styles.header}>
        <div style={{display: 'flex'}}>
          <Typography style={{marginRight: '4px'}}>{`Ep.${episodeNum || '?'}`}</Typography>

          <Typography>{`${episodeInfo.name || 'None'}`}</Typography>
        </div>
        <IconButton>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Box className={styles.contentBox}>
        <div className={styles.contentTop}>
          <div className={styles.cardBox}>
            {/* Image Section */}
            <div className={styles.cardimageContainer}>
              <div className={styles.cardtopRightButton}>
                <EditIcon />
              </div>
              <img src={episodeInfo.characterInfo.mainImageUrl} alt="Main" className={styles.cardmainImage} />
            </div>

            {/* Footer */}
            <div className={styles.cardfooter}>
              <Typography className={styles.carduserName}>Suyeon</Typography>
            </div>
          </div>
          <div className={styles.contentTopBox}>
            <div className={styles.contentTopItem}>... </div>
            <div className={styles.contentTopItem}>
              텍스트1 <img src={BoldCirclePlus.src} alt="AI Recommend" className={styles.inputButton} />
            </div>
            <div className={styles.contentTopItem}>텍스트2</div>
          </div>
        </div>

        <div className={styles.episodeScenario}>
          <div className={styles.episodeScenarioItem1}>텍스트3</div>
          <div className={styles.episodeScenarioItem2}>...</div>
        </div>
      </Box>
    </div>
  );
};

export default EpisodeCard;
