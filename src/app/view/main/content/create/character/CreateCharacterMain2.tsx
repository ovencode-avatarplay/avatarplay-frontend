import {useState, useEffect} from 'react';

// publish가 끝나고 다른곳으로 이동하기
import {useRouter} from 'next/navigation';
import {getCurrentLanguage, getLocalizedLink, pushLocalizedRoute} from '@/utils/UrlMove';

import styles from './CreateCharacterMain2.module.css';
import {BoldMixture, LineAIImage, LineDashboard, LineEdit, LineUpload} from '@ui/Icons';

import EmptyStoryInfo from '@/data/create/empty-story-info-data.json';

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import Splitters from '@/components/layout/shared/CustomSplitter';
import CustomButton from '@/components/layout/shared/CustomButton';

import CharacterCreateSequence from './CreateCharacterSequence';
import CharacterImageSet from './CharacterImageSet';
import CharacterCreateBasic from './CharacterCreateBasic';
import CharacterCreateLLM from './CharacterCreateLLM';
import CharacterCreateMedia from './CharacterCreateMedia';
import CharacterCreateConversation from './CharacterCreateConversation';
import CharacterCreatePolicy from './CharacterCreatePolicy';
import {CharacterMediaInfo, CreateCharacter2Req, sendCreateCharacter2} from '@/app/NetWork/CharacterNetwork';
import ImageUploadDialog from '../story-main/episode/episode-ImageCharacter/ImageUploadDialog';
import {MediaUploadReq, sendUpload, UploadMediaState} from '@/app/NetWork/ImageNetwork';
import {CharacterInfo, ConversationInfo} from '@/redux-store/slices/StoryInfo';
import CharacterCreateViewImage from './CharacterCreateViewImage';
import {ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';
import {Bar, CardData} from '../story-main/episode/episode-conversationtemplate/ConversationCard';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import {MembershipSetting} from '@/app/NetWork/network-interface/CommonEnums';

interface CreateCharacterProps {
  id?: number;
  isUpdate?: boolean;
  characterInfo?: CharacterInfo;
  onClose?: () => void;
}

const CreateCharacterMain2: React.FC<CreateCharacterProps> = ({id, isUpdate = false, characterInfo, onClose}) => {
  const router = useRouter();

  //#region Data
  const character: CharacterInfo = characterInfo
    ? characterInfo
    : EmptyStoryInfo.data.storyInfo.chapterInfoList[0].episodeInfoList[0].characterInfo;
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

  const [essentialPopupOpen, setEssentialPopupOpen] = useState<boolean>(false);

  //#region  Basic
  const [characterName, setCharacterName] = useState<string>(character.name);
  const [creatorComment, setCreatorComment] = useState<string>(character.creatorComment);

  //#endregion

  //#region  LLM
  const [languageType, setLanguageType] = useState<number>(character.languageType);
  const [description, setDescription] = useState(character.description);
  const [worldScenario, setWorldScenario] = useState(character.worldScenario);
  const [introduction, setIntroduction] = useState(character.introduction);
  const [secret, setSecret] = useState(character.secret);
  const [customModulesPromptId, setCustomModulesPromptId] = useState<number>(
    character.customModulesInfo.selectPromptId,
  );
  const [customModulesLorebookId, setCustomModulesLorebookId] = useState<number>(
    character.customModulesInfo.selectLorebookId,
  );

  //#endregion

  //#region Media

  const [mediaTemplateList, setMediaTemplateList] = useState<CharacterMediaInfo[]>(character.mediaTemplateList);
  const [selectedMediaItemIdx, setSelectedMediaItemIdx] = useState<number>(0);

  //#endregion

  //#region Conversation
  const [conversationTemplateList, setConversationTemplateList] = useState<ConversationInfo[]>(
    character.conversationTemplateList,
  );

  const convertConversationsToCards = (conversations: ConversationInfo[]): CardData[] => {
    return conversations.map(conversation => {
      const userBars: Bar[] = JSON.parse(conversation.user || '[]').map(
        (bar: any, index: number): Bar => ({
          id: index,
          inputValue: bar.talk || '',
          type: bar.type === 0 ? 'dots' : 'description',
        }),
      );

      const charBars: Bar[] = JSON.parse(conversation.character || '[]').map(
        (bar: any, index: number): Bar => ({
          id: index,
          inputValue: bar.talk || '',
          type: bar.type === 0 ? 'dots' : 'description',
        }),
      );

      return {
        id: conversation.id,
        priorityType: conversation.conversationType,
        userBars,
        charBars,
      };
    });
  };

  const convertCardsToConversations = (cards: CardData[]): ConversationInfo[] => {
    return cards.map(card => ({
      id: card.id > 0 ? card.id : 0,
      conversationType: card.priorityType,
      user: JSON.stringify(
        card.userBars.map(bar => ({
          type: bar.type === 'dots' ? 0 : 1,
          talk: bar.inputValue,
        })),
      ),
      character: JSON.stringify(
        card.charBars.map(bar => ({
          type: bar.type === 'dots' ? 0 : 1,
          talk: bar.inputValue,
        })),
      ),
    }));
  };

  const [conversationCards, setConversationCards] = useState<CardData[]>(
    convertConversationsToCards(conversationTemplateList),
  );
  //#endregion

  //#region Policy

  const [visibilityType, setvisibilityType] = useState<number>(character.visibilityType);
  const [llmModel, setLlmModel] = useState<number>(character.llmModel);
  const [llmCustomApi, setLlmCustomApi] = useState<string>(character.customApi);
  const [tag, setTag] = useState<string>(character.tag);
  const [positionCountryList, setPositionCountryList] = useState<number[]>(character.positionCountryList);
  const [characterIP, setCharacterIP] = useState<number>(character.characterIP);
  const [membershipSetting, setMembershipSetting] = useState<MembershipSetting>(character.membershipSetting);
  const [connectCharacterInfo, setConnectCharacterInfo] = useState<ProfileSimpleInfo>(character.connectCharacterInfo);
  const [connectCharacterId, setConnectCharacterId] = useState<number>(character.connectCharacterId);
  const [recruitedProfileId, setRecruitedProfileId] = useState<number>(character.recruitedProfileId);
  const [operatorProfileIdList, setOperatorProfileIdList] = useState<ProfileSimpleInfo[]>(
    character.operatorProfileIdList,
  );

  const [isMonetization, setIsMonetization] = useState<boolean>(character.isMonetization);
  const [nsfw, setNsfw] = useState<boolean>(character.nsfw);

  //#endregion

  //#region Handler

  const handleOnClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.back();
    }
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
        mediaTemplateList[selectedMediaItemIdx].isSpoiler,
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

  const CheckEssential = () => {
    if (mainimageUrl === '') return false;

    if (characterName === '') return false;

    if (description === '') return false;

    if (positionCountryList.length < 1) return false;

    return true;
  };

  const handleCreateCharacter = async () => {
    try {
      const req: CreateCharacter2Req = {
        languageType: getCurrentLanguage(),
        payload: {
          id: character.id,
          referenceLanguage: languageType,
          name: characterName,
          introduction: introduction, // 지정하는 장소 없음
          description: description,
          worldScenario: worldScenario,
          secret: secret,
          mainImageUrl: mainimageUrl,
          mediaTemplateList: mediaTemplateList?.map(item => ({
            id: item.id,
            imageUrl: item.imageUrl,
            activationCondition: item.activationCondition,
            isSpoiler: item.isSpoiler,
          })),
          conversationTemplateList: convertCardsToConversations(conversationCards),
          visibilityType: visibilityType,
          llmModel: llmModel,
          customApi: llmCustomApi,
          tag: tag,
          positionCountryList: positionCountryList,
          characterIP: characterIP,
          connectCharacterId: connectCharacterId,
          operatorProfileIdList: operatorProfileIdList.map(profile => ({
            ...profile,
            operatorAuthorityType: profile.operatorAuthorityType as number,
          })),
          isMonetization: isMonetization,
          nsfw: nsfw,
          selectLorebookId: customModulesLorebookId,
          selectPromptId: customModulesPromptId,
          creatorComment: creatorComment,
        },
        debugParameter: 'string',
      };

      // API 호출
      const response = await sendCreateCharacter2(req);

      if (response.data || response.resultCode === 0) {
        console.log('Character created successfully:', response.data);

        pushLocalizedRoute('/studio/character', router);
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

  const handleSpoilerSelected = (value: boolean, index: number) => {
    const updatedMediaItems = [...mediaTemplateList];
    updatedMediaItems[index].isSpoiler = value;
    setMediaTemplateList(updatedMediaItems);
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
    isSpoiler: boolean = false,
  ) => {
    const newItem: CharacterMediaInfo = {
      id: id,
      imageUrl: imageUrl,
      activationCondition: activationCondition,
      isSpoiler: isSpoiler,
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
    isSpoiler: boolean = false,
  ) => {
    setMediaTemplateList(prevList =>
      prevList.map(item => (item.id === id ? {...item, imageUrl, activationCondition, isSpoiler: isSpoiler} : item)),
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
  const getMinId = (list: CardData[]): number => {
    const listId = list.flatMap(item => item.id);
    if (listId.length === 0) return 0;
    const minId = Math.min(...listId);
    return minId > 0 ? 0 : minId - 1;
  };

  useEffect(() => {
    if (conversationTemplateList?.length > 0) {
      const initialCards = convertConversationsToCards(conversationTemplateList);

      setConversationCards(initialCards);
    }
  }, [conversationTemplateList]);

  const handleOnUpdate = (updatedCard: CardData) => {
    setConversationCards(prevCards =>
      prevCards.map(card => (card.id === updatedCard.id ? {...card, ...updatedCard} : card)),
    );
  };

  const handleDuplicateCard = (index: number) => {
    setConversationCards(prevCards => {
      const newCards = [...prevCards];
      const cardToDuplicate = newCards[index];
      const newId = getMinId(newCards);

      const duplicatedCard: CardData = {
        ...cardToDuplicate,
        id: newId,
        userBars: cardToDuplicate.userBars.map((bar, idx) => ({
          ...bar,
          id: idx,
        })),
        charBars: cardToDuplicate.charBars.map((bar, idx) => ({
          ...bar,
          id: idx,
        })),
      };

      newCards.splice(index + 1, 0, duplicatedCard);
      return newCards;
    });
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

  const handleAddCard = () => {
    setConversationCards(prevCards => [
      ...prevCards,
      {
        id: getMinId(prevCards),
        priorityType: 0,
        userBars: [{id: getMinId(prevCards), inputValue: '', type: 'dots'}],
        charBars: [{id: getMinId(prevCards), inputValue: '', type: 'dots'}],
      },
    ]);
  };

  const handleRemoveCard = (id: number) => {
    setConversationCards(prevCards => prevCards.filter(card => card.id !== id));
  };

  //#endregion

  const handleMembershipSettingChange = (updated: Partial<MembershipSetting>) => {
    setMembershipSetting(prev => ({...prev, ...updated}));
  };

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
        <>
          <CharacterCreateBasic characterName={characterName} setCharacterName={setCharacterName} />
          <CharacterCreateLLM
            selectedLang={languageType}
            characterDesc={description}
            worldScenario={worldScenario}
            greeting={introduction}
            secret={secret}
            selectedPromptId={customModulesPromptId}
            selectedLorebookId={customModulesLorebookId}
            onLangChange={setLanguageType}
            onCharacterDescChange={setDescription}
            onWorldScenarioChange={setWorldScenario}
            onGreetingChange={setIntroduction}
            onSecretChange={setSecret}
            onSelectedPromptChange={setCustomModulesPromptId}
            onSelectedLorebookChange={setCustomModulesLorebookId}
          />
        </>
      ),
    },
    // {
    //   label: 'LLM',
    //   preContent: '',
    //   content: (
    //     <CharacterCreateLLM
    //       selectedLang={languageType}
    //       characterDesc={description}
    //       worldScenario={worldScenario}
    //       greeting={greeting}
    //       secret={secret}
    //       selectedPromptIdx={customModulesPromptIdx}
    //       selectedLorebookIdx={customModulesLorebookIdx}
    //       onLangChange={setLanguageType}
    //       onCharacterDescChange={setDescription}
    //       onWorldScenarioChange={setWorldScenario}
    //       onGreetingChange={setGreeting}
    //       onSecretChange={setSecret}
    //       onSelectedPromptChange={setCustomModulesPromptIdx}
    //       onSelectedLorebookChange={setCustomModulesLorebookIdx}
    //     />
    //   ),
    // },
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
          handleSetSpoiler={handleSpoilerSelected}
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
          onUpdateCard={handleOnUpdate}
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
          llmCustomAPIKey={llmCustomApi}
          onLlmCustomAPIKeyChange={setLlmCustomApi}
          tag={tag}
          onTagChange={setTag}
          positionCountry={positionCountryList}
          onPositionCountryChange={setPositionCountryList}
          characterIP={characterIP}
          onCharacterIPChange={setCharacterIP}
          membershipSetting={membershipSetting}
          onMembershipSettingChange={handleMembershipSettingChange}
          connectCharacterInfo={connectCharacterInfo}
          onConnectCharacterInfoChange={setConnectCharacterInfo}
          connectCharacterId={connectCharacterId}
          onConnectCharacterIdChange={setConnectCharacterId}
          operatorProfileIdList={operatorProfileIdList}
          onOperatorProfileIdListChange={setOperatorProfileIdList}
          isMonetization={isMonetization}
          onIsMonetizationChange={setIsMonetization}
          nsfw={nsfw}
          onNsfwChange={setNsfw}
          characterDesc={creatorComment}
          setCharacterDesc={setCreatorComment}
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
          title={
            imgUploadType === null
              ? 'Create Character'
              : imgUploadType === 'Mixture'
              ? 'Create Character Mixture'
              : imgUploadType === 'AIGenerate'
              ? 'Create Character AI'
              : ''
          }
          onClose={() => {
            setImgUploadOpen(false);
            setImgUploadModalOpen(false);
          }}
        >
          <button className={styles.dashboardButton}>
            <img className={styles.dashboardIcon} src={LineDashboard.src} />
          </button>
        </CreateDrawerHeader>
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
            <div className={styles.imageUploadTitle}>
              {imgUploadType === null
                ? 'Create Character'
                : imgUploadType === 'Mixture'
                ? 'Create Character Mixture'
                : imgUploadType === 'AIGenerate'
                ? 'Create Character Generated by AI'
                : ''}
            </div>
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
            <CreateDrawerHeader title="Create Character" onClose={handleOnClose}>
              <button className={styles.dashboardButton}>
                <img className={styles.dashboardIcon} src={LineDashboard.src} />
              </button>{' '}
            </CreateDrawerHeader>

            <div className={styles.createCharacterArea}>
              <div className={styles.thumbnailArea}>
                <h2 className={styles.title2}>
                  Profile Image<span className={styles.astrisk}>*</span>
                </h2>

                <div className={styles.thumbnailButtonArea}>
                  <button
                    className={styles.thumbnailButton}
                    onClick={() => {
                      if (mainimageUrl === '') {
                        handleOnClickThumbnail();
                      } else {
                        setImageViewUrl(mainimageUrl);
                        setImageViewOpen(true);
                      }
                    }}
                  >
                    <div
                      className={`${styles.thumbnailImage} ${mainimageUrl === '' && styles.emptyImage}`}
                      style={{backgroundImage: mainimageUrl ? `url(${mainimageUrl})` : 'none'}}
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
                      {mainimageUrl === '' && <div className={styles.createImageText}>Create</div>}
                    </div>
                  </button>
                  {/* {mainimageUrl !== '' && (
                    <CustomButton size="Small" state="Normal" type="Primary">
                      Regenerate
                    </CustomButton>
                  )} */}
                </div>
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
                  type="Primary"
                  state="Normal"
                  customClassName={[styles.floatButton]}
                  onClick={() => {
                    if (CheckEssential()) {
                      handleCreateCharacter();
                    } else {
                      setEssentialPopupOpen(true);
                    }
                  }}
                >
                  Save
                </CustomButton>
              </div>
            </footer>
          </div>
        )}
        {imgUploadOpen && <>{renderSelectImageType()}</>}
      </div>
      {imgUploadModalOpen && <>{renderUploadSelectModal()}</>}
      {imageViewOpen && <CharacterCreateViewImage imageUrl={imageViewUrl} onClose={() => setImageViewOpen(false)} />}
      {essentialPopupOpen && (
        <CustomPopup
          type="alert"
          title=""
          description='"Please select all required options before proceeding."'
          buttons={[
            {
              label: 'Confirm',
              onClick: () => {
                setEssentialPopupOpen(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
    </>
  );
};

export default CreateCharacterMain2;
