import {useState, useEffect} from 'react';

// publish가 끝나고 다른곳으로 이동하기
import {useRouter} from 'next/navigation';
import {pushLocalizedRoute} from '@/utils/UrlMove';

import styles from './CreateCharacterMain2.module.css';
import {BoldMixture, LineAIImage, LineEdit, LineUpload} from '@ui/Icons';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import Splitters from '@/components/layout/shared/CustomSplitter';
import CustomButton from '@/components/layout/shared/CustomButton';

import CharacterCreateSequence from './../character/CreateCharacterSequence';
import CharacterImageSet from './CharacterImageSet';
import CharacterCreateBasic from './CharacterCreateBasic';
import CharacterCreateLLM from './CharacterCreateLLM';
import CharacterCreateMedia from './CharacterCreateMedia';
import CharacterCreateConversation from './CharacterCreateConversation';
import CharacterCreatePolicy from './CharacterCreatePolicy';
import {CreateCharacter2Req, CreateCharacterReq, sendCreateCharacter} from '@/app/NetWork/CharacterNetwork';
import ImageUploadDialog from '../content-main/episode/episode-ImageCharacter/ImageUploadDialog';
import {MediaUploadReq, sendUpload, UploadMediaState} from '@/app/NetWork/ImageNetwork';
import {CharacterMediaInfo} from '@/redux-store/slices/ContentInfo';

interface CreateCharacterProps {}

const CreateCharacterMain2: React.FC<CreateCharacterProps> = () => {
  const router = useRouter();

  //#region Data

  //#endregion

  //#region  Thumbnail
  const [mainimageUrl, setMainImageUrl] = useState(
    'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
  );

  const [mediaCreateImage, setMediaCreateImage] = useState(
    'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
  );
  const [imgUploadOpen, setImgUploadOpen] = useState(false);
  //#endregion

  //#region Edit Thumbnail
  type UploadType = 'Mixture' | 'AIGenerate' | 'Upload';
  const [imgUploadType, setImgUploadType] = useState<UploadType | null>(null);
  const [mediaCreate, setMediaCreate] = useState<boolean>(false);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const [mediaItems, setMediaItems] = useState<CharacterMediaInfo[]>([]);
  const [selectedMediaItemIdx, setSelectedMediaItemIdx] = useState<number>(0);
  const handleMediaPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const updatedMediaItems = [...mediaItems];
    updatedMediaItems[index].description = event.target.value;
    setMediaItems(updatedMediaItems);
  };

  const handleMediaSelected = (value: number) => {
    setSelectedMediaItemIdx(value);
  };

  const handleAddMediaItem = (id: number, imageUrl: string, description: string, isProfileImage: boolean) => {
    const newItem: CharacterMediaInfo = {
      id: id,
      imageUrl: imageUrl,
      description: description,
      isProfileImage: isProfileImage,
    };

    setMediaItems([...mediaItems, newItem]);
  };

  const handleDeleteMediaItem = (index: number) => {
    const updatedMediaItems = mediaItems.filter((_, i) => i !== index);
    setMediaItems(updatedMediaItems);
  };
  //#endregion

  //#region  Basic
  const [characterName, setCharacterName] = useState<string>('');
  const [characterDescription, setCharacterDescription] = useState<string>('');

  //#endregion

  //#region  LLM
  const [languageType, setLanguageType] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [worldScenario, setWorldScenario] = useState('');
  const [greeting, setGreeting] = useState('');
  const [secret, setSecret] = useState('');
  const [selectedPrompt, setSelectedPrompt] = useState(''); // 서버 추가 필요
  const [selectedLorebook, setSelectedLorebook] = useState(''); // 서버 추가 필요

  //#endregion

  //#region Policy

  const [visibility, setVisibility] = useState<number>(0);
  const [llmModel, setLlmModel] = useState<number>(6);
  const [tag, setTag] = useState<string>('');
  const [positionCountry, setPositionCountry] = useState<number>(0);
  const [characterIP, setCharacterIP] = useState<number>(0);
  const [recruitedProfileId, setRecruitedProfileId] = useState<number>(0);
  const [operatorInvitationProfileId, setOperatorInvitationProfileId] = useState<number[]>([]);

  const [isMonetization, setIsMonetization] = useState<boolean>(false);
  const [nsfw, setNsfw] = useState<boolean>(false);

  //#endregion

  //#region Handler

  const handleOnClose = () => {
    router.back();
  };

  const handlerPublishFinish = () => {
    pushLocalizedRoute('/studio/character', router);
  };

  const handlerSetImage = (img: string) => {
    if (mediaCreate) {
      setMediaCreateImage(img);
      handleAddMediaItem(-1, img, '', false);
    } else {
      setMainImageUrl(img);
    }
    setImgUploadOpen(false);
  };
  //#region File Upload
  // const handleOnUploadImageClick = () => {
  //   setUploadDialogOpen(true);
  // };

  const handleFileSelection = async (file: File) => {
    // handlerSetImage(
    //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
    // );
    try {
      const req: MediaUploadReq = {
        mediaState: UploadMediaState.CharacterImage,
        file: file,
      };
      const response = await sendUpload(req);
      if (response?.data) {
        const imgUrl: string = response.data.url;

        handlerSetImage(imgUrl);
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
    }
  };

  //#endregion

  const handleOnClickThumbnail = () => {
    setImgUploadOpen(true);
    setMediaCreate(false);
  };

  const handleOnClickMediaCreate = () => {
    setImgUploadOpen(true);
    setMediaCreate(true);
  };

  const handleCreateCharacter = async () => {
    try {
      const req: CreateCharacter2Req = {
        characterInfo: {
          id: 0, // 서버에서 지정
          languageType: languageType,
          name: characterName,
          characterDescription: characterDescription,
          urlLinkKey: '-1', // 서버에서 지정
          genderType: 0, // 지정하는 장소 없음
          introduction: 'string', // 지정하는 장소 없음
          description: description,
          worldScenario: worldScenario,
          greeting: greeting,
          secret: secret,
          customModulesPrompt: selectedPrompt,
          customModulesLorebook: selectedLorebook,
          mainImageUrl: mainimageUrl,
          portraitGalleryImageUrl: mediaItems
            .filter(item => !item.isProfileImage) // isProfileImage가 false인 항목만 필터링
            .map(item => ({
              galleryImageId: -1,
              isGenerate: true,
              debugParameter: item.description,
              imageUrl: item.imageUrl,
            })),
          poseGalleryImageUrl: [],
          expressionGalleryImageUrl: [],
          mediaTemplateList: mediaItems.map(item => ({
            id: -1,
            imageUrl: item.imageUrl,
            description: item.description,
            isProfileImage: item.isProfileImage,
          })),
          conversationTemplateList: [
            {
              id: 0,
              conversationType: 0,
              user: 'string',
              character: 'string',
            },
          ],
          visibilityType: visibility,
          llmModel: llmModel,
          tag: tag,
          positionCountry: positionCountry,
          characterIP: characterIP,
          recruitedProfileId: recruitedProfileId,
          operatorInvitationProfileId: [0],
          isMonetization: isMonetization,
          nsfw: nsfw,
          membershipSetting: {
            subscription: 0,
            paymentType: 0,
            paymentAmount: 0,
            benefits: 'string',
          },
          state: 0,
          createAt: '2025-02-06T06:22:46.701Z',
          updateAt: '2025-02-06T06:22:46.701Z',
        },
        debugParameter: 'string',
      };

      // API 호출
      const response = await sendCreateCharacter(req);

      if (response.data) {
        console.log('Character created successfully:', response.data);

        pushLocalizedRoute('/studio/character', router);
      } else {
        throw new Error('Character creation failed.');
      }
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
    }
  };
  //#endregion

  useEffect(() => {
    if (imgUploadOpen === true) {
      setImgUploadType(null);
    }
  }, [imgUploadOpen]);

  const splitterData = [
    {
      label: 'Basic',
      preContent: '',
      content: (
        <CharacterCreateBasic
          characterName={characterName}
          setCharacterName={setCharacterName}
          characterDesc={characterDescription}
          setCharacterDesc={setCharacterDescription}
        />
      ),
    },
    {
      label: 'LLM',
      preContent: '',
      content: (
        <CharacterCreateLLM
          selectedLang={languageType}
          characterDesc={description}
          worldScenario={worldScenario}
          greeting={greeting}
          secret={secret}
          selectedLLM={llmModel}
          selectedPrompt={selectedPrompt}
          selectedLorebook={selectedLorebook}
          onLangChange={setLanguageType}
          onCharacterDescChange={setDescription}
          onWorldScenarioChange={setWorldScenario}
          onGreetingChange={setGreeting}
          onSecretChange={setSecret}
          onSelectedLLMChange={setLlmModel}
          onSelectedPromptChange={setSelectedPrompt}
          onSelectedLorebookChange={setSelectedLorebook}
        />
      ),
    },
    {
      label: 'Media',
      preContent: '',
      content: (
        <CharacterCreateMedia
          mediaItems={mediaItems}
          selectedItemIdx={selectedMediaItemIdx}
          onClickCreateMedia={handleOnClickMediaCreate}
          handlePromptChange={handleMediaPromptChange}
          handleSelected={handleMediaSelected}
          handleAddMediaItem={() => handleAddMediaItem(-1, mediaCreateImage, '', false)}
          handleDeleteMediaItem={handleDeleteMediaItem}
        />
      ),
    },
    {
      label: 'Conversation',
      preContent: '',
      content: <CharacterCreateConversation />,
    },
    {
      label: 'Policy',
      preContent: '',
      content: (
        <CharacterCreatePolicy
          visibility={visibility}
          onVisibilityChange={setVisibility}
          llmModel={llmModel}
          onLlmModelChange={setLlmModel}
          tag={tag}
          onTagChange={setTag}
          positionCountry={positionCountry}
          onPositionCountryChange={setPositionCountry}
          characterIP={characterIP}
          onCharacterIPChange={setCharacterIP}
          operatorInvitationProfileId={operatorInvitationProfileId}
          onOperatorInvitationProfileIdChange={setOperatorInvitationProfileId}
          isMonetization={isMonetization}
          onIsMonetizationChange={setIsMonetization}
          nsfw={nsfw}
          onNsfwChange={setNsfw}
        />
      ),
    },
  ];

  const typeOption = [
    {
      label: 'Mixture',
      type: 'Mixture' as UploadType,
    },
    {
      label: 'Generated by AI',
      type: 'AIGenerate' as UploadType,
    },
    {
      label: 'Upload',
      type: 'Upload' as UploadType,
    },
  ];

  const renderSelectImageType = () => {
    return (
      <>
        <CreateDrawerHeader title="Create" onClose={() => setImgUploadOpen(false)} />
        <div className={styles.imageTypeArea}>
          {imgUploadType === null && (
            <div className={styles.verticalButtonGroup}>
              {typeOption.map((option, index) => (
                <button key={index} className={styles.uploadButton} onClick={() => setImgUploadType(option.type)}>
                  <div className={styles.buttonIconBack}>
                    <img
                      className={styles.buttonIcon}
                      src={index === 0 ? BoldMixture.src : index === 1 ? LineAIImage.src : LineUpload.src}
                      alt={option.label}
                    />
                  </div>
                  <div className={styles.buttonText}>{option.label}</div>
                </button>
              ))}
            </div>
          )}
          {imgUploadType === 'Mixture' && (
            <CharacterCreateSequence
              closeAction={() => {}}
              createType="create2"
              publishFinishAction={handlerPublishFinish}
              createFinishAction={handlerSetImage}
            />
          )}
          {imgUploadType === 'AIGenerate' && <CharacterImageSet createFinishAction={handlerSetImage} />}
          {imgUploadType === 'Upload' && (
            <ImageUploadDialog
              isOpen={true}
              onClose={() => setImgUploadType(null)}
              onFileSelect={handleFileSelection}
            />
          )}
        </div>
      </>
    );
  };

  return (
    <div className={styles.characterContainer}>
      {!imgUploadOpen && (
        <div className={styles.characterMain}>
          <CreateDrawerHeader title="Create" onClose={handleOnClose} />

          <div className={styles.createCharacterArea}>
            <div className={styles.thumbnailArea}>
              <h2 className={styles.title2}>Thumbnail</h2>
              <div
                className={styles.thumbnailImage}
                style={{background: `url(${mainimageUrl}) lightgray 50% / cover no-repeat`}}
              >
                <button className={styles.editButton} onClick={handleOnClickThumbnail}>
                  <img className={styles.editIcon} src={LineEdit.src} />
                </button>
              </div>
            </div>
            <Splitters splitters={splitterData} headerStyle={{padding: '0'}} contentStyle={{padding: '0'}} />
          </div>
          <footer>
            <div className={styles.floatButtonArea}>
              <CustomButton
                size="Medium"
                type="Tertiary"
                state="Normal"
                customClassName={[styles.floatButton]}
                onClick={() => {}}
              >
                Import
              </CustomButton>
              <CustomButton
                size="Medium"
                type="Primary"
                state="Normal"
                customClassName={[styles.floatButton]}
                onClick={handleCreateCharacter}
              >
                Submit
              </CustomButton>
            </div>
          </footer>
        </div>
      )}
      {imgUploadOpen && <>{renderSelectImageType()}</>}
    </div>
  );
};

export default CreateCharacterMain2;
