import React, {useState} from 'react';
import {Box, Typography, IconButton, Container, Avatar, Card} from '@mui/material';
import {FavoriteBorder, ChatBubbleOutline, ArrowForwardIos} from '@mui/icons-material';
import MoreVert from '@mui/icons-material/MoreVert';
import styles from './ReelsContent.module.css';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import {Pagination} from 'swiper/modules';

interface ReelData {
  images: string[];
  text: string;
  link: string;
  item: ReelData;
}

interface ReelsContentProps {
  item: ReelData;
}

const ReelsContent: React.FC = () => {
  return (
    <div className={styles.reelsContainer}>
      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Background Image with Dim */}
        <div className={styles.Image}>
          <img src="/ui/유나.png" alt="유나 이미지" className={styles.Image} />
        </div>
        <div className={styles.dim}></div>

        {/* Pause Button */}
        <div className={styles.pauseButton}></div>

        {/* User Info */}
        <div className={styles.userInfo}>
          <div className={styles.profilePicture}></div>
          <div className={styles.profileDetails}>
            <span className={styles.username}>your-name</span>
            <span className={styles.sponsored}>Sponsored</span>
          </div>
          <button className={styles.followButton}>Follow</button>
        </div>

        {/* Description */}
        <div className={styles.description}>Lorem ipsum dolor sit amet, consectetur...</div>

        {/* Video Info */}
        <div className={styles.videoInfo}>Video · 2:30/15:25</div>

        {/* CTA Buttons */}
        <div className={styles.ctaButtons}>
          <div className={styles.likeButton}></div>
          <div className={styles.dislikeButton}></div>
          <div className={styles.commentButton}></div>
          <div className={styles.shareButton}></div>
        </div>
      </div>
    </div>
  );
};

export default ReelsContent;
