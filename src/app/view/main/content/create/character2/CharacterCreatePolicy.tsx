import {BoldArrowDown, BoldAudioPlay, BoldInfo, LineRegenerate} from '@ui/Icons';
import styles from './CharacterCreatePolicy.module.css';
import {useEffect, useState} from 'react';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import ContentLLMSetup from '../content-main/content-LLMsetup/ContentLLMsetup';
import llmModelData from '../content-main/content-LLMsetup/ContentLLMsetup.json';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import {sendGetTagList} from '@/app/NetWork/ContentNetwork';
import CustomHashtag from '@/components/layout/shared/CustomHashtag';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomButton from '@/components/layout/shared/CustomButton';
import Splitters from '@/components/layout/shared/CustomSplitter';
import {sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo, LanguageType} from '@/redux-store/slices/ContentInfo';
import {getCurrentLanguage} from '@/utils/UrlMove';
import ExploreSearchInput from '../../searchboard/searchboard-header/ExploreSearchInput';
import DrawerPostCountry from '../common/DrawerPostCountry';

interface Props {
  visibility: number;
  onVisibilityChange: (value: number) => void;
  llmModel: number;
  onLlmModelChange: (value: number) => void;
  tag: string;
  onTagChange: (value: string) => void;
  positionCountry: number[];
  onPositionCountryChange: (value: number[]) => void;
  characterIP: number;
  onCharacterIPChange: (value: number) => void;
  connectCharacterId: number;
  onConnectCharacterIdChange: (value: number) => void;
  operatorInvitationProfileId: number[];
  onOperatorInvitationProfileIdChange: (value: number[]) => void;
  isMonetization: boolean;
  onIsMonetizationChange: (value: boolean) => void;
  nsfw: boolean;
  onNsfwChange: (value: boolean) => void;
}

const CharacterCreatePolicy: React.FC<Props> = ({
  visibility,
  onVisibilityChange,
  llmModel,
  onLlmModelChange,
  tag,
  onTagChange,
  positionCountry,
  onPositionCountryChange,
  characterIP,
  onCharacterIPChange,
  connectCharacterId,
  onConnectCharacterIdChange,
  operatorInvitationProfileId,
  onOperatorInvitationProfileIdChange,
  isMonetization,
  onIsMonetizationChange,
  nsfw,
  onNsfwChange,
}) => {
  let VisibilityData = {label: 'Visibility', items: ['Private', 'UnListed', 'Public']};

  const [llmOpen, setLlmOpen] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOpen, setTagOpen] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);
  const maxTagCount = 5;
  const [selectedTagAlertOn, setSelectedTagAlertOn] = useState(false);

  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [isPositionCountryOpen, setIsPositionCountryOpen] = useState(false);

  let characterIpData = {
    items: [
      {label: 'Original', data: 0, monetization: 'Monetization possible'},
      {label: 'Fan', data: 1, monetization: 'Monetization impossible'},
    ],
  };

  const [connectableCharacterList, setConnectableCharacterList] = useState<CharacterInfo[]>([]);
  const [connectCharacterItems, setConnectCharacterItems] = useState<
    {label: string; title: string; value: string; profileImage: string}[]
  >([]);

  let invitationOption = {
    items: [
      {label: 'Owner', value: 'owner'},
      {label: 'Can edit', value: 'canEdit'},
      {label: 'Only Comments', value: 'onlyComments'},
      {label: 'Waiting', value: 'waiting'},
    ],
  };
  const [operatorInviteOpen, setOperatorInviteOpen] = useState(false);
  const [inviteSearchValue, setInviteSearchValue] = useState<string>('');

  const [voiceOpen, setVoiceOpen] = useState(false);

  interface SoundItem {
    address: string;
    description: string;
  }

  // api 만들어지기 전에 사용할 임시 데이터
  const voiceData = [
    {
      label: 'Voice 1',
      gender: 0,
      voiceDesc: 'Voice Desc 1',
      soundData: [
        {address: 'url-to-sound1.mp3', description: 'Sound 1'},
        {address: 'url-to-sound2.mp3', description: 'Sound 2'},
        {address: 'url-to-sound3.mp3', description: 'Sound 3'},
      ],
    },
    {
      label: 'Voice 2',
      gender: 1,
      voiceDesc: 'Voice Desc 3',
      soundData: [
        {address: 'url-to-sound4.mp3', description: 'Sound 4'},
        {address: 'url-to-sound5.mp3', description: 'Sound 5'},
        {address: 'url-to-sound6.mp3', description: 'Sound 6'},
      ],
    },
    // 추가 데이터
    {
      label: 'Voice 3',
      gender: 0,
      voiceDesc: 'Voice Desc 2',
      soundData: [
        {address: 'url-to-sound7.mp3', description: 'Sound 7'},
        {address: 'url-to-sound8.mp3', description: 'Sound 8'},
        {address: 'url-to-sound9.mp3', description: 'Sound 9'},
      ],
    },
    {
      label: 'Voice 4',
      gender: 1,
      voiceDesc: 'Voice Desc 4',
      soundData: [
        {address: 'url-to-sound10.mp3', description: 'Sound 10'},
        {address: 'url-to-sound11.mp3', description: 'Sound 11'},
        {address: 'url-to-sound12.mp3', description: 'Sound 12'},
      ],
    },
    {
      label: 'Voice 5',
      gender: 0,
      voiceDesc: 'Voice Desc 5',
      soundData: [
        {address: 'url-to-sound13.mp3', description: 'Sound 13'},
        {address: 'url-to-sound14.mp3', description: 'Sound 14'},
        {address: 'url-to-sound15.mp3', description: 'Sound 15'},
      ],
    },
    {
      label: 'Voice 6',
      gender: 1,
      voiceDesc: 'Voice Desc 6',
      soundData: [
        {address: 'url-to-sound16.mp3', description: 'Sound 16'},
        {address: 'url-to-sound17.mp3', description: 'Sound 17'},
        {address: 'url-to-sound18.mp3', description: 'Sound 18'},
      ],
    },
    {
      label: 'Voice 7',
      gender: 0,
      voiceDesc: 'Voice Desc 7',
      soundData: [
        {address: 'url-to-sound19.mp3', description: 'Sound 19'},
        {address: 'url-to-sound20.mp3', description: 'Sound 20'},
        {address: 'url-to-sound21.mp3', description: 'Sound 21'},
      ],
    },
  ];

  const [pitchShift, setPitchShift] = useState(0); // 기본 값 0
  const [pitchVariance, setPitchVariance] = useState(0); // 기본 값 0
  const [speed, setSpeed] = useState(1); // 기본 값 1

  // 각 슬라이더의 최솟값과 최댓값 설정
  const pitchShiftMin = -24;
  const pitchShiftMax = 24;
  const pitchVarianceMin = 0;
  const pitchVarianceMax = 2;
  const pitchVarianceStep = 0.1;
  const speedMin = 0.5;
  const speedMax = 2;
  const speedStep = 0.1;

  const handleSelectVisibilityItem = (value: number) => {
    onVisibilityChange(value);
  };

  const handleGetTagList = async () => {
    try {
      const response = await sendGetTagList({});

      if (response.data) {
        const tagData: string[] = response.data?.tagList;
        setTagList(tagData);
      } else {
        console.warn('No tags found in the response.');
        setTagList([]);
      }
    } catch (error) {
      console.error('Failed to fetch tags:', error);
    }
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

  const handleTagRemove = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag));
  };

  // const handleSelectPositionCountryItem = (value: number) => {
  //   onPositionCountryChange(value);
  // };

  const handleSelectCharacterIp = (value: number) => {
    onCharacterIPChange(value);
  };

  const handleSelectMonetization = (value: boolean) => {
    onIsMonetizationChange(value);
  };

  const handleSelectNSWF = (value: boolean) => {
    onNsfwChange(value);
  };

  const handleSelectConnectCharacter = (value: number) => {
    onConnectCharacterIdChange(value);
  };

  const handlePositionCountryChange = (value: number[]) => {
    onPositionCountryChange(value);
  };

  useEffect(() => {
    onTagChange(selectedTags.join(', '));
    console.log(selectedTags.join(', '));
  }, [selectedTags, onTagChange]);

  useEffect(() => {
    const updatedItems = connectableCharacterList.map((character, index) => ({
      title: character.name,
      label: 'Character',
      value: index.toString(),
      profileImage: character.mainImageUrl || '/images/default-profile.png', // 기본 이미지 설정
    }));

    setConnectCharacterItems(updatedItems);
  }, [connectableCharacterList]);

  const renderDropDownSelectDrawer = (
    title: string,
    items: string[],
    selectedItem: number,
    handler: (value: number) => void,
    isOpen: boolean,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
    drawerTitle?: string,
    tooltip?: string,
  ) => {
    const drawerItems: SelectDrawerItem[] = items.map((item, index) => ({
      name: item.toString(),
      onClick: () => handler(index),
    }));

    return (
      <div className={styles.dropDownArea}>
        <h2 className={styles.title2}>{title}</h2>
        <div className={styles.selectItem}>
          <div className={styles.selectItemText}>{items[selectedItem]}</div>
          <button className={styles.selectItemButton} onClick={() => setIsOpen(!isOpen)}>
            <img className={styles.selectItemIcon} src={BoldArrowDown.src} />
          </button>
        </div>
        <SelectDrawer
          isOpen={isOpen}
          items={drawerItems}
          onClose={() => setIsOpen(false)}
          selectedIndex={
            selectedItem // selectedItem이 number라면 바로 인덱스를 사용
          }
        >
          {drawerTitle && (
            <div className={styles.drawerTitleArea}>
              <div className={styles.drawerTitle}>{drawerTitle}</div>
              {tooltip && (
                <div className={styles.infoButton}>
                  <CustomToolTip tooltipText={tooltip} icon="info" tooltipStyle={{transform: 'translate(-100%)'}} />
                </div>
              )}
            </div>
          )}
        </SelectDrawer>
      </div>
    );
  };

  const renderDropDown = (
    title: string,
    selectedItem: string,
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  ) => {
    return (
      <div className={styles.dropDownArea}>
        <h2 className={styles.title2}>{title}</h2>
        <div className={styles.selectItem}>
          <div className={styles.selectItemText}>{selectedItem}</div>
          <button
            className={styles.selectItemButton}
            onClick={() => setIsOpen(prev => !prev)} // 상태 토글
          >
            <img className={styles.selectItemIcon} src={BoldArrowDown.src} />
          </button>
        </div>
      </div>
    );
  };

  const renderTag = () => {
    return (
      <>
        {
          <CustomDrawer
            open={tagOpen}
            onClose={() => setTagOpen(false)}
            title="Tag"
            contentStyle={{padding: '0px', marginTop: '20px'}}
          >
            <div className={styles.tagArea}>
              <button className={styles.tagRefreshButton} onClick={() => setSelectedTags([])}>
                <div className={styles.tagRefreshText}>Refresh</div>
                <img className={styles.tagRefreshIcon} src={LineRegenerate.src} />
              </button>
              {/* 태그 선택 부분 */}
              <div className={styles.tagSelect}>
                {tagList?.map(tag => (
                  <CustomHashtag
                    text={tag}
                    onClickAction={() => handleTagSelect(tag)}
                    isSelected={selectedTags.includes(tag)}
                  />
                ))}
              </div>
            </div>
          </CustomDrawer>
        }
        {selectedTagAlertOn && (
          <CustomPopup
            type="alert"
            title="Max Tag Count Alert"
            description={`maxTagCount : ${maxTagCount}`}
            buttons={[
              {
                label: 'Close',
                onClick: () => {
                  setSelectedTagAlertOn(false);
                },
              },
            ]}
          />
        )}
      </>
    );
  };

  const renderPositionCountry = () => {
    return (
      <DrawerPostCountry
        isOpen={isPositionCountryOpen}
        onClose={() => setIsPositionCountryOpen(false)}
        selectableCountryList={Object.values(LanguageType).filter(value => typeof value === 'number') as LanguageType[]}
        postCountryList={positionCountry}
        onUpdatePostCountry={handlePositionCountryChange}
      />
    );
  };

  const renderCharacterIP = () => {
    return (
      <>
        <div className={styles.radioButtonContainer}>
          <div className={styles.radioTitleArea}>
            <h2 className={styles.title2}>Character IP</h2>
            <CustomToolTip tooltipText="ToolTip Character IP" />
          </div>
          <div className={styles.ipButtonArea}>
            {characterIpData.items.map(item => (
              <div className={styles.ipButton} key={item.data}>
                <CustomRadioButton
                  shapeType="circle"
                  displayType="buttonText"
                  value={item.data}
                  // label={getLocalizedText('', item.label)}
                  label={item.label}
                  onSelect={() => handleSelectCharacterIp(item.data)}
                  selectedValue={characterIP}
                  containterStyle={{gap: '0'}}
                />
                <div className={styles.ipMonetizationTag}>{item.monetization}</div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  const renderRecruit = () => {
    // TODO : 별도 API 추가 된 후 작업 (다른 사람의 Profile 연동 관련)
    return <>{/* {renderDropDownSelectDrawer('Recruited', [], 0, () => {})} */}</>;
  };

  const getCharacterList = async () => {
    try {
      const response = await sendGetCharacterList({languageType: getCurrentLanguage()});
      if (response.data) {
        const characterInfoList: CharacterInfo[] = response.data?.characterInfoList;
        setConnectableCharacterList(characterInfoList);
      } else {
        throw new Error(`No contentInfo in response`);
      }
    } catch (error) {
      console.error('Error fetching character list:', error);
    }
  };

  const renderConnect = () => {
    return (
      <div className={styles.connectArea} onClick={() => getCharacterList()}>
        {/* 드롭다운을 누를때 마다 API 요청 */}
        <h2 className={styles.title2}>Connect</h2>
        <CustomDropDown
          displayType="Profile"
          textType="TitleLabel"
          items={connectCharacterItems}
          onSelect={(value: string | number) => handleSelectConnectCharacter(Number(value))}
        />
      </div>
    );
  };

  const renderOperatorInvite = () => {
    // TODO : 별도 API 추가 된 후 작업 (다른 사람의 Profile 연동 관련)
    return (
      <>
        <div className={styles.radioButtonContainer}>
          <div className={styles.operatorTitle}>
            <div className={styles.radioTitleArea}>
              <h2 className={styles.title2}>Operator invitation</h2>
              <CustomToolTip tooltipText="ToolTip Monetization" />
            </div>
            <button className={styles.subButton} onClick={() => setOperatorInviteOpen(true)}>
              Invite
            </button>
          </div>
          {renderOperatorList(false)}
        </div>
        <CustomDrawer
          title="Operator Invitation"
          open={operatorInviteOpen}
          onClose={() => setOperatorInviteOpen(false)}
        >
          <div className={styles.inviteDrawerContainer}>
            <div className={styles.inviteInputArea}>
              <CustomInput
                inputType="Basic"
                textType="InputOnly"
                value={inviteSearchValue}
                onChange={() => {
                  setInviteSearchValue;
                }}
                customClassName={[styles.inviteInput]}
              />
              <CustomButton size="Medium" state="Normal" type="ColorPrimary" onClick={() => {}}>
                Invite
              </CustomButton>
            </div>
            {renderOperatorList(true)}
            <div className={styles.inviteLinkArea}>
              <h2 className={styles.title2}>Invitation link</h2>
              <div className={styles.inviteLinkInputArea}>
                <CustomInput
                  inputType="Basic"
                  textType="InputOnly"
                  value={'link'}
                  disabled={true}
                  onChange={() => {}}
                  customClassName={[styles.inviteInput]}
                />
                <CustomButton size="Medium" state="Normal" type="Primary" onClick={() => {}}>
                  Copy
                </CustomButton>
              </div>
            </div>
          </div>
        </CustomDrawer>
      </>
    );
  };

  const renderOperatorList = (canedit: boolean) => {
    return (
      <ul className={styles.operatorList}>
        <div className={styles.operatorItem}>
          <div className={styles.operatorProfile}>
            <img className={styles.operatorProfileImage} src={'/images/001.png'} />
          </div>
          <div className={styles.operatorProfileTextArea}>
            <div className={styles.operatorProfileText}>OperatorName</div>
            {canedit ? (
              <CustomDropDown
                displayType="Text"
                items={invitationOption.items}
                onSelect={() => {}}
                style={{width: '180px', maxWidth: '100%'}}
              />
            ) : (
              <div className={styles.operatorProfileState}>Owner</div>
            )}
          </div>
        </div>
      </ul>
    );
  };

  const renderMonetization = () => {
    return (
      <div className={styles.radioButtonContainer}>
        <div className={styles.radioTitleArea}>
          <h2 className={styles.title2}>Monetization</h2>
          <CustomToolTip tooltipText="ToolTip Monetization" />
        </div>
        <div className={styles.verticalRadioButtonArea}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="On"
            label="On"
            onSelect={() => handleSelectMonetization(true)}
            selectedValue={isMonetization ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label="Off"
            onSelect={() => handleSelectMonetization(false)}
            selectedValue={isMonetization ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
        </div>
      </div>
    );
  };

  const renderNSFW = () => {
    return (
      <div className={styles.radioButtonContainer}>
        <div className={styles.radioTitleArea}>
          <h2 className={styles.title2}>NSFW*</h2>
          <CustomToolTip tooltipText="NSFW Monetization" />
        </div>
        <div className={styles.verticalRadioButtonArea}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="On"
            label="On"
            onSelect={() => handleSelectNSWF(true)}
            selectedValue={nsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label="Off"
            onSelect={() => handleSelectNSWF(false)}
            selectedValue={nsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
        </div>
      </div>
    );
  };

  const renderMembershipPlan = () => {
    return (
      <>
        <div className={styles.membershipPlanArea}>
          <div className={styles.bigTitle}>Membership Plan</div>
          <button className={styles.subButton}>setting</button>
        </div>
      </>
    );
  };

  const renderSuperVoiceSetting = () => {
    return (
      <>
        <div className={styles.voiceSettingArea}>
          <div className={styles.voiceSettingTitleArea}>
            <h2 className={styles.titleVoice}>Super Voice Setting</h2>
            <button className={styles.subButton} onClick={() => setVoiceOpen(true)}>
              Setting
            </button>
          </div>
          <div className={styles.voiceSettingDescArea}>
            <CustomToolTip tooltipText="Voice Setting" />
            <div className={styles.voiceSettingText}>
              Each AI voice actor has a variety of speaking styles. Select the style that best suits each sentence and
              print it.
            </div>
          </div>
        </div>
        <CustomDrawer open={voiceOpen} onClose={() => setVoiceOpen(false)} title="Select Voices">
          <div className={styles.voiceDrawerContainer}>
            <CustomRadioButton
              displayType="buttonText"
              shapeType="circle"
              label="I will not set the voice"
              value="False"
              selectedValue={'False'}
              onSelect={() => {}}
            />
            <Splitters
              splitters={voiceSplitter}
              placeholderWidth="40%"
              headerStyle={{padding: '0'}}
              contentStyle={{padding: '0'}}
            />
          </div>
          <div className={styles.pitchArea}>
            <div className={styles.sliderContainer}>
              <label htmlFor="pitchShift" className={styles.sliderLabel}>
                Pitch Shift {pitchShift}
              </label>
              <div className={styles.sliderWrapper}>
                <input
                  id="pitchShift"
                  type="range"
                  min={pitchShiftMin}
                  max={pitchShiftMax}
                  value={pitchShift}
                  onChange={e => setPitchShift(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>
            <div className={styles.sliderContainer}>
              <label htmlFor="pitchVariance" className={styles.sliderLabel}>
                Pitch Variance {pitchVariance}
              </label>
              <div className={styles.sliderWrapper}>
                <input
                  id="pitchVariance"
                  type="range"
                  min={pitchVarianceMin}
                  max={pitchVarianceMax}
                  value={pitchVariance}
                  step={pitchVarianceStep}
                  onChange={e => setPitchVariance(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>
            <div className={styles.sliderContainer}>
              <label htmlFor="speed" className={styles.sliderLabel}>
                Speed {speed}
              </label>
              <div className={styles.sliderWrapper}>
                <input
                  id="speed"
                  type="range"
                  min={speedMin}
                  max={speedMax}
                  value={speed}
                  step={speedStep}
                  onChange={e => setSpeed(Number(e.target.value))}
                  className={styles.slider}
                />
              </div>
            </div>
          </div>
        </CustomDrawer>
      </>
    );
  };

  const renderVoiceItem = (label: string, desc: string, soundData: SoundItem[]) => {
    return (
      <div className={styles.voiceItem}>
        <CustomRadioButton
          displayType="buttonOnly"
          shapeType="circle"
          value=""
          onSelect={() => {}}
          selectedValue={''}
        />
        <div className={styles.voiceInfoArea}>
          <div className={styles.voiceTitle}>{label}</div>
          <div className={styles.voiceDesc}>{desc}</div>
          <ul className={styles.soundList}>
            {soundData.map((item, index) => (
              <div className={styles.soundItem} key={index}>
                <button className={styles.soundButton}>
                  <img className={styles.soundIcon} src={BoldAudioPlay.src} alt="Play Icon" />
                </button>
                <div className={styles.soundText}>{item.description}</div>
              </div>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const voiceSplitter = [
    {
      label: 'All',
      content: (
        <ul className={styles.voiceList}>
          {voiceData.map((item, index) => (
            <div className={styles.voiceItem}>{renderVoiceItem(item.label, item.voiceDesc, item.soundData)}</div>
          ))}
        </ul>
      ),
    },
    {
      label: 'Male',
      content: (
        <ul className={styles.voiceList}>
          {voiceData
            .filter(item => item.gender === 0)
            .map((item, index) => (
              <div key={index}>{renderVoiceItem(item.label, item.voiceDesc, item.soundData)}</div>
            ))}
        </ul>
      ),
    },
    {
      label: 'Female',
      content: (
        <ul className={styles.voiceList}>
          {voiceData
            .filter(item => item.gender === 1)
            .map((item, index) => (
              <div key={index}>{renderVoiceItem(item.label, item.voiceDesc, item.soundData)}</div>
            ))}
        </ul>
      ),
    },
  ];

  useEffect(() => {
    if (tagOpen) {
      handleGetTagList();
    }
  }, [tagOpen]);

  return (
    <div className={styles.policyContainer}>
      <div className={styles.selectItemsArea1}>
        {renderDropDownSelectDrawer(
          VisibilityData.label,
          VisibilityData.items,
          visibility,
          (value: string | number) => handleSelectVisibilityItem(Number(value)),
          isVisibilityOpen,
          setIsVisibilityOpen,
          'Visibility',
          'Visibility Info',
        )}
        {renderDropDown('LLM', llmModelData[llmModel].label, setLlmOpen)}
        <ContentLLMSetup open={llmOpen} onClose={() => setLlmOpen(false)} onModelSelected={onLlmModelChange} />
        {renderDropDown('Tag', selectedTags.join(', '), setTagOpen)}
        {renderTag()}
        {renderDropDown(
          'Position Country',
          positionCountry.map(country => LanguageType[country]).join(', '),
          setIsPositionCountryOpen,
        )}
        {/*renderDropDownSelectDrawer(
          positionCountryData.label,
          positionCountryData.items,
          positionCountry,
          (value: string | number) => handleSelectPositionCountryItem(Number(value)),
          isPositionCountryOpen,
          setIsPositionCountryOpen,
        )*/}
        {renderPositionCountry()}
      </div>
      <div className={styles.selectItemsArea2}>
        {renderCharacterIP()}
        {renderRecruit()}
        {renderConnect()}
        {renderOperatorInvite()}
        {renderMonetization()}
        {renderMembershipPlan()}
        {renderNSFW()}
        {renderSuperVoiceSetting()}
      </div>
    </div>
  );
};

export default CharacterCreatePolicy;
