'use client';

import React, {useEffect, useState} from 'react';
import {getCurrentLanguage} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import styles from './PostMain.module.css';
import {BoldQuestion, CircleClose, LineUpload} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import ReactPlayer from 'react-player';
import PostImageGrid from './PostImageGrid';
import {sendCreateFeed, CreateFeedReq, sendGetFeed} from '@/app/NetWork/ShortsNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import CustomInput from '@/components/layout/shared/CustomInput';
import MaxTextInput, {displayType} from '@/components/create/MaxTextInput';
import CustomDropDownSelectDrawer from '@/components/layout/shared/CustomDropDownSelectDrawer';
import {VisibilityType} from '@/app/NetWork/ContentNetwork';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import DrawerTagSelect from '../common/DrawerTagSelect';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import useCustomRouter from '@/utils/useCustomRouter';
import getLocalizedText from '@/utils/getLocalizedText';
import {getVisibilityTypeKey} from '../content/CreateSeriesContent';
import {useAtom} from 'jotai';
import {ToastMessageAtom, ToastType} from '@/app/Root';
import TagsData from 'data/create/tags.json';
import CustomChipSelector from '@/components/layout/shared/CustomChipSelector';
import ImageUpload from '@/components/create/ImageUpload';
import VideoUpload from '@/components/create/VideoUpload';
import {UploadMediaState} from '@/app/NetWork/ImageNetwork';
import {setVisibility} from '@/redux-store/slices/PublishInfo';

interface Props {
  id?: string;
  isUpdate?: boolean;
}
const mediaTypeConfig = {
  image: {
    label: 'Write Image File Type',
    hint: 'Write image file type (e.g., .png, .jpg, .jpeg)',
    accept: 'image/*', // 이미지 파일
  },
  video: {
    label: 'Write Video File Type',
    hint: 'Write video file type (e.g., .mp4, .mov, .avi)',
    accept: 'video/*', // 비디오 파일
  },
};
const PostMain: React.FC<Props> = ({id}) => {
  const {back} = useCustomRouter();
  const router = useRouter();
  const [text, setText] = useState(''); // 입력된 텍스트 상태
  const [warnPopup, setWarnPopup] = useState<boolean>(false); // 입력된 텍스트 상태
  const [publishPopup, setPublishPopup] = useState<boolean>(false); // 입력된 텍스트 상태
  const maxLength = 500; // 최대 문자 수
  const [isOpenSelectDrawer, setIsOpenSelectDrawer] = useState<boolean>(false);

  const [isOpenMediaDrawer, setIsOpenMediaDrawer] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [videoDuration, setVideoDuration] = useState<string | null>(null);
  const [nameValue, setTitleValue] = useState<string>('');
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length <= 20) {
      setTitleValue(e.target.value);
    }
  };

  const [descValue, setrDescription] = useState<string>('');

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOpen, setTagOpen] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const maxTagCount = 5;
  const [selectedTagAlertOn, setSelectedTagAlertOn] = useState(false);
  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  const handleTagSelect = (tag: string) => {
    if (selectedTags.includes(tag)) {
      handleTagRemove(tag);
    } else {
      if (selectedTags.length >= maxTagCount) {
        setSelectedTagAlertOn(true);
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };
  const tagGroups = TagsData;
  const themeGroup = tagGroups.tagGroups.find(group => group.category === 'Theme');

  const [feedId, setFeedId] = useState(-1);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const payload = {
            urlLinkKey: id, // 명시적으로 string 타입으로 캐스팅
            languageType: getCurrentLanguage(),
          };

          const response = await sendGetFeed(payload);

          if (response.resultCode === 0 && response.data) {
            const existingFeed = response.data.feedInfo;
            if (existingFeed) {
              setFeedId(existingFeed.id);
              setMediaUrls(existingFeed.mediaUrlList || []);
              console.log('mediaUrls', mediaUrls);
              if (existingFeed.mediaState == MediaState.Image) setMediaType('image');
              else if (existingFeed.mediaState == MediaState.Video) setMediaType('video');

              setTitleValue(existingFeed.title || '');
              setrDescription(existingFeed.description || '');
              setSelectedTags(existingFeed.hashTag ? existingFeed.hashTag.split(',') : []);
              setSelectedVisibility(existingFeed.isPinFix ? VisibilityType.Public : VisibilityType.Private);
              setIsNsfw(existingFeed.isBookmark || false);
              setVisibility(existingFeed.visibilityType);
            }
          }
        } catch (error) {
          console.error('Failed to fetch existing feed info:', error);
        }
      })();
    }
  }, [id]);

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (event.target.value.length <= maxLength) {
      setText(event.target.value); // 입력된 텍스트 업데이트
    }
  };
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image'); // State for media type
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  useEffect(() => {}, [mediaUrls]);

  const [loading, setLoading] = useState(false);
  const {label, hint, accept} = mediaTypeConfig[mediaType];

  const handleInit = () => {
    setMediaUrls([]);
    setText('');
  };
  // 파일 선택 시 처리
  // const handleOnFileSelect = async (files: File[]) => {
  //   try {
  //     // MediaState 설정
  //     let state = UploadMediaState.None;
  //     if (mediaType == 'image') state = UploadMediaState.FeedImage;
  //     if (mediaType == 'video') state = UploadMediaState.FeedVideo;

  //     // 업로드 요청 객체 생성
  //     const req: MediaUploadReq = {
  //       mediaState: state, // 적절한 MediaState 설정
  //     };

  //     if (state === UploadMediaState.FeedImage) {
  //       req.imageList = files;
  //     } else {
  //       req.file = files[0];
  //     }
  //     // 파일 업로드 API 호출
  //     const response = await sendUpload(req);

  //     if (response?.data) {
  //       const imgUrl: string = response.data.url; // 업로드된 메인 이미지 URL
  //       const additionalUrls: string[] = response.data.imageUrlList || []; // 추가 이미지 URL 리스트

  //       console.log('Uploaded Image URL:', imgUrl); // 업로드 결과 로그 출력
  //       console.log('Additional Image URLs:', additionalUrls); // 추가 이미지 결과 로그 출력

  //       // Redux 상태 업데이트를 위한 URL 리스트 생성
  //       const validImageUrls = [imgUrl, ...additionalUrls].filter(url => url !== null);

  //       // 상태 업데이트: 새로운 이미지 추가
  //       setMediaUrls(prevUrls => {
  //         const combinedUrls = [...prevUrls, ...validImageUrls];
  //         return combinedUrls.slice(0, 9); // 최대 9장 제한
  //       });

  //       console.log('Updated Trigger Info with Media URLs:', validImageUrls);
  //     } else {
  //       console.error('Failed to upload files:', files.map(file => file.name).join(', '));
  //     }
  //   } catch (error) {
  //     console.error('Error during file upload:', error);
  //   }
  // };

  // 이미지 삭제
  const handleMediaRemove = (indexToRemove: number) => {
    setMediaUrls(prevUrls => prevUrls.filter((_, index) => index !== indexToRemove));
  };

  // const selectVisibilityItems: SelectDrawerItem[] = [
  //   // {
  //   //   name: 'Take a photo',
  //   //   onClick: () => {
  //   //     handleTakePhoto();
  //   //   },
  //   // },
  //   {
  //     name: 'Workroom',
  //     onClick: () => {
  //       handleMediaLibrary();
  //     },
  //   },
  //   {
  //     name: 'My device',
  //     onClick: () => {
  //       handleChooseFile();
  //     },
  //   },
  // ];

  const mediaVisibilityItems: SelectDrawerItem[] = [
    {
      name: 'Select Image',
      onClick: () => {
        // setMediaUrls([]);
        setMediaType('image');
        setIsOpenSelectDrawer(true);
      },
    },
    {
      name: 'Select Video',
      onClick: () => {
        setMediaUrls([]);
        setMediaType('video');
        setIsOpenSelectDrawer(true);
      },
    },
  ];

  // const handleMediaLibrary = () => {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = accept; // mediaType에 따라 파일 형식 설정
  //   input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
  //   input.onchange = event => {
  //     const files = Array.from((event.target as HTMLInputElement).files || []);
  //     if (files.length > 0) {
  //       handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
  //     }
  //   };
  //   input.click();
  // };

  // const handleTakeMedia = () => {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = accept; // mediaType에 따라 파일 형식 설정
  //   input.capture = 'environment'; // 후면 카메라 (이미지/비디오)
  //   input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
  //   input.onchange = event => {
  //     const files = Array.from((event.target as HTMLInputElement).files || []);
  //     if (files.length > 0) {
  //       handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
  //     }
  //   };
  //   input.click();
  // };

  // const handleChooseFile = () => {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = accept; // mediaType에 따라 파일 형식 설정
  //   input.multiple = mediaType === 'image'; // 이미지일 경우만 다중 선택 가능
  //   input.onchange = event => {
  //     const files = Array.from((event.target as HTMLInputElement).files || []);
  //     if (files.length > 0) {
  //       handleOnFileSelect(mediaType === 'image' ? files.slice(0, 9) : files); // 이미지일 경우 최대 9개 제한
  //     }
  //   };
  //   input.click();
  // };

  const [selectedVisibility, setSelectedVisibility] = useState<VisibilityType>(VisibilityType.Private);
  const [visibilityDrawerOpen, setVisibilityDrawerOpen] = useState<boolean>(false);
  const publishItemsVisibility: SelectDrawerItem[] = [
    {name: 'Private', onClick: () => setSelectedVisibility(VisibilityType.Private)},
    {name: 'Unlisted', onClick: () => setSelectedVisibility(VisibilityType.Unlisted)},
    {name: 'Public', onClick: () => setSelectedVisibility(VisibilityType.Public)},
  ];

  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const createFeed = async () => {
    let state = 0;
    if (mediaType == 'image') state = 1;
    if (mediaType == 'video') state = 2;

    if (mediaUrls.length == 0 || nameValue == '' || descValue == '' || selectedTags.length == 0) {
      dataToast.open(getLocalizedText('common_alert_093'), ToastType.Error);
      setWarnPopup(true);
      return;
    }
    try {
      const requestPayload: CreateFeedReq = {
        languageType: getCurrentLanguage(),
        feedInfo: {
          id: feedId != -1 ? feedId : 0,
          mediaState: state, // 예: 이미지 = 1, 비디오 = 2 (서버 문서 참고)
          mediaUrlList: mediaUrls,
          title: nameValue,
          description: descValue,
          hashTag: selectedTags.join(', '),
          visibilityType: selectedVisibility, // 예: 공개 = 1, 비공개 = 2
          nsfw: isNsfw,
        },
      };

      setLoading(true);
      const response = await sendCreateFeed(requestPayload);
      setLoading(false);
      if (response.resultCode === 0) {
        console.log('✅ Feed created successfully');
        back();
      } else {
        console.error('❌ Failed to create feed:', response.resultMessage);
      }
    } catch (error) {
      console.error('🚨 API 호출 중 오류 발생:', error);
    }
  };

  const [isNsfw, setIsNsfw] = useState<boolean>(false);
  return (
    <div className={styles.box}>
      <CustomArrowHeader
        title={id ? getLocalizedText('common_title_edit') : getLocalizedText('createfeed001_title001')}
        onClose={() => {
          back();
        }}
      ></CustomArrowHeader>

      <div className={styles.container}>
        <div className={styles.label}>{getLocalizedText('common_label_media')}</div>
        <div
          className={`${styles.inputBox} ${warnPopup && mediaUrls.length == 0 ? styles.isEssentialWarning : ''}`}
          onClick={() => {
            setIsOpenMediaDrawer(true);
          }}
        >
          <div className={styles.uploadIcon}>
            <img src={LineUpload.src} alt="upload-icon" />
          </div>
          <div className={styles.hintText}>{getLocalizedText('common_button_upload')}</div>
        </div>
        {/* 이미지 그리드 */}
        {mediaType === 'image' && (
          <div>
            <PostImageGrid
              imageUrls={mediaUrls}
              onRemove={handleMediaRemove} // 인덱스를 기반으로 삭제
            />
          </div>
        )}

        {mediaType === 'video' && mediaUrls.length > 0 && (
          <div
            className={styles.mediaVideo}
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false);
              }
            }}
          >
            <ReactPlayer
              muted={true}
              url={mediaUrls[0]} // 첫 번째 URL 사용
              playing={isPlaying} // 재생 상태
              width="100%" // 비율 유지하며 너비 자동 조정
              height="100%" // 비율 유지하며 높이 자동 조정
              style={{
                borderRadius: '8px',
              }}
              onDuration={(duration: number) => setVideoDuration(formatDuration(duration))} // 영상 길이 설정
            />
            {/* {!isPlaying && (
              <button
                className={styles.playButton}
                onClick={() => setIsPlaying(true)} // 재생 시작
              >
                <img src={BoldPlay.src} alt="Play" />
              </button>
            )} */}
            <button
              className={styles.deleteButton}
              onClick={() => {
                handleMediaRemove(0);
              }}
            >
              <img src={CircleClose.src}></img>
            </button>
          </div>
        )}
        <CustomInput
          inputType="Basic"
          textType="Label"
          value={nameValue}
          onChange={handleNameChange}
          label={
            <span>
              {getLocalizedText('createfeed001_label002')}{' '}
              <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
            </span>
          }
          placeholder={getLocalizedText('common_sample_085')}
          customClassName={[styles.textInput]}
          error={warnPopup}
        />
        <span className={styles.desclabel}>
          {getLocalizedText('CreateFeed001_label003')} <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
        </span>
        <MaxTextInput
          displayDataType={displayType.Hint}
          labelText="Introduction"
          promptValue={descValue}
          handlePromptChange={e => setrDescription(e.target.value)}
          maxPromptLength={500}
          style={{minHeight: '190px', width: '100%'}}
          placeholder={getLocalizedText('common_sample_047')}
          isError={warnPopup}
        />

        <div className={styles.tagContainer}>
          <CustomChipSelector
            label={getLocalizedText('common_label_002')}
            onClick={() => {
              setTagList(themeGroup?.tags || []);
              setTagOpen(true);
            }}
            tagType="tags"
            tags={selectedTags}
            handleTagSelect={handleTagSelect}
          />
          <DrawerTagSelect
            title={getLocalizedText('common_label_002')}
            isOpen={tagOpen}
            onClose={() => setTagOpen(false)}
            tagList={tagList}
            selectedTags={selectedTags}
            onTagSelect={handleTagSelect}
            onRefreshTags={() => setSelectedTags([])}
            maxTagCount={maxTagCount}
            selectedTagAlertOn={selectedTagAlertOn}
            setSelectedTagAlertOn={setSelectedTagAlertOn}
          />
        </div>

        <div style={{boxSizing: 'border-box', width: '100%'}}>
          <CustomDropDownSelectDrawer
            title={
              <span>
                {getLocalizedText('common_label_001')} <span style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</span>
              </span>
            }
            selectedItem={getVisibilityTypeKey(selectedVisibility)}
            onClick={() => setVisibilityDrawerOpen(true)}
            error={warnPopup}
          ></CustomDropDownSelectDrawer>
        </div>
        <div className={styles.nsfwLabel}>
          {getLocalizedText('common_label_008')} <div style={{color: 'var(--Secondary-Red-1, #F75555)'}}>*</div>
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
            onSelect={() => setIsNsfw(true)}
            selectedValue={isNsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label={getLocalizedText('common_button_off')}
            onSelect={() => setIsNsfw(false)}
            selectedValue={isNsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
        </div>
      </div>

      <div className={styles.contentBottom}>
        <div
          className={styles.setupButtons}
          onClick={() => {
            createFeed();
          }}
        >
          {getLocalizedText('common_button_submit')}
        </div>
      </div>

      <div style={{position: 'relative'}}>
        {/* <SelectDrawer
          items={selectVisibilityItems}
          isOpen={isOpenSelectDrawer}
          onClose={() => setIsOpenSelectDrawer(false)}
          selectedIndex={0}
          isCheck={false}
        /> */}
      </div>

      <div style={{position: 'relative'}}>
        <SelectDrawer
          items={mediaVisibilityItems}
          isOpen={isOpenMediaDrawer}
          onClose={() => setIsOpenMediaDrawer(false)}
          selectedIndex={0}
          isCheck={false}
        />
      </div>
      <LoadingOverlay loading={loading} />

      {publishPopup && (
        <CustomPopup
          type="alert"
          title="Alert"
          description="Publish"
          buttons={[
            {
              label: 'Ok',
              onClick: () => {
                handleInit();
                setPublishPopup(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
      <SelectDrawer
        name="Filter"
        items={publishItemsVisibility}
        isOpen={visibilityDrawerOpen}
        onClose={() => setVisibilityDrawerOpen(false)}
        selectedIndex={selectedVisibility}
        isCheck={false}
      />
      <DrawerTagSelect
        title={getLocalizedText('common_label_002')}
        isOpen={tagOpen}
        onClose={() => setTagOpen(false)}
        tagList={tagList}
        selectedTags={selectedTags}
        onTagSelect={handleTagSelect}
        onRefreshTags={() => setSelectedTags([])}
        maxTagCount={maxTagCount}
        selectedTagAlertOn={selectedTagAlertOn}
        setSelectedTagAlertOn={setSelectedTagAlertOn}
      />
      {mediaType === 'image' && (
        <ImageUpload
          isOpen={isOpenSelectDrawer}
          onClose={() => {
            setIsOpenSelectDrawer(false);
          }}
          setContentImageUrl={string => {
            setMediaUrls(prev => [...prev, string]);
          }}
          setContentImageUrls={urls => {
            setMediaUrls(prev => [...prev, ...urls]);
          }}
          onChoose={() => {
            setIsOpenSelectDrawer(false);
          }}
          multiple={true}
          uploadType={UploadMediaState.FeedImage}
        />
      )}
      {mediaType === 'video' && (
        <VideoUpload
          isOpen={isOpenSelectDrawer}
          onClose={() => {
            setIsOpenSelectDrawer(false);
          }}
          setContentVideoUrl={string => {
            setMediaUrls(prev => [...prev, string]);
          }}
          onChoose={() => {
            setIsOpenSelectDrawer(false);
          }}
          uploadType={UploadMediaState.FeedVideo}
        />
      )}
    </div>
  );
};

export default PostMain;
