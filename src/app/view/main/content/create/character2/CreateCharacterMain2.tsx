import {useState, useEffect} from 'react';

// publish가 끝나고 다른곳으로 이동하기
import {useRouter} from 'next/navigation';
import {getCurrentLanguage, pushLocalizedRoute} from '@/utils/UrlMove';

import styles from './CreateCharacterMain2.module.css';
import {BoldMixture, LineAIImage, LineEdit, LineUpload} from '@ui/Icons';

import EmptyContentInfo from '@/data/create/empty-content-info-data.json';

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
import {CharacterInfo, CharacterMediaInfo, ConversationInfo} from '@/redux-store/slices/ContentInfo';
import {Bar, CardData} from '../content-main/episode/episode-conversationtemplate/ConversationCard';
import CharacterCreateViewImage from './CharacterCreateViewImage';
import {OperatorAuthorityType, ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';

interface CreateCharacterProps {
  characterInfo?: CharacterInfo;
}

const CreateCharacterMain2: React.FC<CreateCharacterProps> = ({characterInfo}) => {
  const router = useRouter();

  //#region Data
  const character: CharacterInfo = characterInfo
    ? characterInfo
    : EmptyContentInfo.data.storyInfo.chapterInfoList[0].episodeInfoList[0].characterInfo;
  //#endregion

  //#region  Thumbnail
  const [mainimageUrl, setMainImageUrl] = useState(character.mainImageUrl);

  const [mediaCreateImage, setMediaCreateImage] = useState(
    'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/e58b0be3-d640-431c-96be-bbeffcfa105f.jpg',
  );
  const [imgUploadOpen, setImgUploadOpen] = useState(false);
  const [imgUploadModalOpen, setImgUploadModalOpen] = useState(false);

  const [imageViewOpen, setImageViewOpen] = useState<boolean>(false);
  const [imageViewUrl, setImageViewUrl] = useState(mainimageUrl);

  //#endregion

  //#region Edit Thumbnail
  type UploadType = 'Mixture' | 'AIGenerate' | 'Upload';
  type ImageCreateType = 'Thumbnail' | 'MediaCreate' | 'MediaEdit';
  const [imgUploadType, setImgUploadType] = useState<UploadType | null>(null);
  const [imageCreate, setImageCreate] = useState<ImageCreateType>('Thumbnail');

  //#endregion
  const [selectedSplitMenu, setSelectedSplitMenu] = useState(0);

  //#region  Basic
  const [characterName, setCharacterName] = useState<string>(character.name);
  const [characterDescription, setCharacterDescription] = useState<string>(character.characterDescription);

  //#endregion

  //#region  LLM
  const [languageType, setLanguageType] = useState<number>(character.languageType);
  const [description, setDescription] = useState(character.description);
  const [worldScenario, setWorldScenario] = useState(character.worldScenario);
  const [greeting, setGreeting] = useState(character.greeting);
  const [secret, setSecret] = useState(character.secret);
  const [customModulesPromptIdx, setCustomModulesPromptIdx] = useState<number>(0);
  const [customModulesLorebook, setCustomModulesLorebook] = useState<number>(0);

  //#endregion

  //#region Media

  const [mediaTemplateList, setMediaTemplateList] = useState<CharacterMediaInfo[]>(character.mediaTemplateList);
  const [selectedMediaItemIdx, setSelectedMediaItemIdx] = useState<number>(0);

  //#endregion

  //#region Conversation
  const convertToCardData = (conversationList: ConversationInfo[]): CardData[] => {
    return conversationList.map(conversation => {
      return {
        id: conversation.id.toString(),
        priorityType: conversation.conversationType,
        userBars: JSON.parse(conversation.user) as Bar[],
        charBars: JSON.parse(conversation.character) as Bar[],
      };
    });
  };

  const [conversationCards, setConversationCards] = useState<CardData[]>(
    convertToCardData(character.conversationTemplateList),
  );
  //#endregion

  //#region Policy

  const [visibilityType, setvisibilityType] = useState<number>(character.visibilityType);
  const [llmModel, setLlmModel] = useState<number>(character.llmModel);
  const [tag, setTag] = useState<string>(character.tag);
  const [positionCountryList, setPositionCountryList] = useState<number[]>(character.positionCountryList);
  const [characterIP, setCharacterIP] = useState<number>(character.characterIP);
  const [connectCharacterId, setConnectCharacterId] = useState<number>(0);
  const [recruitedProfileId, setRecruitedProfileId] = useState<number>(character.recruitedProfileId);
  const [operatorProfileIdList, setOperatorProfileIdList] = useState<ProfileSimpleInfo[]>(
    character.operatorProfileIdList,
  );

  const [isMonetization, setIsMonetization] = useState<boolean>(character.isMonetization);
  const [nsfw, setNsfw] = useState<boolean>(character.nSFW);

  //#endregion

  //#region Handler

  const handleOnClose = () => {
    router.back();
  };

  const handlerPublishFinish = () => {
    pushLocalizedRoute('/studio/character', router);
  };

  const handlerSetImage = (img: string) => {
    if (imageCreate === 'MediaCreate') {
      setMediaCreateImage(img);
      handleAddMediaItem(getMinMediaItemId(mediaTemplateList) - 1, img, '', false);
    } else if (imageCreate === 'MediaEdit') {
      setMediaCreateImage(img);
      handleEditMediaItem(
        mediaTemplateList[selectedMediaItemIdx].id,
        img,
        mediaTemplateList[selectedMediaItemIdx].activationCondition,
        mediaTemplateList[selectedMediaItemIdx].isProfileImage,
      );
    } else if (imageCreate === 'Thumbnail') {
      setMainImageUrl(img);
    }
    setImgUploadOpen(false);
  };
  //#region File Upload

  const handleFileSelection = async (file: File) => {
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
      // 빈블럭
    }
  };

  //#endregion

  const handleOnClickThumbnail = () => {
    setImgUploadOpen(true);
    setImageCreate('Thumbnail');
  };

  const handleOnClickMediaCreate = () => {
    setImgUploadModalOpen(true);
    setImageCreate('MediaCreate');
  };

  const handleOnClickMediaEdit = (index: number) => {
    setImgUploadOpen(true);
    setImageCreate('MediaEdit');
    setSelectedMediaItemIdx(index);
  };

  const handleCreateCharacter = async () => {
    try {
      const req: CreateCharacter2Req = {
        languageType: getCurrentLanguage(),
        characterInfo: {
          id: character.id, // 서버에서 지정
          languageType: languageType,
          name: characterName,
          chatCount: character.chatCount,
          chatUserCount: character.chatUserCount,
          characterDescription: characterDescription,
          urlLinkKey: character.urlLinkKey, // 서버에서 지정
          genderType: character.genderType, // 지정하는 장소 없음
          introduction: character.introduction, // 지정하는 장소 없음
          description: description,
          worldScenario: worldScenario,
          greeting: greeting,
          secret: secret,
          mainImageUrl: mainimageUrl,
          portraitGalleryImageUrl: [],
          poseGalleryImageUrl: [],
          expressionGalleryImageUrl: [],
          mediaTemplateList: mediaTemplateList?.map(item => ({
            id: item.id,
            imageUrl: item.imageUrl,
            activationCondition: item.activationCondition,
            isProfileImage: item.isProfileImage,
          })),
          conversationTemplateList: conversationCards?.map(item => ({
            id: Number(item.id),
            conversationType: item.priorityType,
            user: JSON.stringify(item.userBars),
            character: JSON.stringify(item.charBars),
          })),
          visibilityType: visibilityType,
          llmModel: llmModel,
          tag: tag,
          positionCountryList: positionCountryList,
          characterIP: characterIP,
          recruitedProfileId: recruitedProfileId,
          operatorProfileIdList: operatorProfileIdList.map(profile => ({
            ...profile,
            operatorAuthorityType: profile.operatorAuthorityType as number,
          })),
          isMonetization: isMonetization,
          nSFW: nsfw,
          membershipSetting: {
            subscription: 0,
            paymentType: 0,
            paymentAmount: 0,
            benefits: 'string',
          },
          customModulesInfo: {
            lorebookInfoList: [],
            promptInfoList: [],
            selectLorebookIndex: 0,
            selectPromptIndex: 0,
          },
          pdProfileSimpleInfo: {
            profileTabType: 0,
            profileId: 0,
            profileType: 0,
            name: 'string',
            iconImageUrl: 'string',
            operatorAuthorityType: OperatorAuthorityType.Owner,
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

        pushLocalizedRoute('/studio/character', router, false, true);
      } else {
        throw new Error('Character creation failed.');
      }
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
      // 빈블럭
    }
  };
  //#endregion

  //#region Media

  const handleMediaPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const updatedMediaItems = [...mediaTemplateList];
    updatedMediaItems[index].activationCondition = event.target.value;
    setMediaTemplateList(updatedMediaItems);
  };

  const handleMediaSelected = (value: number) => {
    setSelectedMediaItemIdx(value);
    setImageViewUrl(mediaTemplateList[value].imageUrl);
    setImageViewOpen(true);
  };

  const getMinMediaItemId = (mediaList: CharacterMediaInfo[]): number => {
    const mediaIds = mediaList.map(item => item.id);

    if (mediaIds.length === 0) {
      return 0; // 미디어 없는 경우 0 반환
    }

    const minId = Math.min(...mediaIds);
    return minId > 0 ? 0 : minId;
  };

  const handleAddMediaItem = (
    id: number,
    imageUrl: string,
    activationCondition: string = '',
    isProfileImage: boolean = false,
  ) => {
    const newItem: CharacterMediaInfo = {
      id: id,
      imageUrl: imageUrl,
      activationCondition: activationCondition,
      isProfileImage: isProfileImage,
    };

    setMediaTemplateList([...mediaTemplateList, newItem]);
  };

  const handleDeleteMediaItem = (index: number) => {
    const updatedMediaItems = mediaTemplateList.filter((_, i) => i !== index);
    setMediaTemplateList(updatedMediaItems);
  };

  const handleEditMediaItem = (
    id: number,
    imageUrl: string,
    activationCondition: string = '',
    isProfileImage: boolean = false,
  ) => {
    setMediaTemplateList(prevList =>
      prevList.map(item => (item.id === id ? {...item, imageUrl, activationCondition, isProfileImage} : item)),
    );
  };

  const handleMoveMediaItem = (index: number, direction: 'up' | 'down') => {
    setMediaTemplateList(prevItems => {
      const newItems = [...prevItems];
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      // 경계를 벗어나면 무시
      if (newIndex < 0 || newIndex >= newItems.length) {
        return newItems;
      }

      const [movedItem] = newItems.splice(index, 1);
      newItems.splice(newIndex, 0, movedItem);
      return newItems;
    });
  };
  //#endregion

  //#region Conversation

  const handleAddCard = () => {
    const newCard: CardData = {
      id: Date.now().toString(),
      priorityType: 0,
      userBars: [{id: Date.now().toString() + '_user', inputValue: '', type: 'dots'}],
      charBars: [{id: Date.now().toString() + '_char', inputValue: '', type: 'dots'}],
    };
    setConversationCards([...conversationCards, newCard]);
  };

  const handleRemoveCard = (id: string) => {
    setConversationCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  const handleUpdateCard = (updatedCard: CardData) => {
    setConversationCards(prevCards =>
      prevCards.map(card => (card.id === updatedCard.id ? {...card, ...updatedCard} : card)),
    );
  };

  const handleMoveCard = (index: number, direction: 'up' | 'down') => {
    setConversationCards(prevCards => {
      const newCards = [...prevCards];
      const newIndex = direction === 'up' ? index - 1 : index + 1;

      if (newIndex < 0 || newIndex >= newCards.length) return newCards;

      const [movedCard] = newCards.splice(index, 1);
      newCards.splice(newIndex, 0, movedCard);
      return newCards;
    });
  };

  const handleDuplicateCard = (index: number) => {
    setConversationCards(prevCards => {
      const newCards = [...prevCards];
      const cardToDuplicate = newCards[index];
      const duplicatedCard: CardData = {
        ...cardToDuplicate,
        id: Date.now().toString(),
        userBars: cardToDuplicate.userBars.map((bar, idx) => ({
          ...bar,
          id: `${Date.now()}_user_${idx}`,
        })),
        charBars: cardToDuplicate.charBars.map((bar, idx) => ({
          ...bar,
          id: `${Date.now()}_char_${idx}`,
        })),
      };
      newCards.splice(index + 1, 0, duplicatedCard);
      return newCards;
    });
  };

  //#endregion

  useEffect(() => {
    if (imgUploadOpen === false) {
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
          selectedPromptIdx={customModulesPromptIdx}
          selectedLorebookIdx={customModulesLorebook}
          onLangChange={setLanguageType}
          onCharacterDescChange={setDescription}
          onWorldScenarioChange={setWorldScenario}
          onGreetingChange={setGreeting}
          onSecretChange={setSecret}
          onSelectedPromptChange={setCustomModulesPromptIdx}
          onSelectedLorebookChange={setCustomModulesLorebook}
        />
      ),
    },
    {
      label: 'Media',
      preContent: '',
      content: (
        <CharacterCreateMedia
          mediaItems={mediaTemplateList}
          selectedItemIdx={selectedMediaItemIdx}
          onClickCreateMedia={handleOnClickMediaCreate}
          handlePromptChange={handleMediaPromptChange}
          handleSelected={handleMediaSelected}
          handleAddMediaItem={() => handleAddMediaItem(getMinMediaItemId(mediaTemplateList) - 1, mediaCreateImage)}
          handleDeleteMediaItem={handleDeleteMediaItem}
          handleEditMediaItem={handleOnClickMediaEdit}
          handleMoveMediaItem={handleMoveMediaItem}
        />
      ),
    },
    {
      label: 'Conversation',
      preContent: '',
      content: (
        <CharacterCreateConversation
          cardList={conversationCards}
          setCardList={setConversationCards}
          onAddCard={handleAddCard}
          onRemoveCard={handleRemoveCard}
          onUpdateCard={handleUpdateCard}
          onMoveCard={handleMoveCard}
          onDuplicateCard={handleDuplicateCard}
        />
      ),
    },
    {
      label: 'Policy',
      preContent: '',
      content: (
        <CharacterCreatePolicy
          visibility={visibilityType}
          onVisibilityChange={setvisibilityType}
          llmModel={llmModel}
          onLlmModelChange={setLlmModel}
          tag={tag}
          onTagChange={setTag}
          positionCountry={positionCountryList}
          onPositionCountryChange={setPositionCountryList}
          characterIP={characterIP}
          onCharacterIPChange={setCharacterIP}
          connectCharacterId={recruitedProfileId}
          onConnectCharacterIdChange={setRecruitedProfileId}
          operatorProfileIdList={operatorProfileIdList}
          onOperatorProfileIdListChange={setOperatorProfileIdList}
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
        <CreateDrawerHeader
          title="Create"
          onClose={() => {
            setImgUploadOpen(false);
            setImgUploadModalOpen(false);
          }}
        />
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

  const renderUploadSelectModal = () => {
    return (
      <div
        className={styles.backdrop}
        onClick={() => {
          setImgUploadType(null);
          setImgUploadModalOpen(false);
        }}
      >
        <div className={styles.modalContainer} onClick={e => e.stopPropagation()}>
          <div className={styles.imageUploadTitleArea}>
            <div className={styles.imageUploadTitle}>Create Character</div>
            <div className={styles.imageUploadDesc}>How to create an image?</div>
          </div>
          <div className={styles.uploadImageTypeArea}>
            {imgUploadType === null && (
              <div className={styles.uploadModalButtonGroup}>
                {typeOption.map((option, index) => (
                  <div className={styles.uploadModalButton} key={index}>
                    {index > 0 && (
                      <button
                        key={index}
                        className={styles.uploadButton}
                        onClick={() => {
                          setImgUploadType(option.type);
                          if (option.type === 'AIGenerate') {
                            setImgUploadModalOpen(false);
                            setImgUploadOpen(true);
                          }
                        }}
                      >
                        <div className={styles.buttonIconBack}>
                          <img
                            className={styles.buttonIcon}
                            src={index === 0 ? BoldMixture.src : index === 1 ? LineAIImage.src : LineUpload.src}
                            alt={option.label}
                          />
                        </div>
                        <div className={styles.buttonText}>{option.label}</div>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* {imgUploadType === 'AIGenerate' && <CharacterImageSet createFinishAction={handlerSetImage} />} */}
            {imgUploadType === 'Upload' && (
              <ImageUploadDialog
                isOpen={true}
                onClose={() => {
                  setImgUploadType(null);
                  setImgUploadModalOpen(false);
                }}
                onFileSelect={handleFileSelection}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.characterContainer}>
        {!imgUploadOpen && (
          <div className={styles.characterMain}>
            <CreateDrawerHeader title="Create" onClose={handleOnClose} />

            <div className={styles.createCharacterArea}>
              <div className={styles.thumbnailArea}>
                <h2 className={styles.title2}>Thumbnail</h2>
                <button
                  onClick={() => {
                    setImageViewUrl(mainimageUrl);
                    setImageViewOpen(true);
                  }}
                >
                  <div
                    className={styles.thumbnailImage}
                    style={{background: `url(${mainimageUrl}) lightgray 50% / cover no-repeat`}}
                  >
                    <button
                      className={styles.editButton}
                      onClick={e => {
                        e.stopPropagation();
                        handleOnClickThumbnail();
                      }}
                    >
                      <img className={styles.editIcon} src={LineEdit.src} />
                    </button>
                  </div>
                </button>
              </div>
              <Splitters
                splitters={splitterData}
                initialActiveSplitter={selectedSplitMenu}
                onSelectSplitButton={setSelectedSplitMenu}
                headerStyle={{padding: '0', gap: '10px'}}
                contentStyle={{padding: '0'}}
              />
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
        {imgUploadModalOpen && <>{renderUploadSelectModal()}</>}
      </div>
      {imageViewOpen && <CharacterCreateViewImage imageUrl={imageViewUrl} onClose={() => setImageViewOpen(false)} />}
    </>
  );
};

export default CreateCharacterMain2;
