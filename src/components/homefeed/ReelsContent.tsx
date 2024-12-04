import React, {useState} from 'react';
import {Box, Typography, IconButton, Container, Avatar, Card} from '@mui/material';
import {FavoriteBorder, ChatBubbleOutline, ArrowForwardIos} from '@mui/icons-material';
import MoreVert from '@mui/icons-material/MoreVert';
import styles from './ReelsContent.module.css';
import {Swiper, SwiperSlide} from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import {Pagination} from 'swiper/modules';

interface ReelData {
  images: string[];
  text: string;
  link: string;
}

interface ReelsContentProps {
  item: ReelData;
}

const ReelsContent: React.FC<ReelsContentProps> = ({item}) => {
  const [isTextExpanded, setIsTextExpanded] = useState(false);

  const handleOpenDrawer = () => {
    // dispatch(setDrawerEpisodeId(String(item.link)));
  };

  const toggleTextExpansion = () => {
    setIsTextExpanded(prevState => !prevState);
  };

  return (
    <Box className={styles.reel}>
      <Container className={styles.box_group}>
        <Box className={styles.top_box}>
          <Avatar />
          <Box className={styles.info_box}>
            <div className={styles.typo_type1}>0.01% Alpha Male Simulator</div>
            <div className={styles.typo_type2}>5 Days ago</div>
          </Box>
          <IconButton>
            <MoreVert sx={{fontSize: 35}} />
          </IconButton>
        </Box>

        <Typography
          className={`${styles.post_text} ${isTextExpanded ? styles.expanded : ''}`}
          color="black"
          fontSize={14}
          variant="body1"
        >
          {item.text}
        </Typography>

        {item.text.length > 100 && (
          <Typography
            fontSize={14}
            component="span"
            variant="body1"
            color="primary"
            onClick={toggleTextExpansion}
            style={{cursor: 'pointer'}}
          >
            {isTextExpanded ? 'Read less' : 'Read more'}
          </Typography>
        )}

        {item.images.length > 0 && (
          <Swiper pagination={true} modules={[Pagination]} className={styles.mySwiper}>
            {item.images.map((image, index) => (
              <SwiperSlide>
                <Box key={index} component="img" src={image} alt={`Reel ${index}`} className={styles.post_image} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <Box className={styles.post_icons}>
          <IconButton>
            <FavoriteBorder />
            <div className={styles.typo_type3}>100k</div>
          </IconButton>
          <IconButton>
            <ChatBubbleOutline />
            <div className={styles.typo_type3}>100k</div>
          </IconButton>
        </Box>
        <Card
          variant="outlined"
          sx={{
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            justifyContent: 'space-between',
          }}
          onClick={handleOpenDrawer}
        >
          <Avatar sx={{width: 30, height: 30, borderRadius: '10px'}} />
          <span style={{flexGrow: 1, textAlign: 'center'}}>Go swimming with her</span>
          <ArrowForwardIos />
        </Card>
      </Container>
    </Box>
  );
};

export default ReelsContent;
