import React, {useState} from 'react';
import styles from './VideoContentUpload.module.css';
import {BoldArrowDown, BoldQuestion, LineArrowDown, LineClose, LineDashboard, LineDelete, LineUpload} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {UploadMediaState} from '@/redux-store/slices/ContentInfo';
import {MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
enum CountryTypes {
  Korea = 0,
  Japan = 1,
}
interface UploadField {
  id: number;
  selectedCountry: CountryTypes;
  fileUrl?: string; // 업로드된 파일의 URL 저장
}
interface CreateContentEpisodeProps {}

const VideoContentUpload: React.FC<CreateContentEpisodeProps> = ({}) => {
  const [subtitleFields, setSubtitleFields] = useState<UploadField[]>([]);
  const [dubbingFields, setDubbingFields] = useState<UploadField[]>([]);
  const [CountryDrawerOpen, setCountryDrawerOpen] = useState<{type: 'subtitle' | 'dubbing'; index: number} | null>(
    null,
  );
  const [videoFile, setVideoFile] = useState<string | null>(null); // 비디오 업로드 상태

  const CountryItems = (type: 'subtitle' | 'dubbing', index: number): SelectDrawerItem[] => [
    {name: 'Korea', onClick: () => handleCountryChange(type, index, CountryTypes.Korea)},
    {name: 'Japan', onClick: () => handleCountryChange(type, index, CountryTypes.Japan)},
  ];

  const handleAddUploader = (type: 'subtitle' | 'dubbing') => {
    if (type === 'subtitle') {
      setSubtitleFields([...subtitleFields, {id: Date.now(), selectedCountry: CountryTypes.Korea}]);
    } else {
      setDubbingFields([...dubbingFields, {id: Date.now(), selectedCountry: CountryTypes.Korea}]);
    }
  };

  const handleRemoveUploader = (type: 'subtitle' | 'dubbing', id: number) => {
    if (type === 'subtitle') {
      setSubtitleFields(subtitleFields.filter(field => field.id !== id));
    } else {
      setDubbingFields(dubbingFields.filter(field => field.id !== id));
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

  // 파일 업로드 처리
  const handleFileUpload = async (type: 'video' | 'subtitle' | 'dubbing', files: File[], index?: number) => {
    try {
      let mediaState: UploadMediaState;

      if (type === 'video') mediaState = UploadMediaState.ContentVideo;
      else if (type === 'subtitle') mediaState = UploadMediaState.ContentSubtitle;
      else mediaState = UploadMediaState.ContentDubbing;

      const req: MediaUploadReq = {mediaState, file: files[0]};
      const response = await sendUpload(req);

      if (response?.data) {
        const fileUrl = response.data.url;

        if (type === 'video') {
          setVideoFile(fileUrl);
        } else if (type === 'subtitle' && index !== undefined) {
          setSubtitleFields(prevFields => prevFields.map((field, i) => (i === index ? {...field, fileUrl} : field)));
        } else if (type === 'dubbing' && index !== undefined) {
          setDubbingFields(prevFields => prevFields.map((field, i) => (i === index ? {...field, fileUrl} : field)));
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

  const renderUploader = (type: 'subtitle' | 'dubbing', field: UploadField, index: number) => {
    return (
      <div key={field.id} className={styles.uploadGroup}>
        {/* 국가 선택 드롭다운 */}
        <div className={styles.countryUploadBox} onClick={() => setCountryDrawerOpen({type, index})}>
          {field.selectedCountry === CountryTypes.Korea ? 'Korea' : 'Japan'}
          <img src={LineArrowDown.src} className={styles.lineArrowDown} />
        </div>

        {/* 업로드된 파일 표시 */}
        <div className={styles.videoUploadBox}>
          {field.fileUrl ? (
            <span>{field.fileUrl.split('/').pop()}</span> // 파일명 표시
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
          {field.fileUrl ? (
            <button className={styles.deleteButton} onClick={() => handleRemoveFile(type, index)}>
              <img src={LineDelete.src} alt="Delete" className={styles.icon} />
              Delete
            </button>
          ) : (
            <button className={styles.deleteButton}>
              <img src={LineDelete.src} alt="Delete" className={styles.icon} />
              Delete
            </button>
          )}
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
            {videoFile ? <video src={videoFile} controls width="100%" /> : <span>No video uploaded</span>}
          </div>

          <div className={styles.videoButtonContainer}>
            <button
              className={styles.uploadButton}
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

            {videoFile ? (
              <button className={styles.deleteButton} onClick={() => handleRemoveFile('video')}>
                <img src={LineDelete.src} alt="Delete" className={styles.icon} />
                Delete
              </button>
            ) : (
              <button className={styles.deleteButton}>
                <img src={LineDelete.src} alt="Delete" className={styles.icon} />
                Delete
              </button>
            )}
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
