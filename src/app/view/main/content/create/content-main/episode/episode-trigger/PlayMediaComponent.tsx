import React, {useState} from 'react';
import {Box, Typography, IconButton, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent} from '@mui/material';
import {ArrowBackIos} from '@mui/icons-material';
import styles from './PlayMediaComponent.module.css';
import ImageUploadDialog from '../episode-ImageCharacter/ImageUploadDialog';
import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CloseIcon from '@mui/icons-material/Close';
import ImagesUploadDialog from '@/components/layout/shared/ImagesUploadDialog';
import VideoUploadDialog from '@/components/layout/shared/VideoUploadDialog';
import {constrainedMemory} from 'process';
import ReactPlayer from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import AudioUploadDialog from '@/components/layout/shared/AudioUploadDialog';
// MediaType enum 정의
enum MediaType {
  NONE = 0,
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
}

interface PlayMediaComponentProps {
  onTypeSelect: (type: number) => void; // 상위 컴포넌트로 파일 전달
  onMediaSelect: (urlList: string[]) => void; // 상위 컴포넌트로 파일 전달
  type: number;
  initUrls: string[];
}

const PlayMediaComponent: React.FC<PlayMediaComponentProps> = ({onMediaSelect, type, initUrls, onTypeSelect}) => {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false); // 다이얼로그 열림 상태
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false); // 다이얼로그 열림 상태
  const [isAudioDialogOpen, setIsAudioDialogOpen] = useState(false); // 다이얼로그 열림 상태
  const [loading, setLoading] = useState<boolean>(false);
  const [mediaType, setMediaType] = useState<MediaType>(type); // 선택된 미디어 타입 상태, 기본값은 '이미지들'
  const [images, setImages] = useState<string[]>([]); // 이미지 URL 배열 상태
  const [video, setVideo] = useState<string | undefined>(); // 이미지 URL 배열 상태
  const [audio, setAudio] = useState<string | undefined>(); // 오디오 URL 상태
  const [isInit, setIsInit] = useState<boolean>(false); // 오디오 URL 상태
  const [updatedUrls, setUpdatedUrls] = useState<string[]>(initUrls); // 오디오 URL 상태
  React.useEffect(() => {
    console.log('type:', type);
    console.log('initUrls:', initUrls);

    if (isInit) return;
    setIsInit(true);
    // initUrls가 유효하지 않을 경우 NONE으로 초기화
    if (!initUrls || initUrls.length === 0) {
      console.log('initUrls is null, undefined, or empty. Setting to MediaType.NONE.');
      setMediaType(MediaType.NONE);
      setImages([]); // 이미지 초기화
      setVideo(undefined); // 비디오 초기화
      setAudio(undefined); // 오디오 초기화
      return;
    }

    setMediaType(type);
    // type에 따른 처리
    switch (type) {
      case 0: // NONE
        setMediaType(prev => (prev === MediaType.NONE ? prev : MediaType.NONE));
        setImages([]); // 이미지 초기화
        setVideo(undefined); // 비디오 초기화
        setAudio(undefined); // 오디오 초기화
        break;
      case 1: // IMAGE
        setImages(initUrls);
        break;
      case 2: // VIDEO
        setVideo(initUrls[0]);
        break;
      case 3: // AUDIO
        setAudio(initUrls[0]);
        break;
      default:
        console.warn('Unknown media type, setting to MediaType.NONE.');
    }
  }, [type, initUrls]);

  const handleAudioAdd = async (file: File) => {
    setLoading(true); // 로딩 상태 활성화
    try {
      const req: MediaUploadReq = {
        mediaState: MediaState.TriggerAudio, // 오디오 업로드 타입 설정
        file, // 선택한 파일
      };

      const response = await sendUpload(req);

      if (response?.data) {
        const audioUrl: string = response.data.url; // 서버에서 받은 오디오 URL
        setAudio(audioUrl); // 오디오 URL 설정

        const urlList: string[] = [audioUrl];
        onMediaSelect(urlList); // 상위 컴포넌트로 파일 전달
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  const handleVideoAdd = async (files: File) => {
    setLoading(true); // 로딩 상태 활성화
    try {
      // Upload 객체 생성 (비디오 업로드의 경우 TriggerVideo로 설정)
      const req: MediaUploadReq = {
        mediaState: MediaState.TriggerVideo, // 비디오 타입일 때 TriggerVideo로 설정
        file: files, // 첫 번째 파일만 전송 (필요시 여러 파일 처리)
      };

      // 파일 업로드 API 호출
      const response = await sendUpload(req);
      console.log('Video URL:', video);

      if (response?.data) {
        const videoUrls: string = response.data.url; // 서버에서 비디오 URL을 받아옴
        setVideo(videoUrls); // 받아온 비디오 URL을 이미지 배열에 추가 (비디오 배열로 처리 가능)

        const urlList: string[] = [videoUrls];
        onMediaSelect(urlList); // 상위 컴포넌트로 파일 전달
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 파일 선택 핸들러
  const handleImageAdd = async (files: File[]) => {
    // 파일 배열을 받도록 수정
    setLoading(true); // 로딩 상태 활성화
    try {
      // Upload 객체 생성
      const req: MediaUploadReq = {
        mediaState: mediaType === MediaType.IMAGE ? MediaState.TriggerImage : MediaState.TriggerVideo, // 미디어 타입에 따라 다르게 설정
        triggerImageList: mediaType === MediaType.IMAGE ? files : [], // 이미지일 때만 파일 배열을 넣음
      };

      // 파일 업로드 API 호출
      const response = await sendUpload(req);

      if (response?.data) {
        const imgUrls: string[] = response.data.imageUrlList; // 메인 이미지 URL
        setImages(prevImages => [...prevImages, ...imgUrls]); // 여러 이미지 URL을 기존 이미지 배열에 추가
        //initUrls 여기의 뒷부분에 imgUrls를 추가하고 싶어
        // 기존 updatedUrls에 imgUrls를 추가하여 새로운 상태로 설정
        const newUrls = [...updatedUrls, ...imgUrls];
        setUpdatedUrls(newUrls); // 상태 업데이트
        onMediaSelect(newUrls); // 상위 컴포넌트로 파일 전달
        console.log('Image URLs:', response.data.imageUrlList); // 추가 이미지 URL 로그 출력
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading media:', error);
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  // 이미지 삭제 핸들러
  const handleImageDelete = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index)); // 해당 인덱스의 이미지 제거
  };
  // 미디어 타입 변경 핸들러
  const handleMediaTypeChange = (event: SelectChangeEvent<number>) => {
    const selectedType = Number(event.target.value);
    // unknown으로 변환한 후 MediaType으로 캐스팅
    setMediaType(selectedType as unknown as MediaType);
    onTypeSelect(selectedType);
  };

  // 다이얼로그 열기
  const handleOpenDialog = (type: MediaType) => {
    console.log('asdasdada');
    switch (type) {
      case MediaType.IMAGE:
        setIsImageDialogOpen(true);
        return;
      case MediaType.VIDEO:
        setIsVideoDialogOpen(true);
        return;
      case MediaType.AUDIO:
        setIsAudioDialogOpen(true);
        return;
    }
  };

  // 다이얼로그 닫기
  const handleCloseDialog = (type: MediaType) => {
    switch (type) {
      case MediaType.IMAGE:
        setIsImageDialogOpen(false);
        return;
      case MediaType.VIDEO:
        setIsVideoDialogOpen(false);
        return;
      case MediaType.AUDIO:
        setIsAudioDialogOpen(false);
        return;
    }
  };

  return (
    <div className={styles.box}>
      {/* 미디어 타입 선택 메뉴 */}
      <FormControl fullWidth sx={{marginBottom: 2}}>
        <InputLabel>Media Type</InputLabel>
        <Select value={mediaType} onChange={handleMediaTypeChange}>
          <MenuItem value={MediaType.NONE}>None</MenuItem>
          <MenuItem value={MediaType.IMAGE}>Images</MenuItem>
          <MenuItem value={MediaType.VIDEO}>Video</MenuItem>
          <MenuItem value={MediaType.AUDIO}>Audio</MenuItem>
        </Select>
      </FormControl>
      <Box className={styles.playMediaContainer}>
        {(() => {
          switch (mediaType) {
            case MediaType.IMAGE:
              return (
                <>
                  {/* 이미지 UI */}
                  {/* 이미지 박스들 */}
                  {images.map((image, index) => (
                    <Box
                      key={index}
                      className={styles.addMedia}
                      style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative', // 이 부모에 상대적인 위치로 버튼 배치
                      }}
                    >
                      {/* 이미지 삭제 버튼 */}
                      <IconButton
                        className={styles.deleteButton} // 올바르게 적용
                        onClick={() => handleImageDelete(index)} // 삭제 버튼 클릭 시 해당 이미지 삭제
                      >
                        <CloseIcon style={{color: 'red'}} /> {/* 빨간색 X 버튼 */}
                      </IconButton>
                    </Box>
                  ))}

                  {/* 새 이미지 추가 박스 */}
                  <Box className={styles.addMedia} onClick={() => handleOpenDialog(MediaType.IMAGE)}>
                    <Typography className={styles.addLabel}>Add Image</Typography>
                  </Box>
                </>
              );

            case MediaType.VIDEO:
              return (
                <>
                  {/* 비디오 미리보기 */}
                  {video ? (
                    <div>
                      <ReactPlayer
                        muted={true}
                        url={video}
                        // light={true} // 미리보기로 비디오 첫 프레임을 표시
                        playing={true}
                        // 초기 재생 안 함
                        controls={true} // 재생 컨트롤 활성화
                        width="100%"
                        height="100%"
                      />
                      <IconButton onClick={() => setVideo(undefined)}>
                        <CloseIcon style={{color: 'red'}} /> {/* 빨간색 X 버튼 */}
                      </IconButton>
                    </div>
                  ) : (
                    <Typography style={{color: '#aaa'}}>No video available</Typography>
                  )}
                  {/* 비디오 추가 버튼 */}
                  <Box className={styles.addMedia} onClick={() => handleOpenDialog(MediaType.VIDEO)}>
                    <Typography className={styles.addLabel}>Add Video</Typography>
                  </Box>
                </>
              );
            case MediaType.AUDIO:
              return (
                <>
                  {/* 오디오 미리보기 */}
                  {audio ? (
                    <div>
                      <ReactAudioPlayer
                        src={audio}
                        controls // 재생 컨트롤 활성화
                      />
                      <IconButton onClick={() => setAudio(undefined)}>
                        <CloseIcon style={{color: 'red'}} /> {/* 빨간색 X 버튼 */}
                      </IconButton>
                    </div>
                  ) : (
                    <Typography style={{color: '#aaa'}}>No audio available</Typography>
                  )}
                  {/* 오디오 추가 버튼 */}
                  <Box className={styles.addMedia} onClick={() => handleOpenDialog(MediaType.AUDIO)}>
                    <Typography className={styles.addLabel}>Add Audio</Typography>
                  </Box>
                </>
              );

            default:
              return null;
          }
        })()}

        {/* ImageUploadDialog 컴포넌트 */}
        <ImagesUploadDialog
          isOpen={isImageDialogOpen}
          onClose={() => handleCloseDialog(MediaType.IMAGE)}
          onFileSelect={handleImageAdd} // 선택된 파일 처리
        />
        {/* VideoUploadDialog 컴포넌트 */}
        <VideoUploadDialog
          isOpen={isVideoDialogOpen}
          onClose={() => handleCloseDialog(MediaType.VIDEO)}
          onFileSelect={handleVideoAdd} // 선택된 비디오 파일 처리
        />
        <AudioUploadDialog
          isOpen={isAudioDialogOpen}
          onClose={() => handleCloseDialog(MediaType.AUDIO)}
          onFileSelect={handleAudioAdd} // 선택된 파일 처리
        />

        <LoadingOverlay loading={loading} />
      </Box>
    </div>
  );
};

export default PlayMediaComponent;
