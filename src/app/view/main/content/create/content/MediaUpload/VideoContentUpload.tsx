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
import {MediaUploadReq, sendUpload, sendUploadTempFile, UploadMediaState} from '@/app/NetWork/ImageNetwork';
import {
  ContentCategoryType,
  ContentEpisodeVideoInfo,
  ContentLanguageType,
  CreateContentEpisodeVideoInfo,
} from '@/app/NetWork/ContentNetwork';
import PreviewViewer from './PreviewViewer';
import getLocalizedText from '@/utils/getLocalizedText';

export interface VideoUploadField {
  id: number;
  selectedCountry: ContentLanguageType;
  fileUrl?: string; // 업로드된 파일의 URL 저장
  fileName?: string;
}
interface VideoContentUploadProps {
  setEpisodeVideoInfo: (value: (prev: CreateContentEpisodeVideoInfo) => CreateContentEpisodeVideoInfo) => void;
  defaultEpisodeVideoInfo?: ContentEpisodeVideoInfo; // 기존 데이터가 있으면 전달받음
  hasError?: boolean;
}

const VideoContentUpload: React.FC<VideoContentUploadProps> = ({
  setEpisodeVideoInfo,
  defaultEpisodeVideoInfo,
  hasError,
}) => {
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
      // ✅ videoFile / videoName은 UI 미리보기용으로 여전히 필요하다면 유지
      setVideoFile(defaultEpisodeVideoInfo.videoSourceFileInfo.videoSourceName);
      setVideoName(defaultEpisodeVideoInfo.videoSourceFileInfo.videoSourceName || null);

      // ✅ subtitle은 구조 그대로 유지 (API 구조 안 바뀜)
      setSubtitleFields(
        defaultEpisodeVideoInfo.subTitleFileInfos.map((info, index) => ({
          id: index,
          selectedCountry: info.videoLanguageType,
          fileUrl: info.videoSourceUrl,
          fileName: info.videoSourceName,
        })),
      );

      // ✅ dubbing은 tempFileName과 videoFileName으로 세팅 (fileUrl은 미리보기용)
      setDubbingFields(
        defaultEpisodeVideoInfo.dubbingFileInfos.map((info, index) => ({
          id: index,
          selectedCountry: info.videoLanguageType,
          fileUrl: info.videoSourceName, // UI상 썸네일용이므로 임시로 fileName 사용
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
    const newItem = {
      id: Date.now(),
      selectedCountry: ContentLanguageType.Korean,
      fileUrl: undefined,
      fileName: undefined,
    };

    if (type === 'subtitle') {
      setSubtitleFields(prev => [...prev, newItem]);
      setEpisodeVideoInfo(prev => ({
        ...prev,
        subTitleFileInfos: [
          ...prev.subTitleFileInfos,
          {
            videoLanguageType: ContentLanguageType.Korean,
            videoSourceUrl: '',
            videoSourceName: '',
          },
        ],
      }));
    } else {
      setDubbingFields(prev => [...prev, newItem]);
      setEpisodeVideoInfo(prev => ({
        ...prev,
        dubbingFileInfos: [
          ...prev.dubbingFileInfos,
          {
            videoLanguageType: ContentLanguageType.Korean,
            tempFileName: '',
            videoFileName: '',
          },
        ],
      }));
    }
  };

  const handleClearFileUrl = (type: 'subtitle' | 'dubbing', index: number) => {
    if (type === 'subtitle') {
      const id = subtitleFields[index].id;

      setSubtitleFields(prevFields =>
        prevFields.map(field => (field.id === id ? {...field, fileUrl: undefined, fileName: undefined} : field)),
      );

      setEpisodeVideoInfo(prev => {
        const updated = [...prev.subTitleFileInfos];
        if (updated[index]) {
          updated[index].videoSourceUrl = '';
          updated[index].videoSourceName = '';
        }
        return {...prev, subTitleFileInfos: updated};
      });
    } else if (type === 'dubbing') {
      const id = dubbingFields[index].id;

      setDubbingFields(prevFields =>
        prevFields.map(field => (field.id === id ? {...field, fileUrl: undefined, fileName: undefined} : field)),
      );

      setEpisodeVideoInfo(prev => {
        const updated = [...prev.dubbingFileInfos];
        if (updated[index]) {
          updated[index].tempFileName = '';
          updated[index].videoFileName = '';
        }
        return {...prev, dubbingFileInfos: updated};
      });
    }
  };
  const handleRemoveFile = (type: 'video' | 'subtitle' | 'dubbing', index?: number) => {
    if (type === 'video') {
      setVideoFile(null);
      setVideoName(null);
      setEpisodeVideoInfo(prev => ({
        ...prev,
        videoSourceFileInfo: {
          ...prev.videoSourceFileInfo,
          tempFileName: '',
          videoFileName: '',
        },
      }));
    } else if (type === 'subtitle' && index !== undefined) {
      setSubtitleFields(prev =>
        prev.map((field, i) => (i === index ? {...field, fileUrl: undefined, fileName: undefined} : field)),
      );
      setEpisodeVideoInfo(prev => {
        const updated = [...prev.subTitleFileInfos];
        if (updated[index]) {
          updated[index].videoSourceUrl = '';
          updated[index].videoSourceName = '';
        }
        return {...prev, subTitleFileInfos: updated};
      });
    } else if (type === 'dubbing' && index !== undefined) {
      setDubbingFields(prev =>
        prev.map((field, i) => (i === index ? {...field, fileUrl: undefined, fileName: undefined} : field)),
      );
      setEpisodeVideoInfo(prev => {
        const updated = [...prev.dubbingFileInfos];
        if (updated[index]) {
          updated[index].tempFileName = '';
          updated[index].videoFileName = '';
        }
        return {...prev, dubbingFileInfos: updated};
      });
    }
  };
  const handleCountryChange = (type: 'subtitle' | 'dubbing', index: number, country: ContentLanguageType) => {
    if (type === 'subtitle') {
      setSubtitleFields(prev => prev.map((field, i) => (i === index ? {...field, selectedCountry: country} : field)));
      setEpisodeVideoInfo(prev => {
        const updated = [...prev.subTitleFileInfos];
        if (updated[index]) updated[index].videoLanguageType = country;
        return {...prev, subTitleFileInfos: updated};
      });
    } else {
      setDubbingFields(prev => prev.map((field, i) => (i === index ? {...field, selectedCountry: country} : field)));
      setEpisodeVideoInfo(prev => {
        const updated = [...prev.dubbingFileInfos];
        if (updated[index]) updated[index].videoLanguageType = country;
        return {...prev, dubbingFileInfos: updated};
      });
    }
    setCountryDrawerOpen(null);
  };

  const handleRemoveSpecificField = (type: 'subtitle' | 'dubbing', index: number) => {
    if (type === 'subtitle') {
      setSubtitleFields(prev => prev.filter((_, i) => i !== index));
      setEpisodeVideoInfo(prev => ({
        ...prev,
        subTitleFileInfos: prev.subTitleFileInfos.filter((_, i) => i !== index),
      }));
    } else {
      setDubbingFields(prev => prev.filter((_, i) => i !== index));
      setEpisodeVideoInfo(prev => ({
        ...prev,
        dubbingFileInfos: prev.dubbingFileInfos.filter((_, i) => i !== index),
      }));
    }
  };

  const handleFileUpload = async (type: 'video' | 'subtitle' | 'dubbing', files: File[], index?: number) => {
    try {
      if (type === 'subtitle') {
        const req: MediaUploadReq = {
          mediaState: UploadMediaState.ContentEpisodeSubtitle,
          file: files[0],
        };
        const response = await sendUpload(req);

        if (response?.data && index !== undefined) {
          const {url, fileName} = response.data;

          setSubtitleFields(prev => prev.map((field, i) => (i === index ? {...field, fileUrl: url, fileName} : field)));

          setEpisodeVideoInfo(prev => {
            const newList = [...prev.subTitleFileInfos];
            newList[index] = {
              videoSourceUrl: url,
              videoSourceName: fileName,
              videoLanguageType: subtitleFields[index]?.selectedCountry ?? ContentLanguageType.Korean,
            };
            return {
              ...prev,
              subTitleFileInfos: newList,
            };
          });
        }
      } else {
        const response = await sendUploadTempFile(files[0]);

        if (response?.data) {
          const {tempFileName, uploadFileName} = response.data;

          if (type === 'video') {
            setVideoFile(tempFileName);
            setVideoName(uploadFileName);

            setEpisodeVideoInfo(prev => ({
              ...prev,
              videoSourceFileInfo: {
                tempFileName,
                videoFileName: uploadFileName,
                videoLanguageType: ContentLanguageType.Korean,
              },
            }));
          } else if (type === 'dubbing' && index !== undefined) {
            setDubbingFields(prev =>
              prev.map((field, i) =>
                i === index ? {...field, fileUrl: tempFileName, fileName: uploadFileName} : field,
              ),
            );

            setEpisodeVideoInfo(prev => {
              const newList = [...prev.dubbingFileInfos];
              newList[index] = {
                tempFileName,
                videoFileName: uploadFileName,
                videoLanguageType: dubbingFields[index]?.selectedCountry ?? ContentLanguageType.Korean,
              };
              return {
                ...prev,
                dubbingFileInfos: newList,
              };
            });
          }
        }
      }
    } catch (error) {
      console.error('파일 업로드 중 오류 발생:', error);
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
          <div className={`${styles.videoUploadBox} ${hasError && !videoFile ? styles.videoUploadBoxError : ''}`}>
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
