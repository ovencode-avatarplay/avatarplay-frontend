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
import {EpisodeVideoInfo} from '@/app/NetWork/ContentNetwork';
import {CountryTypes} from './WebtoonContentUpload';

export interface VideoUploadField {
  id: number;
  selectedCountry: CountryTypes;
  fileUrl?: string; // 업로드된 파일의 URL 저장
  fileName?: string;
}
interface VideoContentUploadProps {
  setEpisodeVideoInfo: (value: (prev: EpisodeVideoInfo) => EpisodeVideoInfo) => void;
}

const VideoContentUpload: React.FC<VideoContentUploadProps> = ({setEpisodeVideoInfo}) => {
  const [subtitleFields, setSubtitleFields] = useState<VideoUploadField[]>([]);
  const [dubbingFields, setDubbingFields] = useState<VideoUploadField[]>([]);
  const [CountryDrawerOpen, setCountryDrawerOpen] = useState<{type: 'subtitle' | 'dubbing'; index: number} | null>(
    null,
  );
  const [videoFile, setVideoFile] = useState<string | null>(null); // 비디오 업로드 상태
  const [videoName, setVideoName] = useState<string | null>(null); // 비디오 업로드 상태

  const CountryItems = (type: 'subtitle' | 'dubbing', index: number): SelectDrawerItem[] => [
    {name: 'Korean', onClick: () => handleCountryChange(type, index, CountryTypes.Korean)},
    {name: 'English', onClick: () => handleCountryChange(type, index, CountryTypes.English)},
    {name: 'Japanese', onClick: () => handleCountryChange(type, index, CountryTypes.Japanese)},
    {name: 'French', onClick: () => handleCountryChange(type, index, CountryTypes.French)},
    {name: 'Spanish', onClick: () => handleCountryChange(type, index, CountryTypes.Spanish)},
    {name: 'Chinese (Simplified)', onClick: () => handleCountryChange(type, index, CountryTypes.ChineseSimplified)},
    {name: 'Chinese (Traditional)', onClick: () => handleCountryChange(type, index, CountryTypes.ChineseTraditional)},
    {name: 'Portuguese', onClick: () => handleCountryChange(type, index, CountryTypes.Portuguese)},
    {name: 'German', onClick: () => handleCountryChange(type, index, CountryTypes.German)},
  ];

  const handleAddUploader = (type: 'subtitle' | 'dubbing') => {
    if (type === 'subtitle') {
      setSubtitleFields([...subtitleFields, {id: Date.now(), selectedCountry: CountryTypes.Korean}]);
    } else {
      setDubbingFields([...dubbingFields, {id: Date.now(), selectedCountry: CountryTypes.Korean}]);
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

  const handleCountryChange = (type: 'subtitle' | 'dubbing', index: number, country: CountryTypes) => {
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
        const fileName = response.data.fileName; // 📌 추가된 fileName
        const playTime = response.data.playTime;
        console.log(`${type} uploaded:`, fileUrl, fileName);

        if (type === 'video') {
          setVideoFile(fileUrl);
          setVideoName(fileName); // 📌 추가된 fileName 저장
          setEpisodeVideoInfo(prev => ({
            ...prev,
            videoSourceFileUrl: fileUrl,
            videoSourceFileName: fileName, // 📌 기존 files[0].name → fileName으로 변경
            playTime: playTime,
          }));
        } else if (type === 'subtitle' && index !== undefined) {
          setSubtitleFields(prevFields =>
            prevFields.map((field, i) => (i === index ? {...field, fileUrl, fileName} : field)),
          );
          setEpisodeVideoInfo(prev => ({
            ...prev,
            subtitleFileUrls: prev.subtitleFileUrls.map((url, i) => (i === index ? fileUrl : url)),
            subtitleFileNames: prev.subtitleFileNames.map((name, i) => (i === index ? fileName : name)), // 📌 추가된 fileName 적용
          }));
        } else if (type === 'dubbing' && index !== undefined) {
          setDubbingFields(prevFields =>
            prevFields.map((field, i) => (i === index ? {...field, fileUrl, fileName} : field)),
          );
          setEpisodeVideoInfo(prev => ({
            ...prev,
            dubbingFileUrls: prev.dubbingFileUrls.map((url, i) => (i === index ? fileUrl : url)),
            dubbingFileNames: prev.dubbingFileNames.map((name, i) => (i === index ? fileName : name)), // 📌 추가된 fileName 적용
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
    } else if (type === 'subtitle' && index !== undefined) {
      setSubtitleFields(prevFields =>
        prevFields.map((field, i) => (i === index ? {...field, fileUrl: undefined} : field)),
      );
    } else if (type === 'dubbing' && index !== undefined) {
      setDubbingFields(prevFields =>
        prevFields.map((field, i) => (i === index ? {...field, fileUrl: undefined} : field)),
      );
    }
  };

  const renderUploader = (type: 'subtitle' | 'dubbing', field: VideoUploadField, index: number) => {
    return (
      <div key={field.id} className={styles.uploadGroup}>
        {/* 국가 선택 드롭다운 */}
        <div className={styles.countryUploadBox} onClick={() => setCountryDrawerOpen({type, index})}>
          {CountryTypes[field.selectedCountry]}
          <img src={LineArrowDown.src} className={styles.lineArrowDown} />
        </div>

        {/* 업로드된 파일 표시 */}
        <div className={styles.videoUploadBox}>
          {field.fileUrl ? (
            <>
              <div className={styles.textInBoxGroup}>
                <span className={styles.textInBox}>{field.fileName}</span> // 파일명 표시
                <img src={CircleClose.src} className={styles.circleClose}></img>
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
              input.accept = type === 'subtitle' ? '.srt,.txt' : 'audio/*';
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
            Upload
          </button>
          <button className={styles.deleteButton} onClick={() => handleRemoveSpecificField(type, index)}>
            <img src={LineDelete.src} alt="Delete" className={styles.icon} />
            Delete
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
      <span className={styles.previewLabel}>Preview</span>
      <div className={styles.videoUploadContainer}>
        <span className={styles.label}>Video</span>
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
              Upload
            </button>
          </div>
        </div>
        <div className={styles.subtitleContainer}>
          <span className={styles.label}>Subtitle</span>
          <button className={styles.addButton} onClick={() => handleAddUploader('subtitle')}>
            + Add
          </button>
        </div>{' '}
        {subtitleFields.map((field, index) => renderUploader('subtitle', field, index))}
        <div className={styles.dubbingContainer}>
          <span className={styles.label}>Dubbing</span>
          <button className={styles.addButton} onClick={() => handleAddUploader('dubbing')}>
            + Add
          </button>
        </div>
        {dubbingFields.map((field, index) => renderUploader('dubbing', field, index))}
      </div>
      <span className={styles.grayLabel}>write media file type</span>
    </>
  );
};

export default VideoContentUpload;
