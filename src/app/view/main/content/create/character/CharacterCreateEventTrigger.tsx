import formatText from '@/utils/formatText';
import styles from './CharacterCreateEventTrigger.module.css';
import getLocalizedText from '@/utils/getLocalizedText';
import {
  BoldCharacter,
  BoldInfo,
  BoldMenuDots,
  BoldMessenger,
  BoldPlay,
  BoldProfile,
  BoldReward,
  BoldStar,
  BoldVideo,
  EmojiAngry,
  EmojiBoring,
  EmojiExcited,
  EmojiHappy,
  EmojiSad,
  EmojiScared,
  LineArrowLeft,
  LineCopy,
  LineDelete,
  LineEdit,
  LinePlus,
  LineTime,
} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import {
  CharacterEventTriggerInfo,
  CharacterEventTriggerType,
  EmotionState,
  GetStarType,
} from '@/app/NetWork/CharacterNetwork';
import React, {useEffect, useState} from 'react';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import {Box, Modal} from '@mui/material';
import EventTriggerContainer from './EventTriggerContainer';

interface Props {
  eventTriggerItems: CharacterEventTriggerInfo[];
  onClickCreateEventTrigger: (triggertype: CharacterEventTriggerType) => void;
  onEditEventTrigger: (updatedTrigger: CharacterEventTriggerInfo) => void;
  onDuplicateEventTrigger: (item: CharacterEventTriggerInfo) => void;
  onDeleteEventTrigger: (id: number) => void;
  onClickEditMedia: (id: number) => void;
}

const CharacterCreateEventTrigger: React.FC<Props> = ({
  eventTriggerItems,
  onClickCreateEventTrigger,
  onEditEventTrigger,
  onDuplicateEventTrigger,
  onDeleteEventTrigger,
  onClickEditMedia,
}) => {
  //#region
  const EmotionArray = [
    {label: getLocalizedText('common_tagemotion_happy'), value: EmotionState.Happy, icon: EmojiHappy.src},
    {label: getLocalizedText('common_tagemotion_angry'), value: EmotionState.Angry, icon: EmojiAngry.src},
    {label: getLocalizedText('common_tagemotion_sad'), value: EmotionState.Sad, icon: EmojiSad.src},
    {label: getLocalizedText('common_tagemotion_excited'), value: EmotionState.Excited, icon: EmojiExcited.src},
    {label: getLocalizedText('common_tagemotion_scared'), value: EmotionState.Scared, icon: EmojiScared.src},
    {label: getLocalizedText('common_tagemotion_angry'), value: EmotionState.Bored, icon: EmojiBoring.src},
  ];

  const [currentState, setCurrentState] = useState<number>(0);
  const [selectedTriggerType, setSelectedTriggerType] = useState<CharacterEventTriggerType | null>(null);

  const [backgroundTriggers, setBackgroundTriggers] = useState<CharacterEventTriggerInfo[]>([]);
  const [mediaByEmotionTriggers, setMediaByEmotionTriggers] = useState<CharacterEventTriggerInfo[]>([]);
  const [mediaByTimeTriggers, setMediaByTimeTriggers] = useState<CharacterEventTriggerInfo[]>([]);
  const [messageByTimeTriggers, setMessageByTimeTriggers] = useState<CharacterEventTriggerInfo[]>([]);
  const [mediaByStarsTriggers, setMediaByStarsTriggers] = useState<CharacterEventTriggerInfo[]>([]);
  //#endregion

  //#region Handler

  //#endregion

  //#region Hook
  useEffect(() => {
    setBackgroundTriggers(
      eventTriggerItems.filter(item => item.triggerType === CharacterEventTriggerType.ChangeBackgroundByEmotion),
    );
    setMediaByEmotionTriggers(
      eventTriggerItems.filter(item => item.triggerType === CharacterEventTriggerType.SendMediaByEmotion),
    );
    setMediaByTimeTriggers(
      eventTriggerItems.filter(item => item.triggerType === CharacterEventTriggerType.SendMediaByElapsedTime),
    );
    setMessageByTimeTriggers(
      eventTriggerItems.filter(item => item.triggerType === CharacterEventTriggerType.SendMessageByElapsedTime),
    );
    setMediaByStarsTriggers(
      eventTriggerItems.filter(item => item.triggerType === CharacterEventTriggerType.SendMediaByGotStars),
    );
  }, [eventTriggerItems]);

  //#endregion

  //#region  Func
  const getHeaderIcon = (triggerType: CharacterEventTriggerType) => {
    switch (triggerType) {
      case CharacterEventTriggerType.ChangeBackgroundByEmotion:
      case CharacterEventTriggerType.SendMediaByEmotion:
        return EmojiHappy.src;
      case CharacterEventTriggerType.SendMediaByElapsedTime:
        return BoldVideo.src;
      case CharacterEventTriggerType.SendMessageByElapsedTime:
        return BoldMessenger.src;
      case CharacterEventTriggerType.SendMediaByGotStars:
        return BoldReward.src;
    }
  };

  const getEmojiIcon = (emotion: EmotionState) => {
    switch (emotion) {
      case EmotionState.Happy:
        return EmojiHappy.src;
      case EmotionState.Angry:
        return EmojiAngry.src;
      case EmotionState.Sad:
        return EmojiSad.src;
      case EmotionState.Excited:
        return EmojiExcited.src;
      case EmotionState.Scared:
        return EmojiScared.src;
      case EmotionState.Bored:
        return EmojiBoring.src;
    }
  };

  const hasEmptyTriggerType =
    backgroundTriggers.length === 0 ||
    mediaByEmotionTriggers.length === 0 ||
    mediaByTimeTriggers.length === 0 ||
    messageByTimeTriggers.length === 0 ||
    mediaByStarsTriggers.length === 0;

  const getDesc = (triggerType: CharacterEventTriggerType) => {
    switch (triggerType) {
      case CharacterEventTriggerType.ChangeBackgroundByEmotion:
      case CharacterEventTriggerType.SendMediaByEmotion:
      case CharacterEventTriggerType.SendMediaByElapsedTime:
      case CharacterEventTriggerType.SendMediaByGotStars:
        return 'common_desc_mediatrigger';
        break;

      case CharacterEventTriggerType.SendMessageByElapsedTime:
        return 'common_desc_meesagetrigger';
        break;
    }
  };

  const getTriggerName = (triggerType: CharacterEventTriggerType) => {
    switch (triggerType) {
      case CharacterEventTriggerType.ChangeBackgroundByEmotion:
        return formatText(getLocalizedText('common_chatbottrigger_name'), [
          getLocalizedText('common_triggertype_bg'),
          getLocalizedText('common_conditiontype_emotion'),
        ]);
      case CharacterEventTriggerType.SendMediaByEmotion:
        return formatText(getLocalizedText('common_chatbottrigger_name'), [
          getLocalizedText('common_triggertype_media'),
          getLocalizedText('common_conditiontype_emotion'),
        ]);
      case CharacterEventTriggerType.SendMediaByElapsedTime:
        return formatText(getLocalizedText('common_chatbottrigger_name'), [
          getLocalizedText('common_triggertype_media'),
          getLocalizedText('common_conditiontype_timer'),
        ]);
      case CharacterEventTriggerType.SendMediaByGotStars:
        return formatText(getLocalizedText('common_chatbottrigger_name'), [
          getLocalizedText('common_triggertype_media'),
          getLocalizedText('common_conditiontype_stars'),
        ]);

      case CharacterEventTriggerType.SendMessageByElapsedTime:
        return formatText(getLocalizedText('common_chatbottrigger_name'), [
          getLocalizedText('common_triggertype_message'),
          getLocalizedText('common_conditiontype_timer'),
        ]);
    }
  };

  //#endregion

  //#region Render

  const renderEventTriggerHeader = (text: string | React.ReactNode, onClick?: () => void) => {
    return (
      <div className={styles.eventTriggerInfoArea}>
        <div className={styles.eventTriggerLeftArea}>
          <div className={styles.eventTriggerInfoButton}>
            <img className={styles.eventTriggerInfoIcon} src={BoldInfo.src} />
          </div>
          <div className={styles.eventTriggerInfoDecs}>{text}</div>
        </div>
        {onClick && (
          <CustomButton
            size="Small"
            state="IconLeft"
            type="Primary"
            icon={LinePlus.src}
            onClick={onClick}
            customClassName={[styles.addItemButton]}
          >
            {getLocalizedText('common_button_add')}
          </CustomButton>
        )}
      </div>
    );
  };

  //#region  TriggerBase
  const renderEventTriggerBase = () => {
    return (
      <div className={styles.eventTriggerBase}>
        {renderEventTriggerHeader(formatText(getLocalizedText('eventtrigger001_desc_002')))}

        <div className={styles.eventTriggerItemArea}>
          {hasEmptyTriggerType && (
            <CustomButton
              size="Large"
              type="Tertiary"
              state="IconLeft"
              onClick={() => {
                setCurrentState(1);
              }}
              iconClass={styles.buttonIcon}
              icon={LinePlus.src}
              customClassName={[styles.eventTriggerAddButton]}
            >
              {getLocalizedText('eventtrigger001_btn_003')}
            </CustomButton>
          )}

          <ul className={styles.eventTriggerContainers}>
            {backgroundTriggers.length > 0 && (
              <EventTriggerContainer
                getEmojiIcon={getEmojiIcon}
                getHeaderIcon={getHeaderIcon}
                getTriggerName={getTriggerName(CharacterEventTriggerType.ChangeBackgroundByEmotion)}
                items={backgroundTriggers}
                onClick={() => {
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.ChangeBackgroundByEmotion);
                }}
                onItemClick={() => {}}
                triggerType={CharacterEventTriggerType.ChangeBackgroundByEmotion}
                onAddItem={() => {
                  onClickCreateEventTrigger(CharacterEventTriggerType.ChangeBackgroundByEmotion);
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.ChangeBackgroundByEmotion);
                }}
                onDeleteTriggerType={type => {
                  setBackgroundTriggers(prev => prev.filter(item => item.triggerType !== type));
                }}
              />
            )}
            {mediaByEmotionTriggers.length > 0 && (
              <EventTriggerContainer
                getEmojiIcon={getEmojiIcon}
                getHeaderIcon={getHeaderIcon}
                getTriggerName={getTriggerName(CharacterEventTriggerType.SendMediaByEmotion)}
                items={mediaByEmotionTriggers}
                onClick={() => {
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.SendMediaByEmotion);
                }}
                onItemClick={() => {}}
                triggerType={CharacterEventTriggerType.SendMediaByEmotion}
                onAddItem={() => {
                  onClickCreateEventTrigger(CharacterEventTriggerType.SendMediaByEmotion);
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.SendMediaByEmotion);
                }}
                onDeleteTriggerType={type => {
                  setMediaByEmotionTriggers(prev => prev.filter(item => item.triggerType !== type));
                }}
              />
            )}
            {mediaByTimeTriggers.length > 0 && (
              <EventTriggerContainer
                getEmojiIcon={getEmojiIcon}
                getHeaderIcon={getHeaderIcon}
                getTriggerName={getTriggerName(CharacterEventTriggerType.SendMediaByElapsedTime)}
                items={mediaByTimeTriggers}
                onClick={() => {
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.SendMediaByElapsedTime);
                }}
                onItemClick={() => {}}
                triggerType={CharacterEventTriggerType.SendMediaByElapsedTime}
                onAddItem={() => {
                  onClickCreateEventTrigger(CharacterEventTriggerType.SendMediaByElapsedTime);
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.SendMediaByElapsedTime);
                }}
                onDeleteTriggerType={type => {
                  setMediaByTimeTriggers(prev => prev.filter(item => item.triggerType !== type));
                }}
              />
            )}
            {messageByTimeTriggers.length > 0 && (
              <EventTriggerContainer
                getEmojiIcon={getEmojiIcon}
                getHeaderIcon={getHeaderIcon}
                getTriggerName={getTriggerName(CharacterEventTriggerType.SendMessageByElapsedTime)}
                items={messageByTimeTriggers}
                onClick={() => {
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.SendMessageByElapsedTime);
                }}
                onItemClick={() => {}}
                triggerType={CharacterEventTriggerType.SendMessageByElapsedTime}
                onAddItem={() => {
                  onClickCreateEventTrigger(CharacterEventTriggerType.SendMessageByElapsedTime);
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.SendMessageByElapsedTime);
                }}
                onDeleteTriggerType={type => {
                  setMessageByTimeTriggers(prev => prev.filter(item => item.triggerType !== type));
                }}
              />
            )}
            {mediaByStarsTriggers.length > 0 && (
              <EventTriggerContainer
                getEmojiIcon={getEmojiIcon}
                getHeaderIcon={getHeaderIcon}
                getTriggerName={getTriggerName(CharacterEventTriggerType.SendMediaByGotStars)}
                items={mediaByStarsTriggers}
                onClick={() => {
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.SendMediaByGotStars);
                }}
                onItemClick={() => {}}
                triggerType={CharacterEventTriggerType.SendMediaByGotStars}
                onAddItem={() => {
                  onClickCreateEventTrigger(CharacterEventTriggerType.SendMediaByGotStars);
                  setCurrentState(2);
                  setSelectedTriggerType(CharacterEventTriggerType.SendMediaByGotStars);
                }}
                onDeleteTriggerType={type => {
                  setMediaByStarsTriggers(prev => prev.filter(item => item.triggerType !== type));
                }}
              />
            )}
          </ul>
        </div>
      </div>
    );
  };

  //#endregion

  //#region TriggerTypeSelect (AddTrigger)
  const renderEventTriggerTypeSelection = () => {
    return (
      <Modal
        className={styles.modal}
        open={currentState === 1}
        onClose={() => {
          setCurrentState(0);
          setSelectedTriggerType(null);
        }}
        aria-labelledby="add-trigger-modal"
        aria-describedby="add-new-trigger-selection"
      >
        <Box className={styles.modalContainer}>
          <div className={styles.eventTriggerTypeSelect}>
            <div className={styles.typeSelectHeader}>
              <button
                className={styles.typeSelectBackButton}
                onClick={() => {
                  setCurrentState(0);
                  setSelectedTriggerType(null);
                }}
              >
                <img className={styles.backIcon} src={LineArrowLeft.src} />
              </button>
              <div className={styles.typeSelectTitle}>{getLocalizedText('eventtrigger001_btn_003')}</div>
            </div>
            <div className={styles.typeSelectContainer}>
              <div className={styles.searchArea}></div>
              <div className={styles.typeTabSwiper}></div>
              <div className={styles.typeButtonList}>
                {backgroundTriggers.length === 0 &&
                  renderTypeButton(CharacterEventTriggerType.ChangeBackgroundByEmotion)}
                {mediaByEmotionTriggers.length === 0 && renderTypeButton(CharacterEventTriggerType.SendMediaByEmotion)}
                {mediaByTimeTriggers.length === 0 && renderTypeButton(CharacterEventTriggerType.SendMediaByElapsedTime)}
                {messageByTimeTriggers.length === 0 &&
                  renderTypeButton(CharacterEventTriggerType.SendMessageByElapsedTime)}
                {mediaByStarsTriggers.length === 0 && renderTypeButton(CharacterEventTriggerType.SendMediaByGotStars)}
              </div>
            </div>
          </div>
        </Box>
      </Modal>
    );
  };

  const renderTypeButton = (triggerType: CharacterEventTriggerType) => {
    return (
      <button
        className={styles.typeButton}
        onClick={() => {
          setCurrentState(2);
          setSelectedTriggerType(triggerType);
          onClickCreateEventTrigger(triggerType);
        }}
      >
        <div className={styles.typeIconBack}>
          <img
            className={`${styles.typeIcon} ${
              triggerType === CharacterEventTriggerType.ChangeBackgroundByEmotion ||
              triggerType === CharacterEventTriggerType.SendMediaByEmotion
                ? styles.emotion
                : styles.icon
            }`}
            src={getHeaderIcon(triggerType)}
          />
        </div>
        <div className={styles.typeText}>{getTriggerName(triggerType)}</div>
      </button>
    );
  };

  //#endregion

  //#region TriggerItemSet
  const renderEventTriggerSet = (triggerType: CharacterEventTriggerType, items: CharacterEventTriggerInfo[]) => {
    return (
      <div className={styles.eventTriggerSet}>
        <div className={styles.triggerDetailMenu}>
          <button
            className={styles.backButton}
            onClick={() => {
              setCurrentState(0);
            }}
          >
            <img className={styles.buttonIcon} src={LineArrowLeft.src} />
          </button>
          <div className={styles.detailTitleArea}>
            <img
              className={`${styles.detailIcon} 
            ${
              triggerType === CharacterEventTriggerType.ChangeBackgroundByEmotion ||
              triggerType === CharacterEventTriggerType.SendMediaByEmotion
                ? styles.emotion
                : styles.icon
            }`}
              src={getHeaderIcon(triggerType)}
            />
            <div className={styles.detailTitle}>{getTriggerName(triggerType)}</div>
          </div>
        </div>
        {renderEventTriggerHeader(formatText(getLocalizedText(getDesc(triggerType) || '')), () => {
          onClickCreateEventTrigger(triggerType);
        })}
        <ul className={styles.triggerItemList}>
          {items
            ?.slice()
            .reverse()
            .map((item, index) => (
              <li className={styles.triggerItem} key={item.id ?? index}>
                {renderEventTriggerItemSet(item)}
              </li>
            ))}
        </ul>
      </div>
    );
  };

  const renderEventTriggerItemSet = (item: CharacterEventTriggerInfo) => {
    return (
      <div className={styles.triggerItemSetContainer}>
        <div className={styles.inputPanel}>
          {item.triggerType !== CharacterEventTriggerType.SendMessageByElapsedTime && (
            <div className={styles.informationTracking}>
              {item.mediaType === MediaState.Video ? (
                <video
                  src={item.mediaUrl}
                  className={styles.videoPreview}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  style={{width: '100%', height: '100%', objectFit: 'contain'}}
                />
              ) : (
                <div
                  className={styles.imagePreview}
                  style={{
                    backgroundImage: item.mediaUrl !== '' ? `url(${item.mediaUrl})` : '',
                    backgroundSize: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                />
              )}
              <button
                className={styles.editButton}
                onClick={() => {
                  onClickEditMedia(item.id);
                  // onEditEventTrigger({
                  //   ...item,
                  //   mediaType: MediaState.Image,
                  // });
                }}
              >
                <img className={styles.editIcon} src={LineEdit.src} />
              </button>
              {item.mediaType === MediaState.Video && (
                <button
                  className={styles.playButton}
                  onClick={() => {
                    // onEditEventTrigger({
                    //   ...item,
                    //   mediaType: MediaState.Video,
                    // });
                  }}
                >
                  <img className={styles.playIcon} src={BoldPlay.src} />
                </button>
              )}
            </div>
          )}
          <div className={styles.rightInputPanel}>{renderInputPrompt(item)}</div>
        </div>
        <div className={styles.buttonArea}>
          <button
            className={styles.bottomButton}
            onClick={() =>
              onEditEventTrigger({
                ...item,
                inputPrompt: (item.inputPrompt || '') + '{{User}}',
              })
            }
          >
            <img className={`${styles.buttonIcon} ${styles.iconUser}`} src={BoldProfile.src} />
            <div className={styles.buttonText}>{getLocalizedText(`common_button_usercommand`)}</div>
          </button>
          <button
            className={styles.bottomButton}
            onClick={() =>
              onEditEventTrigger({
                ...item,
                inputPrompt: (item.inputPrompt || '') + '{{Char}}',
              })
            }
          >
            <img className={`${styles.buttonIcon} ${styles.iconChar}`} src={BoldCharacter.src} />
            <div className={styles.buttonText}>{getLocalizedText(`common_button_charcommand`)}</div>
          </button>
          <button
            className={styles.bottomButton}
            onClick={() => {
              onDuplicateEventTrigger(item);
            }}
          >
            <img className={`${styles.buttonIcon} ${styles.iconDuplicate}`} src={LineCopy.src} />
            <div className={styles.buttonText}>{getLocalizedText(`common_button_duplicate`)}</div>
          </button>
          <button
            className={styles.bottomButton}
            onClick={() => {
              onDeleteEventTrigger(item.id);
            }}
          >
            <img className={`${styles.buttonIcon} ${styles.iconDelete}`} src={LineDelete.src} />
            <div className={`${styles.buttonText} ${styles.deleteText}`}>
              {getLocalizedText(`common_button_delete`)}
            </div>
          </button>
        </div>
      </div>
    );
  };

  const renderInputPrompt = (item: CharacterEventTriggerInfo) => {
    return (
      <div className={styles.inputPrompt}>
        {item.triggerType === CharacterEventTriggerType.ChangeBackgroundByEmotion ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_002`)}</div>
              <CustomDropDown
                initialValue={item.emotionState}
                displayType="Icon"
                items={EmotionArray}
                onSelect={value =>
                  onEditEventTrigger({
                    ...item,
                    emotionState: value as EmotionState,
                  })
                }
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_003`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.probability || 0}
                onlyNumber={true}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    probability: parseInt(e.target.value || '0'),
                  })
                }
                customClassName={[styles.inputNumberArea]}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_004`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.inputPrompt}
                placeholder={getLocalizedText('eventtrigger003_label_004')}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    inputPrompt: e.target.value,
                  })
                }
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : item.triggerType === CharacterEventTriggerType.SendMediaByEmotion ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_002`)}</div>
              <CustomDropDown
                initialValue={item.emotionState}
                displayType="Icon"
                items={EmotionArray}
                onSelect={value =>
                  onEditEventTrigger({
                    ...item,
                    emotionState: value as EmotionState,
                  })
                }
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_003`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.probability || 0}
                onlyNumber={true}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    probability: parseInt(e.target.value || '0'),
                  })
                }
                customClassName={[styles.inputNumberArea]}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_004`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.inputPrompt}
                placeholder={getLocalizedText('eventtrigger003_label_004')}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    inputPrompt: e.target.value,
                  })
                }
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : item.triggerType === CharacterEventTriggerType.SendMediaByElapsedTime ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger004_label_001`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.elapsedTime || 0}
                onlyNumber={true}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    elapsedTime: parseInt(e.target.value || '0'),
                  })
                }
                customClassName={[styles.inputNumberArea]}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_004`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.inputPrompt}
                placeholder={getLocalizedText('eventtrigger003_label_004')}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    inputPrompt: e.target.value,
                  })
                }
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : item.triggerType === CharacterEventTriggerType.SendMessageByElapsedTime ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger004_label_001`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.elapsedTime || 0}
                onlyNumber={true}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    elapsedTime: parseInt(e.target.value || '0'),
                  })
                }
                customClassName={[styles.inputNumberArea]}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_004`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.inputPrompt}
                placeholder={getLocalizedText('eventtrigger003_label_004')}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    inputPrompt: e.target.value,
                  })
                }
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : item.triggerType === CharacterEventTriggerType.SendMediaByGotStars ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger005_label_001`)}</div>
              <div className={styles.toggleBox}>
                <CustomRadioButton
                  displayType="buttonText"
                  label="Total"
                  shapeType="circle"
                  value={0}
                  selectedValue={item.getType === GetStarType.Accumulated ? 0 : 1}
                  onSelect={() =>
                    onEditEventTrigger({
                      ...item,
                      getType: GetStarType.Accumulated,
                    })
                  }
                />
                <CustomRadioButton
                  displayType="buttonText"
                  label="Once"
                  shapeType="circle"
                  value={1}
                  selectedValue={item.getType === GetStarType.Accumulated ? 0 : 1}
                  onSelect={() =>
                    onEditEventTrigger({
                      ...item,
                      getType: GetStarType.Instant,
                    })
                  }
                />
              </div>
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger005_label_002`)}</div>
              <div className={styles.inputWithHint}>
                <CustomInput
                  inputType="RightIcon"
                  textType="InputOnly"
                  value={item.getStar || 0}
                  iconRight={<div className={styles.greaterThan}>≥</div>}
                  onlyNumber={true}
                  onChange={e =>
                    onEditEventTrigger({
                      ...item,
                      getStar: parseInt(e.target.value || '0'),
                    })
                  }
                  customClassName={[styles.inputNumberArea]}
                />
                <div className={styles.inputHint}>{getLocalizedText('eventtrigger005_label_003')}</div>
              </div>
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`eventtrigger003_label_004`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={item.inputPrompt}
                placeholder={getLocalizedText('eventtrigger003_label_004')}
                onChange={e =>
                  onEditEventTrigger({
                    ...item,
                    inputPrompt: e.target.value,
                  })
                }
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : (
          <div className={styles.inputPromptContainer}></div>
        )}
      </div>
    );
  };
  //#endregion

  //#endregion

  return (
    <div className={styles.eventTriggerContainer}>
      {currentState === 0
        ? renderEventTriggerBase()
        : currentState === 1
        ? renderEventTriggerTypeSelection()
        : currentState === 2 && selectedTriggerType !== null
        ? renderEventTriggerSet(
            selectedTriggerType,
            eventTriggerItems.filter(item => item.triggerType === selectedTriggerType),
          )
        : ''}
    </div>
  );
};

export default CharacterCreateEventTrigger;
