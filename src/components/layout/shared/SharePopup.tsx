import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  EmailShareButton,
  EmailIcon,
  LineShareButton,
  LineIcon,
  WeiboShareButton,
  WeiboIcon,
} from 'react-share';

interface SharePopupProps {
  title: string;
  url: string;
  open: boolean;
  onClose: () => void;
}

const SharePopup: React.FC<SharePopupProps> = ({title, url, open, onClose}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopyToClipboard = () => {
    const textArea = document.createElement('textarea');
    textArea.value = url;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // 2초 후 버튼 상태 초기화
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" component="h2">
            공유하기
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box mt={2}>
          <Swiper spaceBetween={10} slidesPerView={4} style={{padding: '10px 0'}}>
            <SwiperSlide>
              <FacebookShareButton url={url} title={title}>
                <FacebookIcon size={48} round />
              </FacebookShareButton>
            </SwiperSlide>
            <SwiperSlide>
              <TwitterShareButton url={url} title={title}>
                <TwitterIcon size={48} round />
              </TwitterShareButton>
            </SwiperSlide>
            <SwiperSlide>
              <TelegramShareButton url={url} title={title}>
                <TelegramIcon size={48} round />
              </TelegramShareButton>
            </SwiperSlide>
            <SwiperSlide>
              <WhatsappShareButton url={url} title={title}>
                <WhatsappIcon size={48} round />
              </WhatsappShareButton>
            </SwiperSlide>
            <SwiperSlide>
              <LinkedinShareButton url={url}>
                <LinkedinIcon size={48} round />
              </LinkedinShareButton>
            </SwiperSlide>
            <SwiperSlide>
              <RedditShareButton url={url} title={title}>
                <RedditIcon size={48} round />
              </RedditShareButton>
            </SwiperSlide>
            <SwiperSlide>
              <EmailShareButton url={url} subject={title} body={`Check this out: ${url}`}>
                <EmailIcon size={48} round />
              </EmailShareButton>
            </SwiperSlide>
            <SwiperSlide>
              <LineShareButton url={url} title={title}>
                <LineIcon size={48} round />
              </LineShareButton>
            </SwiperSlide>
            <SwiperSlide>
              <WeiboShareButton url={url} title={title}>
                <WeiboIcon size={48} round />
              </WeiboShareButton>
            </SwiperSlide>
          </Swiper>
        </Box>
        <Box
          mt={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            padding: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: 1,
          }}
        >
          <Typography
            variant="body2"
            color="textSecondary"
            sx={{
              whiteSpace: 'nowrap', // 줄바꿈 방지
              overflow: 'hidden',
              textOverflow: 'ellipsis', // 텍스트 길 경우 생략 표시
              maxWidth: '70%',
            }}
          >
            {url}
          </Typography>
          <Button
            variant="contained"
            size="small"
            color={isCopied ? 'success' : 'primary'}
            onClick={handleCopyToClipboard}
          >
            {isCopied ? '복사됨' : '복사'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default SharePopup;
