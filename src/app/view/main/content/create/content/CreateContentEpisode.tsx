import React, {useState} from 'react';
import styles from './CreateContentEpisode.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {
  BoldArrowDown,
  BoldQuestion,
  BoldStar,
  LineArrowDown,
  LineClose,
  LineDashboard,
  LineDelete,
  LineUpload,
} from '@ui/Icons';
import MediaUpload from './MediaUpload/MediaUpload';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {LanguageType} from '@/app/NetWork/AuthNetwork';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {MediaUploadReq, sendUpload, UploadMediaState} from '@/app/NetWork/ImageNetwork';
import VideoContentUpload from './MediaUpload/VideoContentUpload';
import WebtoonContentUpload from './MediaUpload/WebtoonContentUpload';
import {
  ContentCategoryType,
  ContentEpisodeInfo,
  ContentInfo,
  ContentListInfo,
  CreateEpisodeReq,
  EpisodeVideoInfo,
  EpisodeWebtoonInfo,
  sendCreateEpisode,
} from '@/app/NetWork/ContentNetwork';
import {Seasons} from './SeriesDetail';
import {Category} from '@mui/icons-material';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
enum CountryTypes {
  Korea = 0,
  Japan = 1,
}
interface CreateContentEpisodeProps {
  onNext: () => void;
  onPrev: () => void;
  contentInfo?: ContentListInfo;
  curSeason: number;
  curEpisodeCount: number;
}

const CreateContentEpisode: React.FC<CreateContentEpisodeProps> = ({
  onNext,
  onPrev,
  contentInfo,
  curSeason,
  curEpisodeCount,
}) => {
  const handleConfirm = () => {
    onNext();
  };
  const [onSeta, setOnSeta] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setNameValue(e.target.value);
    }
  };

  const [priceValue, setPriceValue] = useState<string>('');
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // if (e.target.value.length <= 20) {
    setPriceValue(e.target.value);
    // }
  };
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [descValue, setrDescription] = useState<string>('');

  const [isMonetization, setIsMonetization] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(false);

  const [episodeVideoInfo, setEpisodeVideoInfo] = useState<EpisodeVideoInfo>({
    videoSourceFileUrl: '',
    videoSourceFileName: '',
    playTime: '',
    likeCount: 0,
    subtitleFileUrls: [],
    subtitleFileNames: [],
    dubbingFileUrls: [],
    dubbingFileNames: [],
  });

  const [episodeWebtoonInfo, setEpisodeWebtoonInfo] = useState<EpisodeWebtoonInfo>({
    likeCount: 0,
    webtoonSourceUrls: [],
    webtoonSourceNames: [],
    languagePackUrls: [],
    languagePackNames: [],
  });

  const createNewEpisode = async () => {
    if (!contentInfo) return;
    const newEpisode: ContentEpisodeInfo = {
      contentId: contentInfo?.id, // 필수: 콘텐츠 ID
      seasonNo: curSeason, // 필수: 시즌 번호
      episodeNo: curEpisodeCount + 1, // 필수: 에피소드 번호
      thumbnailUrl: mediaUrls[0], // 필수: 썸네일
      name: nameValue, // 필수: 이름
      description: descValue, // 필수: 설명
      monetization: isMonetization,
      salesStarEa: 50,
      likeCount: 0,
      episodeVideoInfo: {
        videoSourceFileUrl: 'https://example.com/video.mp4',
        videoSourceFileName: 'video.mp4',
        playTime: '00:10:30',
        likeCount: 0,
        subtitleFileUrls: ['https://example.com/subtitle.srt'],
        subtitleFileNames: ['subtitle.srt'],
        dubbingFileUrls: ['https://example.com/dubbing.mp3'],
        dubbingFileNames: ['dubbing.mp3'],
      },
      episodeWebtoonInfo: {
        likeCount: 0,
        webtoonSourceUrls: ['https://example.com/webtoon.jpg'],
        webtoonSourceNames: ['웹툰 1'],
        languagePackUrls: ['https://example.com/lang.zip'],
        languagePackNames: ['한국어 패키지'],
      },
    };

    // 📌 필수 입력값 검증 (비어있을 경우 alert)
    if (!newEpisode.contentId) {
      alert('콘텐츠 ID가 없습니다.');
      return;
    }
    if (!newEpisode.seasonNo) {
      alert('시즌 번호를 입력해주세요.');
      return;
    }
    if (!newEpisode.episodeNo) {
      alert('에피소드 번호를 입력해주세요.');
      return;
    }
    if (!newEpisode.thumbnailUrl.trim()) {
      alert('썸네일을 업로드해주세요.');
      return;
    }
    if (!newEpisode.name.trim()) {
      alert('에피소드 이름을 입력해주세요.');
      return;
    }
    if (!newEpisode.description.trim()) {
      alert('에피소드 설명을 입력해주세요.');
      return;
    }

    const payload: CreateEpisodeReq = {episodeInfo: newEpisode};

    try {
      const response = await sendCreateEpisode(payload);
      if (response.data) {
        console.log('에피소드 생성 성공:', response.data.episodeId);
        alert(`에피소드가 성공적으로 생성되었습니다! (ID: ${response.data.episodeId})`);
      }
    } catch (error) {
      console.error('에피소드 생성 실패:', error);
      alert('에피소드 생성에 실패했습니다. 다시 시도해주세요.');
    }
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
        <span className={styles.label}>Series name</span>
        <div className={styles.dropdown}>
          <span className={styles.text}>{contentInfo?.name}</span>
        </div>
        <div className={styles.tags}>
          <span className={styles.label}>
            {ContentCategoryType[contentInfo ? contentInfo?.categoryType : 0]}/{contentInfo?.genre}
          </span>
          <span className={styles.label}>contoent</span>
        </div>
        <div className={styles.infoGroup}>
          <span className={styles.seasonLabel}>Season {curSeason}</span>
          <span className={styles.epLabel}>Episode No.{curEpisodeCount + 1}</span>
          <span className={styles.tokenLabel}>The total token count is calulated based on the</span>
          <span className={styles.tokenLabel}>introduction with the highest number of tokens</span>

          <MediaUpload title="" setContentMediaUrls={setMediaUrls}></MediaUpload>
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

        {contentInfo?.categoryType == ContentCategoryType.Video && (
          <VideoContentUpload setEpisodeVideoInfo={setEpisodeVideoInfo}></VideoContentUpload>
        )}
        {contentInfo?.categoryType == ContentCategoryType.Webtoon && <WebtoonContentUpload></WebtoonContentUpload>}

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
          <div className={styles.salesStarSetting} onClick={() => setOnSeta(true)}>
            {' '}
            Setting
          </div>
        </div>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          Confirm
        </button>
      </div>

      <SelectDrawer
        isOpen={onSeta}
        onClose={() => setOnSeta(false)}
        items={[]}
        selectedIndex={0}
        tooltip=""
        name="Individual Episode Amount"
      >
        {' '}
        <div className={styles.setaTitleGroup}>
          <div style={{gap: '5px', display: 'flex', flexDirection: 'column', marginTop: '22px'}}>
            <span className={styles.setaEp}>EP.{curEpisodeCount + 1}</span>
            <span className={styles.setaName}> {nameValue != '' ? nameValue : 'No name'} </span>
          </div>
          <CustomRadioButton
            shapeType="square"
            displayType="buttonText"
            value={0}
            label="Free Episode"
            onSelect={() => setIsFree(!isFree)}
            selectedValue={isFree == false ? 0 : 1}
            containterStyle={{gap: '0'}}
          ></CustomRadioButton>
          <div style={{gap: '10px', display: 'flex', flexDirection: 'column'}}>
            {isFree != false && (
              <div className={styles.inputBox}>
                <img src={BoldStar.src} className={styles.starstar}></img>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="Enter Price..."
                  value={priceValue}
                  onChange={handlePriceChange}
                />
                <span className={styles.starlabel}>EA</span>
              </div>
            )}
            <button className={styles.setaConfirm}>Confirm</button>
          </div>
        </div>
      </SelectDrawer>
    </div>
  );
};

export default CreateContentEpisode;
