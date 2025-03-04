import React, {useEffect, useState} from 'react';
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
  ContentEpisodeWebtoonInfo,
  sendCreateEpisode,
  ContentEpisodeVideoInfo,
  ContentLanguageType,
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
    createNewEpisode();
  };
  const [onSeta, setOnSeta] = useState<boolean>(false);
  const [nameValue, setNameValue] = useState<string>('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setNameValue(e.target.value);
    }
  };

  const [priceValue, setPriceValue] = useState<number>(0);

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10); // 정수 변환
    setPriceValue(isNaN(value) ? 0 : value); // 숫자가 아닐 경우 기본값 0 설정
  };

  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const [descValue, setrDescription] = useState<string>('');

  const [isMonetization, setIsMonetization] = useState<boolean>(false);
  const [isFree, setIsFree] = useState<boolean>(false);

  const [episodeVideoInfo, setEpisodeVideoInfo] = useState<ContentEpisodeVideoInfo>({
    likeCount: 0, // 기본 값: 0
    videoSourcePlayTime: '00:00', // 기본 값: 빈 시간 또는 "00:00"
    videoSourceFileInfo: {
      videoLanguageType: ContentLanguageType.Korean, // 기본 언어 설정
      videoSourceUrl: '', // 비디오 URL 초기값
      videoSourceName: '', // 비디오 이름 초기값
    },
    subTitleFileInfos: [], // 자막 파일 정보 (빈 배열)
    dubbingFileInfos: [], // 더빙 파일 정보 (빈 배열)
  });
  const [episodeWebtoonInfo, setEpisodeWebtoonInfo] = useState<ContentEpisodeWebtoonInfo>({
    likeCount: 0,
    webtoonSourceUrlList: [], // 언어별 웹툰 소스 리스트 (초기값: 빈 배열)
  });

  useEffect(() => {
    console.log('episodeWebtoonInfo', episodeWebtoonInfo);
  }, [episodeVideoInfo, episodeWebtoonInfo]);

  const createNewEpisode = async () => {
    if (!contentInfo?.id || curSeason === 0 || curEpisodeCount + 1 === 0) {
      alert('필수 요소 (콘텐츠 ID, 시즌 번호, 에피소드 번호) 누락');
      return;
    }
    if (!mediaUrls[0]) {
      alert('썸네일이 설정되지 않았습니다.');
      return;
    }
    if (!nameValue.trim()) {
      alert('에피소드 이름을 입력해주세요.');
      return;
    }
    if (!descValue.trim()) {
      alert('에피소드 설명을 입력해주세요.');
      return;
    }
    if (contentInfo.categoryType == 1 && !episodeVideoInfo.videoSourceFileInfo.videoSourceUrl) {
      alert('비디오 파일이 업로드되지 않았습니다.');
      return;
    }

    if (contentInfo.categoryType == 0 && episodeWebtoonInfo.webtoonSourceUrlList.length == 0) {
      alert('이미지 파일이 업로드되지 않았습니다.');
      return;
    }

    const newEpisode: ContentEpisodeInfo = {
      contentId: contentInfo ? contentInfo?.id : 0, // 필수: 콘텐츠 ID
      seasonNo: curSeason, // 필수: 시즌 번호
      episodeNo: curEpisodeCount + 1, // 필수: 에피소드 번호
      thumbnailUrl: mediaUrls[0], // 필수: 썸네일
      name: nameValue, // 필수: 이름
      description: descValue, // 필수: 설명
      monetization: isMonetization,
      salesStarEa: priceValue,
      likeCount: 0,
      episodeVideoInfo: episodeVideoInfo,
      episodeWebtoonInfo: episodeWebtoonInfo,
    };

    const payload: CreateEpisodeReq = {episodeInfo: newEpisode};

    try {
      const response = await sendCreateEpisode(payload);
      if (response.data) {
        console.log('에피소드 생성 성공:', response.data.episodeId);
        alert(`에피소드가 성공적으로 생성되었습니다! (ID: ${response.data.episodeId})`);
        onNext();
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
        {contentInfo?.categoryType == ContentCategoryType.Webtoon && (
          <WebtoonContentUpload setEpisodeWebtoonInfo={setEpisodeWebtoonInfo}></WebtoonContentUpload>
        )}

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
            <button
              className={styles.setaConfirm}
              onClick={() => {
                setOnSeta(false);
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </SelectDrawer>
    </div>
  );
};

export default CreateContentEpisode;
