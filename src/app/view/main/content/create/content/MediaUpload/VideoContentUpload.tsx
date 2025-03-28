import React, {useEffect, useState} from 'react';
import styles from './VideoContentUpload.module.css';
import {
  BoldArrowDown,
  BoldCirclePlus,
  BoldFolderPlus,
  BoldQuestion,
  CircleClose,
  LineArrowDown,
  LineClose,
  LineDashboard,
  LineDelete,
  LineUpload,
} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {MediaUploadReq, sendUpload, UploadMediaState} from '@/app/NetWork/ImageNetwork';
import {ContentCategoryType, ContentEpisodeVideoInfo, ContentLanguageType} from '@/app/NetWork/ContentNetwork';
import PreviewViewer from './PreviewViewer';
import getLocalizedText from '@/utils/getLocalizedText';

export interface VideoUploadField {
  id: number;
  selectedCountry: ContentLanguageType;
  fileUrl?: string; // 업로드된 파일의 URL 저장
  fileName?: string;
}
interface VideoContentUploadProps {
  setEpisodeVideoInfo: (value: (prev: ContentEpisodeVideoInfo) => ContentEpisodeVideoInfo) => void;
  defaultEpisodeVideoInfo?: ContentEpisodeVideoInfo; // 기존 데이터가 있으면 전달받음
}

const VideoContentUpload: React.FC<VideoContentUploadProps> = ({setEpisodeVideoInfo, defaultEpisodeVideoInfo}) => {
  const [subtitleFields, setSubtitleFields] = useState<VideoUploadField[]>([]);
  const [dubbingFields, setDubbingFields] = useState<VideoUploadField[]>([]);
  const [CountryDrawerOpen, setCountryDrawerOpen] = useState<{type: 'subtitle' | 'dubbing'; index: number} | null>(
    null,
  );
  const [videoFile, setVideoFile] = useState<string | null>(null); // 비디오 업로드 상태
  const [videoName, setVideoName] = useState<string | null>(null); // 비디오 업로드 상태

  const [onPreview, setOnPreview] = useState(false);

  // ✅ 기존 데이터가 있으면 초기값 설정
  useEffect(() => {
    if (defaultEpisodeVideoInfo) {
      setVideoFile(defaultEpisodeVideoInfo.videoSourceFileInfo.videoSourceUrl || null);
      setVideoName(defaultEpisodeVideoInfo.videoSourceFileInfo.videoSourceName || null);

      setSubtitleFields(
        defaultEpisodeVideoInfo.subTitleFileInfos.map((info, index) => ({
          id: index,
          selectedCountry: info.videoLanguageType,
          fileUrl: info.videoSourceUrl,
          fileName: info.videoSourceName,
        })),
      );

      setDubbingFields(
        defaultEpisodeVideoInfo.dubbingFileInfos.map((info, index) => ({
          id: index,
          selectedCountry: info.videoLanguageType,
          fileUrl: info.videoSourceUrl,
          fileName: info.videoSourceName,
        })),
      );
    }
  }, [defaultEpisodeVideoInfo]);

  const CountryItems = (type: 'subtitle' | 'dubbing', index: number): SelectDrawerItem[] => [
    {name: 'Korean', onClick: () => handleCountryChange(type, index, ContentLanguageType.Korean)},
    {name: 'English', onClick: () => handleCountryChange(type, index, ContentLanguageType.English)},
    {name: 'Japanese', onClick: () => handleCountryChange(type, index, ContentLanguageType.Japanese)},
    {name: 'French', onClick: () => handleCountryChange(type, index, ContentLanguageType.French)},
    {name: 'Spanish', onClick: () => handleCountryChange(type, index, ContentLanguageType.Spanish)},
    {
      name: 'Chinese (Simplified)',
      onClick: () => handleCountryChange(type, index, ContentLanguageType.ChineseSimplified),
    },
    {
      name: 'Chinese (Traditional)',
      onClick: () => handleCountryChange(type, index, ContentLanguageType.ChineseTraditional),
    },
    {name: 'Portuguese', onClick: () => handleCountryChange(type, index, ContentLanguageType.Portuguese)},
    {name: 'German', onClick: () => handleCountryChange(type, index, ContentLanguageType.German)},
  ];

  const handleAddUploader = (type: 'subtitle' | 'dubbing') => {
    if (type === 'subtitle') {
      setSubtitleFields([...subtitleFields, {id: Date.now(), selectedCountry: ContentLanguageType.Korean}]);
    } else {
      setDubbingFields([...dubbingFields, {id: Date.now(), selectedCountry: ContentLanguageType.Korean}]);
    }
  };

  const handleRemoveSpecificField = (type: 'subtitle' | 'dubbing', index: number) => {
    if (type === 'subtitle') {
      let id = subtitleFields[index].id;
      setSubtitleFields(prevFields => prevFields.filter(field => field.id !== Number(id)));
      console.log('로그', id, subtitleFields);
    } else if (type === 'dubbing') {
      let id = dubbingFields[index].id;
      setDubbingFields(prevFields => prevFields.filter(field => field.id !== Number(id)));
    }
  };

  const handleClearFileUrl = (type: 'subtitle' | 'dubbing', index: number) => {
    if (type === 'subtitle') {
      let id = subtitleFields[index].id;
      setSubtitleFields(prevFields =>
        prevFields.map(field => (field.id === id ? {...field, fileUrl: undefined} : field)),
      );
    } else if (type === 'dubbing') {
      let id = dubbingFields[index].id;
      setDubbingFields(prevFields =>
        prevFields.map(field => (field.id === id ? {...field, fileUrl: undefined} : field)),
      );
    }
  };

  const handleCountryChange = (type: 'subtitle' | 'dubbing', index: number, country: ContentLanguageType) => {
    if (type === 'subtitle') {
      setSubtitleFields(prevFields =>
        prevFields.map((field, i) => (i === index ? {...field, selectedCountry: country} : field)),
      );
    } else {
      setDubbingFields(prevFields =>
        prevFields.map((field, i) => (i === index ? {...field, selectedCountry: country} : field)),
      );
    }
    setCountryDrawerOpen(null);
  };

  const handleFileUpload = async (type: 'video' | 'subtitle' | 'dubbing', files: File[], index?: number) => {
    try {
      let mediaState: UploadMediaState;
      if (type === 'video') mediaState = UploadMediaState.ContentEpisodeVideo;
      else if (type === 'subtitle') mediaState = UploadMediaState.ContentEpisodeSubtitle;
      else mediaState = UploadMediaState.ContentEpisodeDubbing;

      const req: MediaUploadReq = {mediaState, file: files[0]};
      const response = await sendUpload(req);

      if (response?.data) {
        const fileUrl = response.data.url;
        const fileName = response.data.fileName;
        const playTime = response.data.playTime;
        console.log(`${type} uploaded:`, fileUrl, fileName);

        if (type === 'video') {
          setVideoFile(fileUrl);
          setVideoName(fileName);
          setEpisodeVideoInfo(prev => ({
            ...prev,
            videoSourcePlayTime: playTime || '00:00', // 플레이 타임 업데이트
            videoSourceFileInfo: {
              ...prev.videoSourceFileInfo,
              videoSourceUrl: fileUrl,
              videoSourceName: fileName,
            },
          }));
        } else if (type === 'subtitle' && index !== undefined) {
          setSubtitleFields(prevFields =>
            prevFields.map((field, i) => (i === index ? {...field, fileUrl, fileName} : field)),
          );
          setEpisodeVideoInfo(prev => ({
            ...prev,
            subTitleFileInfos: prev.subTitleFileInfos.map((info, i) =>
              i === index ? {...info, videoSourceUrl: fileUrl, videoSourceName: fileName} : info,
            ),
          }));
        } else if (type === 'dubbing' && index !== undefined) {
          setDubbingFields(prevFields =>
            prevFields.map((field, i) => (i === index ? {...field, fileUrl, fileName} : field)),
          );
          setEpisodeVideoInfo(prev => ({
            ...prev,
            dubbingFileInfos: prev.dubbingFileInfos.map((info, i) =>
              i === index ? {...info, videoSourceUrl: fileUrl, videoSourceName: fileName} : info,
            ),
          }));
        }
      }
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
    }
  };

  // 파일 삭제 처리
  const handleRemoveFile = (type: 'video' | 'subtitle' | 'dubbing', index?: number) => {
    if (type === 'video') {
      setVideoFile(null);
      setVideoName(null);
      setEpisodeVideoInfo(prev => ({
        ...prev,
        videoSourceFileInfo: {
          ...prev.videoSourceFileInfo,
          videoSourceUrl: '',
          videoSourceName: '',
        },
      }));
    } else if (type === 'subtitle' && index !== undefined) {
      setSubtitleFields(prevFields =>
        prevFields.map((field, i) => (i === index ? {...field, fileUrl: undefined} : field)),
      );
      setEpisodeVideoInfo(prev => ({
        ...prev,
        subTitleFileInfos: prev.subTitleFileInfos.map((info, i) =>
          i === index ? {...info, videoSourceUrl: '', videoSourceName: ''} : info,
        ),
      }));
    } else if (type === 'dubbing' && index !== undefined) {
      setDubbingFields(prevFields =>
        prevFields.map((field, i) => (i === index ? {...field, fileUrl: undefined} : field)),
      );
      setEpisodeVideoInfo(prev => ({
        ...prev,
        dubbingFileInfos: prev.dubbingFileInfos.map((info, i) =>
          i === index ? {...info, videoSourceUrl: '', videoSourceName: ''} : info,
        ),
      }));
    }
  };

  const renderUploader = (type: 'subtitle' | 'dubbing', field: VideoUploadField, index: number) => {
    return (
      <div key={field.id} className={styles.uploadGroup}>
        {/* 국가 선택 드롭다운 */}
        <div className={styles.countryUploadBox} onClick={() => setCountryDrawerOpen({type, index})}>
          {ContentLanguageType[field.selectedCountry]}
          <img src={LineArrowDown.src} className={styles.lineArrowDown} />
        </div>

        {/* 업로드된 파일 표시 */}
        <div className={styles.videoUploadBox}>
          {field.fileUrl ? (
            <>
              <div className={styles.textInBoxGroup}>
                <span className={styles.textInBox}>{field.fileName}</span>
                <img
                  src={CircleClose.src}
                  className={styles.circleClose}
                  onClick={() => {
                    handleRemoveFile(type, index);
                  }}
                ></img>
              </div>
            </>
          ) : (
            <span>No file uploaded</span>
          )}
        </div>

        {/* 업로드 및 삭제 버튼 */}
        <div className={styles.videoButtonContainer}>
          <button
            className={styles.uploadButton}
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              // input.accept = type === 'subtitle' ? '.srt,.txt' : 'audio/*';
              input.accept = input.accept =
                type === 'subtitle' ? '.srt,.vtt' : type === 'dubbing' ? '.mp3,.mp4' : 'video/mp4';

              input.onchange = e => {
                const files = (e.target as HTMLInputElement).files;
                if (files) {
                  handleFileUpload(type, Array.from(files), index);
                }
              };
              input.click();
            }}
          >
            <img src={LineUpload.src} alt="Upload" className={styles.icon} />
            {getLocalizedText('common_button_upload')}
          </button>
          <button className={styles.deleteButton} onClick={() => handleRemoveSpecificField(type, index)}>
            <img src={LineDelete.src} alt="Delete" className={styles.icon} />
            {getLocalizedText('common_button_delete')}
          </button>
        </div>

        {/* 국가 선택 드롭다운 */}
        {CountryDrawerOpen?.type === type && CountryDrawerOpen.index === index && (
          <SelectDrawer
            name="Filter"
            items={CountryItems(type, index)}
            isOpen={true}
            onClose={() => setCountryDrawerOpen(null)}
            selectedIndex={field.selectedCountry}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={styles.previewLabel}
        onClick={() => {
          if (videoFile) setOnPreview(true);
        }}
      >
        {getLocalizedText('common_button_preview')}
      </div>
      <div className={styles.videoUploadContainer}>
        <span className={styles.label}>{getLocalizedText('common_filter_video')}</span>
        <div className={styles.uploadGroup}>
          <div className={styles.videoUploadBox}>
            {videoFile ? (
              <>
                <div className={styles.textInBoxGroup}>
                  <span className={styles.textInBox}>{videoName}</span>{' '}
                  <img
                    src={CircleClose.src}
                    className={styles.circleClose}
                    onClick={() => {
                      setVideoFile(null);
                      setVideoName('');
                      setEpisodeVideoInfo(prev => ({
                        ...prev,
                        videoSourceFileUrl: '',
                        videoSourceFileName: '', // 📌 기존 files[0].name → fileName으로 변경
                        playTime: '',
                      }));
                    }}
                  ></img>
                </div>
              </>
            ) : (
              <span>No video uploaded</span>
            )}
          </div>

          <div className={styles.videoButtonContainer}>
            <button
              className={styles.uploadButton}
              style={{width: '100%'}}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'video/*';
                input.onchange = e => {
                  const files = (e.target as HTMLInputElement).files;
                  if (files) {
                    handleFileUpload('video', Array.from(files));
                  }
                };
                input.click();
              }}
            >
              <img src={LineUpload.src} alt="Upload" className={styles.icon} />
              {getLocalizedText('common_button_upload')}
            </button>
          </div>
        </div>
        <div className={styles.subtitleContainer}>
          <span className={styles.label}>Subtitle</span>
          <button className={styles.addButton} onClick={() => handleAddUploader('subtitle')}>
            + {getLocalizedText('common_button_add')}{' '}
          </button>
        </div>{' '}
        {subtitleFields.map((field, index) => renderUploader('subtitle', field, index))}
        <div className={styles.dubbingContainer}>
          <span className={styles.label}>{getLocalizedText('createcontent007_label_006')}</span>
          <button className={styles.addButton} onClick={() => handleAddUploader('dubbing')}>
            + {getLocalizedText('common_button_add')}{' '}
          </button>
        </div>
        {dubbingFields.map((field, index) => renderUploader('dubbing', field, index))}
      </div>
      <span className={styles.grayLabel}>{getLocalizedText('createcontent007_desc_007')}</span>
      <PreviewViewer
        open={onPreview}
        onClose={() => {
          setOnPreview(false);
        }}
        mediaUrls={videoFile ? [videoFile] : []}
        type={ContentCategoryType.Video}
      ></PreviewViewer>
    </>
  );
};

export default VideoContentUpload;
