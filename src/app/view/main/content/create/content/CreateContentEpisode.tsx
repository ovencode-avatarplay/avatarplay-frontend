import React, {useEffect, useState} from 'react';
import styles from './CreateContentEpisode.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {ToastMessageAtom, ToastType} from '@/app/Root';
import {useAtom} from 'jotai';
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
import {LanguageType} from '@/app/NetWork/network-interface/CommonEnums';
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
  sendGetContent,
  sendGetEpisode,
} from '@/app/NetWork/ContentNetwork';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

export interface CreateContentEpisodeProps {
  contentId?: string;
  curSeason: number;
  curEpisodeCount: number;
  episodeId?: number;
}

const CreateContentEpisode: React.FC<CreateContentEpisodeProps> = ({
  contentId,
  curSeason,
  curEpisodeCount,
  episodeId,
}) => {
  const [contentInfo, setContentInfo] = useState<ContentInfo>();

  const [triggerWarning, setTriggerWarning] = useState<boolean>();
  const fetchContent = async (urlLinkKey: string) => {
    try {
      const response = await sendGetContent({urlLinkKey});
      setContentInfo(response.data?.contentInfo);
      console.log('📌 조회된 Content 정보:', response.data?.contentInfo);
    } catch (error) {
      console.error('❌ Content 불러오기 실패:', error);
    }
  };

  const [editContentInfo, setEditContentInfo] = useState<ContentEpisodeInfo>();

  const [defaultImage, setDefaultImage] = useState<string>();

  useEffect(() => {
    if (contentId === undefined) return;
    if (episodeId === undefined) return;

    const fetchData = async () => {
      try {
        const response = await sendGetEpisode({episodeId});

        if (response.data) {
          console.log('콘텐츠 정보:', response.data.episodeInfo);
          const content = response.data.episodeInfo;
          if (content) setEditContentInfo(content);

          // 기존 데이터로 초기화
          setNameValue(content.name || '');
          setrDescription(content.description || '');
          setMediaUrls([content.thumbnailUrl || '']);

          setDefaultImage(content.thumbnailUrl);
          if (content.episodeVideoInfo) setEpisodeVideoInfo(content.episodeVideoInfo);
          if (content.episodeWebtoonInfo) setEpisodeWebtoonInfo(content.episodeWebtoonInfo);
          if (content.salesStarEa > 0) {
            setIsFree(true);
            setPriceValue(content.salesStarEa);
          }
        }
      } catch (error) {
        console.error('콘텐츠 조회 실패:', error);
      }
    };

    fetchData();
  }, [episodeId]);

  useEffect(() => {
    if (contentId) fetchContent(contentId); // contentId가 123인 콘텐츠 조회
  }, []);

  // 사용 예시

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
    videoSourceFileInfo: {
      videoLanguageType: ContentLanguageType.Korean,
      tempFileName: '',
      videoFileName: '',
    },
    subTitleFileInfos: [],
    dubbingFileInfos: [],
  });

  const [episodeWebtoonInfo, setEpisodeWebtoonInfo] = useState<ContentEpisodeWebtoonInfo>({
    likeCount: 0,
    webtoonSourceUrlList: [], // 언어별 웹툰 소스 리스트 (초기값: 빈 배열)
  });

  useEffect(() => {
    console.log('episodeWebtoonInfo', episodeWebtoonInfo);
  }, [episodeVideoInfo, episodeWebtoonInfo]);

  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const createNewEpisode = async () => {
    const validations = [
      {
        condition: !contentInfo?.id || curSeason === 0 || curEpisodeCount + 1 === 0,
        message: '필수 요소 (콘텐츠 ID, 시즌 번호, 에피소드 번호) 누락',
      },
      {
        condition: !mediaUrls[0],
        message: '썸네일이 설정되지 않았습니다.',
      },
      {
        condition: !nameValue.trim(),
        message: '에피소드 이름을 입력해주세요.',
      },
      {
        condition: !descValue.trim(),
        message: '에피소드 설명을 입력해주세요.',
      },
      {
        condition: contentInfo?.categoryType === 1 && !episodeVideoInfo?.videoSourceFileInfo?.videoFileName,
        message: '비디오 파일이 업로드되지 않았습니다.',
      },
      {
        condition: contentInfo?.categoryType === 0 && episodeWebtoonInfo?.webtoonSourceUrlList?.length === 0,
        message: '이미지 파일이 업로드되지 않았습니다.',
      },
    ];

    for (const {condition, message} of validations) {
      if (condition) {
        dataToast.open(getLocalizedText('common_alert_093'), ToastType.Error);
        setTriggerWarning(true);
        return;
      }
    }

    const newEpisode: ContentEpisodeInfo = {
      id: editContentInfo?.id ?? 0,
      contentId: contentInfo?.id ?? 0, // 이 부분도 동일하게 처리
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

        pushLocalizedRoute(`/create/content/series/${contentId}`, router);
      }
    } catch (error) {
      console.error('에피소드 생성 실패:', error);
      alert('에피소드 생성에 실패했습니다. 다시 시도해주세요.');
    }
  };
  const epNum = curEpisodeCount + 1;
  const router = useRouter();
  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        <CustomArrowHeader
          title={episodeId ? getLocalizedText('common_title_edit') : getLocalizedText('createcontent007_title_001')}
          onClose={() => {
            pushLocalizedRoute(`/create/content/series/${contentId}`, router);
          }}
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
        <span className={styles.label}>{getLocalizedText('createcontent003_label_001')}</span>
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
          <span className={styles.epLabel}>
            {formatText(getLocalizedText('contenthome001_label_001'), [epNum.toString()])}
          </span>
          {getLocalizedText('createcontent007_desc_002')}

          <MediaUpload
            setContentMediaUrls={setMediaUrls}
            defaultImage={defaultImage ? defaultImage : undefined}
            triggerWarning={triggerWarning}
          ></MediaUpload>
        </div>
        <CustomInput
          inputType="Basic"
          textType="Label"
          value={nameValue}
          onChange={handleNameChange}
          label={
            <span>
              {getLocalizedText('createcontent007_label_003')}{' '}
              <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder={getLocalizedText('common_sample_088')}
          customClassName={[styles.textInput]}
          error={triggerWarning}
        />
        <span className={styles.label}>
          {getLocalizedText('createcontent007_label_004')}{' '}
          <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
        </span>
        <MaxTextInput
          displayDataType={displayType.Hint}
          labelText="Introduction"
          promptValue={descValue}
          handlePromptChange={e => setrDescription(e.target.value)}
          maxPromptLength={500}
          style={{minHeight: '190px', width: '100%'}}
          placeholder={getLocalizedText('common_sample_047')}
          isError={triggerWarning}
        />

        {contentInfo?.categoryType == ContentCategoryType.Video && (
          <VideoContentUpload
            setEpisodeVideoInfo={setEpisodeVideoInfo}
            defaultEpisodeVideoInfo={editContentInfo?.episodeVideoInfo} // 기존 데이터 전달
            hasError={triggerWarning}
          />
        )}
        {contentInfo?.categoryType == ContentCategoryType.Webtoon && (
          <WebtoonContentUpload
            setEpisodeWebtoonInfo={setEpisodeWebtoonInfo}
            defaultEpisodeWebtoonInfo={editContentInfo?.episodeWebtoonInfo} // 기존 데이터 전달
            hasError={triggerWarning}
          />
        )}

        <div className={styles.moenetization}>
          <span className={styles.label}>{getLocalizedText('common_label_006')}</span>
          <button className={styles.questionButton}>
            <img src={BoldQuestion.src} className={styles.questionimg}></img>
          </button>
        </div>
        <div className={styles.radioButtonGroup}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="On"
            label={getLocalizedText('common_button_on')}
            onSelect={() => setIsMonetization(true)}
            selectedValue={isMonetization ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label={getLocalizedText('common_button_off')}
            onSelect={() => setIsMonetization(false)}
            selectedValue={isMonetization ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
        </div>
        <div className={styles.salesStar}>
          <span className={styles.label} style={{lineHeight: '24px'}}>
            {getLocalizedText('createcontent007_label_008')}
          </span>
          <div className={styles.salesStarSetting} onClick={() => setOnSeta(true)}>
            {' '}
            {getLocalizedText('common_button_setting')}
          </div>
        </div>
        <div className={styles.confirmButtonBackground}></div>
        <button className={styles.confirmButton} onClick={handleConfirm}>
          {getLocalizedText('common_button_submit')}
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
            label={getLocalizedText('createcontent007_label_009')}
            onSelect={() => setIsFree(!isFree)}
            selectedValue={isFree == false ? 0 : 1}
            containterStyle={{gap: '0'}}
          ></CustomRadioButton>
          <div style={{gap: '10px', display: 'flex', flexDirection: 'column', width: '100%'}}>
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
                <span className={styles.starlabel}>{getLocalizedText('createcontent007_label_010')}</span>
              </div>
            )}
            <button
              className={styles.setaConfirm}
              onClick={() => {
                setOnSeta(false);
              }}
            >
              {getLocalizedText('common_button_confirm')}
            </button>
          </div>
        </div>
      </SelectDrawer>
    </div>
  );
};

export default CreateContentEpisode;
