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
enum CountryTypes {
  Korea = 0,
  Japan = 1,
}
interface UploadField {
  id: number;
  selectedCountry: CountryTypes;
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

  const renderUploader = (type: 'subtitle' | 'dubbing', field: UploadField, index: number) => {
    return (
      <div key={field.id} className={styles.uploadGroup}>
        <div className={styles.countryUploadBox} onClick={() => setCountryDrawerOpen({type, index})}>
          {CountryTypes[field.selectedCountry]} <img src={LineArrowDown.src} className={styles.lineArrowDown} />
        </div>
        <div className={styles.videoUploadBox}></div>
        <div className={styles.videoButtonContainer}>
          <button className={styles.uploadButton}>
            <img src={LineUpload.src} alt="Upload" className={styles.icon} />
            Upload
          </button>
          <button className={styles.deleteButton} onClick={() => handleRemoveUploader(type, field.id)}>
            <img src={LineDelete.src} alt="Delete" className={styles.icon} />
            Delete
          </button>
        </div>

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

        <span className={styles.previewLabel}>Preview</span>
        <div className={styles.videoUploadContainer}>
          <span className={styles.label}>Video</span>
          <div className={styles.uploadGroup}>
            <div className={styles.videoUploadBox}>asdsa</div>
            <div className={styles.videoButtonContainer}>
              <button className={styles.uploadButton}>
                <img src={LineUpload.src} alt="Upload" className={styles.icon} />
                Upload
              </button>
              <button className={styles.deleteButton}>
                <img src={LineDelete.src} alt="Delete" className={styles.icon} />
                Delete
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
