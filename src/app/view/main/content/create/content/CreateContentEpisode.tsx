import React, {useState} from 'react';
import styles from './CreateContentEpisode.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {BoldArrowDown, BoldQuestion, LineArrowDown, LineClose, LineDashboard, LineDelete, LineUpload} from '@ui/Icons';
import MediaUpload from './MediaUpload/MediaUpload';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {LanguageType} from '@/app/NetWork/AuthNetwork';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {UploadMediaState} from '@/redux-store/slices/StoryInfo';
import {MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import VideoContentUpload from './MediaUpload/VideoContentUpload';
import WebtoonContentUpload from './MediaUpload/WebtoonContentUpload';
enum CountryTypes {
  Korea = 0,
  Japan = 1,
}
interface UploadField {
  id: number;
  selectedCountry: CountryTypes;
  fileUrl?: string; // 업로드된 파일의 URL 저장
}
interface CreateContentEpisodeProps {
  onNext: () => void;
  onPrev: () => void;
}

const CreateContentEpisode: React.FC<CreateContentEpisodeProps> = ({onNext, onPrev}) => {
  const handleConfirm = () => {
    onNext();
  };

  const [nameValue, setNameValue] = useState<string>('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setNameValue(e.target.value);
    }
  };

  const [descValue, setrDescription] = useState<string>('');

  const [isMonetization, setIsMonetization] = useState<boolean>(false);

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
    <div className={styles.parent}>
      <div className={styles.header}>
        <CustomArrowHeader
          title="Create Series Contents"
          onClose={onPrev}
          children={
            <div className={styles.rightArea}>
              <button className={styles.dashBoard} onClick={() => {}}>
                <img className={styles.dashBoardIcon} src={LineDashboard.src} />
              </button>
            </div>
          }
        />
      </div>
      <div className={styles.container}>
        <span className={styles.label}>Series Name</span>
        <div className={styles.dropdown}>
          <span className={styles.text}>A Person I met by chance</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.label}>video/action</span>
          <span className={styles.label}>#love #text2</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.seasonLabel}>Season 1</span>
          <span className={styles.epLabel}>Episode No.20</span>
          <span className={styles.tokenLabel}>The total token count is calulated based on the</span>
          <span className={styles.tokenLabel}>introduction with the highest number of tokens</span>

          <MediaUpload title=""></MediaUpload>
        </div>
        <CustomInput
          inputType="Basic"
          textType="Label"
          value={nameValue}
          onChange={handleNameChange}
          label={
            <span>
              Episode Name <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder="Please enter a title for your post"
          customClassName={[styles.textInput]}
        />
        <span className={styles.label}>
          Episode Description <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
        </span>
        <MaxTextInput
          displayDataType={displayType.Hint}
          labelText="Introduction"
          promptValue={descValue}
          handlePromptChange={e => setrDescription(e.target.value)}
          maxPromptLength={500}
          style={{minHeight: '190px', width: '100%'}}
          placeholder="Add a description or hastag"
        />
        {/* <VideoContentUpload></VideoContentUpload> */}
        <WebtoonContentUpload></WebtoonContentUpload>
        <div className={styles.moenetization}>
          <span className={styles.label}>Moenetization</span>
          <button className={styles.questionButton}>
            <img src={BoldQuestion.src} className={styles.questionimg}></img>
          </button>
        </div>
        <div className={styles.radioButtonGroup}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="On"
            label="On"
            onSelect={() => setIsMonetization(true)}
            selectedValue={isMonetization ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label="Off"
            onSelect={() => setIsMonetization(false)}
            selectedValue={isMonetization ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
        </div>
        <div className={styles.salesStar}>
          <span className={styles.label} style={{lineHeight: '24px'}}>
            Sales Star EA
          </span>
          <div className={styles.salesStarSetting}> Setting</div>
        </div>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
};

export default CreateContentEpisode;
