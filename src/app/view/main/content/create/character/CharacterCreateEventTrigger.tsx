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
  LineArrowSwap,
  LineCopy,
  LineDelete,
  LineEdit,
  LinePlus,
  LineTime,
} from '@ui/Icons';
import CustomButton from '@/components/layout/shared/CustomButton';
import {CharacterEventTriggerInfo, CharacterEventTriggerType, EmotionState} from '@/app/NetWork/CharacterNetwork';
import React, {useState} from 'react';
import {MediaState} from '@/app/NetWork/ProfileNetwork';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';

interface Props {
  eventTriggerItems: CharacterEventTriggerInfo[];
  onClickCreateEventTrigger: () => void;
}

const CharacterCreateEventTrigger: React.FC<Props> = ({eventTriggerItems, onClickCreateEventTrigger}) => {
  const [currentState, setCurrentState] = useState<number>(0);
  const [selectedTriggerType, setSelectedTriggerType] = useState<CharacterEventTriggerType | null>(null);

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

  const EmotionArray = [
    {label: 'Happy', value: EmotionState.Happy, icon: EmojiHappy.src},
    {label: 'Angry', value: EmotionState.Angry, icon: EmojiAngry.src},
    {label: 'Sad', value: EmotionState.Sad, icon: EmojiSad.src},
    {label: 'Excited', value: EmotionState.Excited, icon: EmojiExcited.src},
    {label: 'Scared', value: EmotionState.Scared, icon: EmojiScared.src},
    {label: 'Bored', value: EmotionState.Bored, icon: EmojiBoring.src},
  ];

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
          <CustomButton size="Small" state="IconLeft" type="Primary" icon={LinePlus.src} onClick={onClick}>
            {getLocalizedText('TODO : Add')}
          </CustomButton>
        )}
      </div>
    );
  };

  //#region  TriggerBase
  const renderEventTriggerBase = () => {
    return (
      <div className={styles.eventTriggerBase}>
        {renderEventTriggerHeader(
          formatText(getLocalizedText('TODO : You can add various media while chatting with the characters. ')),
        )}

        <div className={styles.eventTriggerItemArea}>
          {
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
              {getLocalizedText('TODO : Add Trigger')}
            </CustomButton>
          }

          <ul className={styles.eventTriggerContainers}>
            {Object.values(CharacterEventTriggerType)
              .filter(value => typeof value === 'number') // enum에서 숫자값만
              .map(triggerType =>
                renderEventTriggerContainer(
                  triggerType as CharacterEventTriggerType,
                  eventTriggerItems.filter(item => item.triggerType === triggerType),
                ),
              )}
          </ul>
        </div>
      </div>
    );
  };

  const renderEventTriggerContainer = (triggerType: CharacterEventTriggerType, items: CharacterEventTriggerInfo[]) => {
    // const [isDropDown, setIsDropDown] = useState<boolean>(false);

    return (
      <div
        className={styles.eventTriggerItemContainer}
        onClick={() => {
          setCurrentState(2);
          setSelectedTriggerType(triggerType);
        }}
      >
        <div className={styles.eventTriggerHeader}>
          <div className={styles.headerLeftArea}>
            <img
              className={`${styles.headerIcon} ${
                triggerType !== CharacterEventTriggerType.ChangeBackgroundByEmotion &&
                triggerType !== CharacterEventTriggerType.SendMediaByEmotion
                  ? styles.blackIcon
                  : ''
              }`}
              src={getHeaderIcon(triggerType)}
            />
            <div className={styles.headerTitle}>{getLocalizedText('TODO:' + triggerType.toString())}</div>
          </div>
          <div className={styles.headerRightArea}>
            <div className={styles.triggerCounter}>{items.length}</div>
            <button
              className={styles.headerButton}
              onClick={e => {
                // e.stopPropagation();
                // setIsDropDown(true);
              }}
            >
              <img className={styles.headerButtonIcon} src={BoldMenuDots.src} />
            </button>
          </div>
        </div>
        <ul className={styles.eventTriggerList}>
          {items?.map((item, index) => (
            <li key={item.id ?? index}>{renderEventTriggerItem(item, index, () => {})}</li>
          ))}
        </ul>
      </div>
    );
  };

  const renderEventTriggerItem = (
    item: CharacterEventTriggerInfo,
    index: number,
    handlerSelected: (value: number) => void,
  ) => {
    return (
      <div className={styles.eventTriggerItem}>
        <div className={styles.eventTriggerItemContent}>
          <div
            className={`${styles.eventTriggerMedia}`}
            style={{
              backgroundImage: item.mediaUrl !== '' ? `url(${item.mediaUrl})` : '',
              backgroundSize: 'cover',
            }}
            onClick={() => handlerSelected(index)}
          >
            {item.triggerType === CharacterEventTriggerType.SendMessageByElapsedTime && (
              <img className={styles.messageIcon} src={BoldMessenger.src}></img>
            )}
            {item.emotionState !== undefined ? (
              <div className={styles.emotionBack}>
                <img className={styles.emotionIcon} src={getEmojiIcon(item.emotionState)} alt="emotion" />
              </div>
            ) : item.elapsedTime !== undefined ? (
              <div className={styles.triggerSummaryBox}>
                <img className={styles.triggerSummaryIcon} src={LineTime.src} />
                <div className={styles.triggerSummaryText}>{'30m'}</div>
              </div>
            ) : item.getStar !== undefined ? (
              <div className={styles.triggerSummaryBox}>
                <img className={styles.triggerSummaryIcon} src={BoldStar.src} />
                <div className={styles.triggerSummaryText}>{400}</div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  };
  //#endregion

  //#region TriggerTypeSelect (AddTrigger)
  const renderEventTriggerTypeSelection = () => {
    return (
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
          <div className={styles.typeSelectTitle}>{getLocalizedText('TODO : Add Trigger')}</div>
        </div>
        <div className={styles.typeSelectContainer}>
          <div className={styles.searchArea}></div>
          <div className={styles.typeTabSwiper}></div>
          <div className={styles.typeButtonList}>
            {renderTypeButton(CharacterEventTriggerType.ChangeBackgroundByEmotion)}
            {renderTypeButton(CharacterEventTriggerType.SendMediaByEmotion)}
            {renderTypeButton(CharacterEventTriggerType.SendMediaByElapsedTime)}
            {renderTypeButton(CharacterEventTriggerType.SendMessageByElapsedTime)}
            {renderTypeButton(CharacterEventTriggerType.SendMediaByGotStars)}
          </div>
        </div>
      </div>
    );
  };

  const renderTypeButton = (triggerType: CharacterEventTriggerType) => {
    return (
      <button
        className={styles.typeButton}
        onClick={() => {
          setCurrentState(2);
          setSelectedTriggerType(triggerType);
          onClickCreateEventTrigger();
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
        <div className={styles.typeText}>{getLocalizedText('TODO :' + triggerType.toString())}</div>
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
            <div className={styles.detailTitle}>{getLocalizedText('TODO : ' + triggerType.toString())}</div>
          </div>
        </div>
        {renderEventTriggerHeader(
          formatText(
            getLocalizedText(
              'TODO : Add a media item to define how your character will react.<br>{{char}} → This character <br>{{user}} → Chat User ',
            ),
          ),
          () => {},
        )}
        <ul className={styles.triggerItemList}>
          {items?.map((item, index) => (
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
              <button className={styles.editButton} onClick={() => {}}>
                <img className={styles.editIcon} src={LineEdit.src} />
              </button>
              {item.mediaType === MediaState.Video && (
                <button className={styles.playButton} onClick={() => {}}>
                  <img className={styles.playIcon} src={BoldPlay.src} />
                </button>
              )}
            </div>
          )}
          <div className={styles.rightInputPanel}>{renderInputPrompt(item)}</div>
        </div>
        <div className={styles.buttonArea}>
          <button className={styles.bottomButton}>
            <img className={`${styles.buttonIcon} ${styles.iconUser}`} src={BoldProfile.src} />
            <div className={styles.buttonText}>{`{{User}}`}</div>
          </button>
          <button className={styles.bottomButton}>
            <img className={`${styles.buttonIcon} ${styles.iconChar}`} src={BoldCharacter.src} />
            <div className={styles.buttonText}>{`{{Char}}`}</div>
          </button>
          <button className={styles.bottomButton}>
            <img className={`${styles.buttonIcon} ${styles.iconDuplicate}`} src={LineCopy.src} />
            <div className={styles.buttonText}>{`Duplicate`}</div>
          </button>
          <button className={styles.bottomButton}>
            <img className={`${styles.buttonIcon} ${styles.iconDelete}`} src={LineDelete.src} />
            <div className={`${styles.buttonText} ${styles.deleteText}`}>{`Delete`}</div>
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
              <div className={styles.label}>{getLocalizedText(`TODO : Character's Emotion`)}</div>
              <CustomDropDown
                initialValue={item.emotionState}
                displayType="Icon"
                items={EmotionArray}
                onSelect={() => {}}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`TODO : Probability (Weight)`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={1}
                onlyNumber={true}
                onChange={() => {}}
                customClassName={[styles.inputNumberArea]}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`TODO : Input Prompt`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={'asdf'}
                placeholder={getLocalizedText('TODO : input Prompt')}
                onChange={() => {}}
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : item.triggerType === CharacterEventTriggerType.SendMediaByEmotion ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`TODO : Character's Emotion`)}</div>
              <CustomDropDown
                initialValue={item.emotionState}
                displayType="Icon"
                items={EmotionArray}
                onSelect={() => {}}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`TODO : Probability (Weight)`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={1}
                onlyNumber={true}
                onChange={() => {}}
                customClassName={[styles.inputNumberArea]}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`TODO : Input Prompt`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={'asdf'}
                placeholder={getLocalizedText('TODO : input Prompt')}
                onChange={() => {}}
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : item.triggerType === CharacterEventTriggerType.SendMediaByElapsedTime ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`Elapsed Time (minute)`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={1}
                onlyNumber={true}
                onChange={() => {}}
                customClassName={[styles.inputNumberArea]}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`TODO : Input Prompt`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={'asdf'}
                placeholder={getLocalizedText('TODO : input Prompt')}
                onChange={() => {}}
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : item.triggerType === CharacterEventTriggerType.SendMessageByElapsedTime ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`Elapsed Time (minute)`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={1}
                onlyNumber={true}
                onChange={() => {}}
                customClassName={[styles.inputNumberArea]}
              />
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`TODO : Input Prompt`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={'asdf'}
                placeholder={getLocalizedText('TODO : input Prompt')}
                onChange={() => {}}
                customClassName={[styles.inputTextArea]}
              />
            </div>
          </div>
        ) : item.triggerType === CharacterEventTriggerType.SendMediaByGotStars ? (
          <div className={styles.inputPromptContainer}>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`Get Type`)}</div>
              <div className={styles.toggleBox}>
                <CustomRadioButton
                  displayType="buttonText"
                  label="Total"
                  shapeType="circle"
                  value={0}
                  selectedValue={0}
                  onSelect={() => {}}
                />
                <CustomRadioButton
                  displayType="buttonText"
                  label="Once"
                  shapeType="circle"
                  value={1}
                  selectedValue={0}
                  onSelect={() => {}}
                />
              </div>
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`Get Star`)}</div>
              <div className={styles.inputWithHint}>
                <CustomInput
                  inputType="RightIcon"
                  textType="InputOnly"
                  value={1}
                  iconRight={<div className={styles.greaterThan}>≥</div>}
                  onlyNumber={true}
                  onChange={() => {}}
                  customClassName={[styles.inputNumberArea]}
                />
                <div className={styles.inputHint}>{getLocalizedText('TODO : Greater than')}</div>
              </div>
            </div>
            <div className={styles.promptItem}>
              <div className={styles.label}>{getLocalizedText(`TODO : Input Prompt`)}</div>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={'asdf'}
                placeholder={getLocalizedText('TODO : input Prompt')}
                onChange={() => {}}
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
