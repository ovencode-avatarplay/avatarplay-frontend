import React, {useState} from 'react';
import {Box, Typography, IconButton} from '@mui/material';
import {ArrowBackIos} from '@mui/icons-material';
import styles from './PlayMediaComponent.module.css';
import ImageUploadDialog from '../episode-ImageCharacter/ImageUploadDialog';
import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';

interface PlayMediaComponentProps {
  onMediaSelect: (file: File) => void; // 상위 컴포넌트로 파일 전달
}

const PlayMediaComponent: React.FC<PlayMediaComponentProps> = ({onMediaSelect}) => {
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null); // 선택된 파일 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 이미지 미리보기 URL
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 다이얼로그 열림 상태
  const [loading, setLoading] = useState<boolean>(false);

  // 파일 선택 핸들러
  const handleMediaSelect = async (file: File) => {
    setLoading(true); // 로딩 상태 활성화
    try {
      // Upload 객체 생성
      const req: MediaUploadReq = {
        mediaState: MediaState.TriggerImage, // 적절한 MediaState 설정
        triggerImageList: [file],
      };

      // 파일 업로드 API 호출
      const response = await sendUpload(req);

      if (response?.data) {
        const imgUrls: string[] = response.data.imageUrlList; // 메인 이미지 URL
        setImagePreview(imgUrls[0]); // 미리보기 업데이트

        setSelectedMedia(file); // 선택된 파일 저장
        onMediaSelect(file); // 상위 컴포넌트로 파일 전달
        console.log('Image URLs:', response.data.imageUrlList); // 추가 이미지 URL 로그 출력
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 다이얼로그 열기
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  // 다이얼로그 닫기
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <Box className={styles.playMediaContainer}>
      {/* 미디어 추가 버튼 */}
      <Box
        className={styles.addMedia}
        style={
          imagePreview
            ? {
                backgroundImage: `url(${imagePreview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {}
        }
        onClick={handleOpenDialog}
      >
        {!imagePreview && (
          <Typography className={styles.addLabel}>{selectedMedia ? selectedMedia.name : 'Add New'}</Typography>
        )}
      </Box>

      {/* 선택된 미디어 표시 */}
      <Box className={styles.selectedMedia}>
        <Typography className={styles.mediaLabel}>Selected Media</Typography>
        <Typography className={styles.mediaStatus}>{selectedMedia ? selectedMedia.name : 'Not selected'}</Typography>
      </Box>

      {/* 화살표 아이콘 */}
      <IconButton
        className={styles.arrowButton}
        onClick={() => {
          console.log('Arrow clicked');
        }}
      >
        <ArrowBackIos />
      </IconButton>

      {/* ImageUploadDialog 컴포넌트 */}
      <ImageUploadDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onFileSelect={handleMediaSelect} // 선택된 파일 처리
      />
      <LoadingOverlay loading={loading} />
    </Box>
  );
};

export default PlayMediaComponent;
