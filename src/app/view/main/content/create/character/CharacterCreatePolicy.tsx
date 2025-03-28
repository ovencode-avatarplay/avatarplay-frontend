import {LineClose} from '@ui/Icons';
import styles from './CharacterCreatePolicy.module.css';
import {useEffect, useState} from 'react';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import StoryLLMSetup from '../story-main/story-LLMsetup/StoryLLMsetup';
import llmModelData from '../story-main/story-LLMsetup/StoryLLMsetup.json';
import {sendGetTagList} from '@/app/NetWork/StoryNetwork';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import DrawerPostCountry from '../common/DrawerPostCountry';
import CharacterCreateVoiceSetting from './CharacterCreateVoiceSetting';
import OperatorInviteDrawer from '../common/DrawerOperatorInvite';
import DrawerTagSelect from '../common/DrawerTagSelect';
import {OperatorAuthorityType, ProfileSimpleInfo, ProfileTabType} from '@/app/NetWork/ProfileNetwork';
import {SetStateAction} from 'jotai';
import DrawerConnectCharacter from '../common/DrawerConnectCharacter';
import DrawerMembershipSetting from '../common/DrawerMembershipSetting';
import CustomSelector from '@/components/layout/shared/CustomSelector';
import MaxTextInput, {displayType, inputState, inputType} from '@/components/create/MaxTextInput';
import {getLangKey, LanguageType, MembershipSetting} from '@/app/NetWork/network-interface/CommonEnums';
import formatText from '@/utils/formatText';
import CustomChipSelector from '@/components/layout/shared/CustomChipSelector';

interface Props {
  visibility: number;
  onVisibilityChange: (value: number) => void;
  llmModel: number;
  onLlmModelChange: (value: number) => void;
  llmCustomAPIKey: string;
  onLlmCustomAPIKeyChange: React.Dispatch<SetStateAction<string>>;
  tag: string;
  onTagChange: (value: string) => void;
  positionCountry: number[];
  onPositionCountryChange: (value: number[]) => void;
  characterIP: number;
  onCharacterIPChange: (value: number) => void;
  membershipSetting: MembershipSetting;
  onMembershipSettingChange: (updatedInfo: MembershipSetting) => void;
  connectCharacterInfo: ProfileSimpleInfo;
  onConnectCharacterInfoChange: (value: ProfileSimpleInfo) => void;
  connectCharacterId: number;
  onConnectCharacterIdChange: (value: number) => void;
  operatorProfileIdList: ProfileSimpleInfo[];
  onOperatorProfileIdListChange: (value: ProfileSimpleInfo[]) => void;
  isMonetization: boolean;
  onIsMonetizationChange: (value: boolean) => void;
  nsfw: boolean;
  onNsfwChange: (value: boolean) => void;
  creatorComment: string;
  setCharacterDesc: React.Dispatch<React.SetStateAction<string>>;
  essentialWarning: boolean;
  curCharacterId: number;
}

const Header = 'CreateCharacter';
const Common = 'Common';

const CharacterCreatePolicy: React.FC<Props> = ({
  visibility,
  onVisibilityChange,
  llmModel,
  onLlmModelChange,
  llmCustomAPIKey,
  onLlmCustomAPIKeyChange,
  tag,
  onTagChange,
  positionCountry,
  onPositionCountryChange,
  characterIP,
  onCharacterIPChange,
  membershipSetting,
  onMembershipSettingChange,
  connectCharacterInfo,
  onConnectCharacterInfoChange,
  connectCharacterId,
  onConnectCharacterIdChange,
  operatorProfileIdList,
  onOperatorProfileIdListChange,
  isMonetization,
  onIsMonetizationChange,
  nsfw,
  onNsfwChange,
  creatorComment,
  setCharacterDesc,
  essentialWarning,
  curCharacterId,
}) => {
  let VisibilityData = {items: ['common_dropdown_private', 'common_dropdown_unlisted', 'common_filter_public']};

  const [llmOpen, setLlmOpen] = useState(false);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tagOpen, setTagOpen] = useState(false);

  const tagGroups = [
    {
      category: 'Theme',
      tags: [
        'common_tag_male',
        'common_tag_female',
        'common_tag_boyfriend',
        'common_tag_girlfriend',
        'common_tag_hero',
        'common_tag_elf',
        'common_tag_romance',
        'common_tag_vanilla',
        'common_tag_contemporaryFantasy',
        'common_tag_isekai',
        'common_tag_flirting',
        'common_tag_dislike',
        'common_tag_comedy',
        'common_tag_noir',
        'common_tag_horror',
        'common_tag_demon',
        'common_tag_sf',
        'common_tag_vampire',
        'common_tag_office',
        'common_tag_monster',
        'common_tag_anime',
        'common_tag_books',
        'common_tag_aliens',
      ],
    },
  ];

  const [tagList, setTagList] = useState<string[]>(() => {
    const themeGroup = tagGroups.find(group => group.category === 'Theme');
    return themeGroup ? themeGroup.tags : [];
  });

  const maxTagCount = 10;
  const [selectedTagAlertOn, setSelectedTagAlertOn] = useState(false);

  const [isVisibilityOpen, setIsVisibilityOpen] = useState(false);
  const [isPositionCountryOpen, setIsPositionCountryOpen] = useState(false);
  const [isAll, setIsAll] = useState<boolean>(false);

  let characterIpData = {
    items: [
      {
        label: getLocalizedText('common_button_original'),
        data: 1,
        monetization: getLocalizedText('common_label_004'),
      },
      {
        label: getLocalizedText('common_button_fan'),
        data: 2,
        monetization: '',
      },
    ],
  };

  const [connectOpen, setConnectOpen] = useState(false);
  const [connectableCharacterList, setConnectableCharacterList] = useState<ProfileSimpleInfo[]>([]);
  const [connectCharacterItems, setConnectCharacterItems] = useState<
    {label: string; title: string; value: string; profileImage: string}[]
  >([]);

  const [operatorInviteOpen, setOperatorInviteOpen] = useState(false);
  const [inviteSearchValue, setInviteSearchValue] = useState<string>('');

  const [voiceOpen, setVoiceOpen] = useState<boolean>(false);
  const [notSetVoice, setNotSetVoice] = useState<boolean>(false);
  const [selectedVoiceId, setSelectedVoiceId] = useState<number>(0);
  const [pitchShift, setPitchShift] = useState<number>(0);
  const [pitchVariance, setPitchVariance] = useState<number>(0);
  const [speed, setSpeed] = useState<number>(0);

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
    onConnectCharacterInfoChange(connectableCharacterList[value]);
  };

  const handlePositionCountryChange = (value: number[]) => {
    onPositionCountryChange(value);
  };

  const totalLanguages = Object.values(LanguageType).filter(value => typeof value === 'number').length;

  const getOperatorAuthorityLabel = (value: number): string => {
    return (
      Object.keys(OperatorAuthorityType).find(
        key => OperatorAuthorityType[key as keyof typeof OperatorAuthorityType] === value,
      ) || 'Unknown'
    );
  };

  useEffect(() => {
    if (tag) {
      const parsedTags = tag.split(', ').map(tag => tag.trim());
      setSelectedTags(parsedTags);
    } else {
      setSelectedTags([]);
    }
  }, []);

  useEffect(() => {
    onTagChange(selectedTags.join(', '));
    console.log(selectedTags.join(', '));
  }, [selectedTags, onTagChange]);

  useEffect(() => {
    setIsAll(positionCountry.length === totalLanguages);
  }, [positionCountry]);

  useEffect(() => {
    const updatedItems = connectableCharacterList.map((character, index) => ({
      title: character.name,
      label: 'Character',
      value: index.toString(),
      profileImage: character.iconImageUrl || '/images/001.png',
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
      name: getLocalizedText(item.toString()),
      onClick: () => handler(index),
    }));

    return (
      <div className={styles.dropDownArea}>
        <h2 className={styles.title2}>{title}</h2>
        <CustomSelector value={getLocalizedText(items[selectedItem])} onClick={() => setIsOpen(!isOpen)} />
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
                  <CustomToolTip
                    tooltipText={tooltip}
                    titleText={drawerTitle}
                    icon="info"
                    tooltipStyle={{right: '10px', left: 'auto'}}
                  />
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
    essential?: boolean,
    essentialWarning?: boolean,
  ) => {
    return (
      <div className={styles.dropDownArea}>
        <div className={styles.title2}>
          {title}
          {essential && <div className={styles.titleAstrisk}>*</div>}
        </div>
        <div
          className={`${styles.dropDownContainer} ${
            essentialWarning && selectedItem.length < 1 ? styles.isEssential : ''
          }`}
        >
          <CustomSelector value={selectedItem} onClick={() => setIsOpen(prev => !prev)} />
        </div>
      </div>
    );
  };

  const renderTag = () => {
    return (
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
        isAll={isAll}
        setIsAll={setIsAll}
      />
    );
  };

  const renderCharacterIP = () => {
    return (
      <>
        <div className={styles.radioButtonContainer}>
          <div className={styles.radioTitleArea}>
            <h2 className={styles.title2}>{getLocalizedText(Header, 'createcharacter017_label_002')}</h2>
            <CustomToolTip
              tooltipText={getLocalizedText(Header, 'createcharacter017_desc_016')}
              titleText={getLocalizedText(Header, 'createcharacter017_label_005')}
            />
          </div>
          <div className={styles.ipButtonArea}>
            {characterIpData.items.map(item => (
              <div className={styles.ipButton} key={item.data}>
                <CustomRadioButton
                  shapeType="circle"
                  displayType="buttonText"
                  value={item.data}
                  label={item.label}
                  onSelect={() => handleSelectCharacterIp(item.data)}
                  selectedValue={characterIP}
                  containterStyle={{gap: '0'}}
                />
                {item.data === 0 && <div className={styles.ipMonetizationTag}>{item.monetization}</div>}
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

  const renderConnect = () => {
    return (
      <DrawerConnectCharacter
        curCharacterId={curCharacterId}
        connectOpen={connectOpen}
        setConnectOpen={setConnectOpen}
        connectCharacterInfo={connectCharacterInfo}
        onConnectCharacterSelected={handleSelectConnectCharacter}
        onConnectCharacterInfoChange={onConnectCharacterInfoChange}
        // onConnectCharacterIdChange={onConnectCharacterIdChange}
      />
    );
  };

  const renderOperatorInvite = () => {
    // TODO : 별도 API 추가 된 후 작업 (다른 사람의 Profile 연동 관련)
    return (
      <>
        <div className={styles.radioButtonContainer}>
          <div className={styles.operatorTitle}>
            <div className={styles.radioTitleArea}>
              <h2 className={styles.title2}>{getLocalizedText('common_label_005')}</h2>
              <CustomToolTip
                tooltipText={getLocalizedText(Header, 'createcharacter017_desc_017')}
                titleText={getLocalizedText(Header, 'createcharacter017_label_008')}
              />
            </div>
            <button className={styles.subButton} onClick={() => setOperatorInviteOpen(true)}>
              {getLocalizedText(Common, 'common_button_invite')}
            </button>
          </div>
          {renderOperatorList(operatorProfileIdList, false)}
        </div>
        <OperatorInviteDrawer
          isOpen={operatorInviteOpen}
          onClose={() => setOperatorInviteOpen(false)}
          inviteSearchValue={inviteSearchValue}
          operatorList={operatorProfileIdList}
          onUpdateOperatorList={onOperatorProfileIdListChange}
          setInviteSearchValue={setInviteSearchValue}
        />
      </>
    );
  };

  const renderOperatorList = (
    list: ProfileSimpleInfo[],
    canEdit: boolean,
    onUpdateRole?: (id: number, role: OperatorAuthorityType) => void,
  ) => {
    return (
      <ul className={styles.operatorList}>
        {list.map(operator => renderOperatorItem(operator, canEdit, onUpdateRole))}
      </ul>
    );
  };

  const renderOperatorItem = (
    operator: ProfileSimpleInfo,
    canEdit: boolean,
    onUpdateRole?: (id: number, role: OperatorAuthorityType) => void,
  ) => (
    <div key={operator.profileId} className={styles.operatorItem}>
      <div className={styles.operatorProfile}>
        <img className={styles.operatorProfileImage} src={operator.iconImageUrl} />
      </div>
      <div className={styles.operatorProfileTextArea}>
        <div className={styles.operatorProfileText}>{operator.name}</div>
        {canEdit ? (
          <CustomDropDown
            displayType="Text"
            initialValue={operator.operatorAuthorityType}
            items={Object.keys(OperatorAuthorityType)
              .filter(key => isNaN(Number(key)))
              .map(key => ({label: key, value: OperatorAuthorityType[key as keyof typeof OperatorAuthorityType]}))}
            onSelect={selected => {
              if (onUpdateRole) {
                const selectedRole = OperatorAuthorityType[selected as keyof typeof OperatorAuthorityType];
                onUpdateRole(operator.profileId, selectedRole);
              }
            }}
            style={{width: '180px', maxWidth: '100%'}}
          />
        ) : (
          <div className={styles.operatorProfileState}>{getOperatorAuthorityLabel(operator.operatorAuthorityType)}</div>
        )}
      </div>
    </div>
  );

  const renderMonetization = () => {
    // return (
    //   <div className={styles.radioButtonContainer}>
    //     <div className={styles.radioTitleArea}>
    //       <h2 className={styles.title2}>{getLocalizedText(Header, 'createcharacter017_label_009')}</h2>
    //       <CustomToolTip
    //         tooltipText="ToolTip Monetization"
    //         titleText={getLocalizedText(Header, 'createcharacter017_label_009')}
    //       />
    //     </div>
    //     <div className={styles.verticalRadioButtonArea}>
    //       <CustomRadioButton
    //         shapeType="circle"
    //         displayType="buttonText"
    //         value="On"
    //         label={getLocalizedText(Common, 'common_button_on')}
    //         onSelect={() => handleSelectMonetization(true)}
    //         selectedValue={isMonetization ? 'On' : 'Off'}
    //         containterStyle={{gap: '0'}}
    //       />
    //       <CustomRadioButton
    //         shapeType="circle"
    //         displayType="buttonText"
    //         value="Off"
    //         label={getLocalizedText(Common, 'common_button_off')}
    //         onSelect={() => handleSelectMonetization(false)}
    //         selectedValue={isMonetization ? 'On' : 'Off'}
    //         containterStyle={{gap: '0'}}
    //       />
    //     </div>
    //   </div>
    // );
  };

  const renderNSFW = () => {
    return (
      <div className={styles.radioButtonContainer}>
        <div className={styles.radioTitleArea}>
          <div className={styles.title2}>
            {getLocalizedText('common_label_008')}
            {/* <span className={styles.titleAstrisk}>*</span> */}
          </div>
          <CustomToolTip
            tooltipText={getLocalizedText('createcharacter017_desc_018')}
            titleText={getLocalizedText('createcharacter017_label_011')}
          />
        </div>
        <div className={styles.verticalRadioButtonArea}>
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="On"
            label={getLocalizedText('common_button_on')}
            onSelect={() => handleSelectNSWF(true)}
            selectedValue={nsfw ? 'On' : 'Off'}
            containterStyle={{gap: '0'}}
          />
          <CustomRadioButton
            shapeType="circle"
            displayType="buttonText"
            value="Off"
            label={getLocalizedText('common_button_off')}
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
      <DrawerMembershipSetting
        onClose={() => {}}
        membershipSetting={membershipSetting}
        onMembershipSettingChange={onMembershipSettingChange}
      />
    );
  };

  const renderSuperVoiceSetting = () => {
    // return (
    // <>
    //   <div className={styles.voiceSettingArea}>
    //     <div className={styles.voiceSettingTitleArea}>
    //       <h2 className={styles.titleVoice}>{getLocalizedText(Header, 'createcharacter017_label_012')}</h2>
    //       <button className={styles.subButton} onClick={() => setVoiceOpen(true)}>
    //         {getLocalizedText(Common, 'common_button_setting')}
    //       </button>
    //     </div>
    //     <div className={styles.voiceSettingDescArea}>
    //       <CustomToolTip tooltipText="Voice Setting" />
    //       <div className={styles.voiceSettingText}>{getLocalizedText(Header, 'createcharacter017_desc_013')}</div>
    //     </div>
    //   </div>
    //   <CharacterCreateVoiceSetting
    //     voiceOpen={voiceOpen}
    //     setVoiceOpen={setVoiceOpen}
    //     notSetVoice={notSetVoice}
    //     setNotSetVoice={setNotSetVoice}
    //     selectedVoiceId={selectedVoiceId}
    //     setSelectedVoiceId={setSelectedVoiceId}
    //     pitchShift={pitchShift}
    //     setPitchShift={setPitchShift}
    //     pitchVariance={pitchVariance}
    //     setPitchVariance={setPitchVariance}
    //     speed={speed}
    //     setSpeed={setSpeed}
    //   />
    // </>
    // );
  };

  const renderComment = () => {
    return (
      <div className={styles.commentInputArea}>
        <div className={styles.commentTitleArea}>
          <h2 className={styles.title2}>{getLocalizedText(Header, 'createcharacter017_label_020')} </h2>
        </div>
        <MaxTextInput
          stateDataType={inputState.Normal}
          inputDataType={inputType.None}
          displayDataType={displayType.Default}
          promptValue={creatorComment}
          handlePromptChange={e => setCharacterDesc(e.target.value)}
          placeholder={getLocalizedText('createcharacter017_desc_021')}
          inSideHint={formatText(getLocalizedText('createcharacter001_label_013'), [creatorComment?.length.toString()])}
        />
      </div>
    );
  };

  useEffect(() => {
    if (tagOpen) {
      // handleGetTagList();
    }
  }, [tagOpen]);

  return (
    <div className={styles.policyContainer}>
      <div className={styles.selectItemsArea1}>
        {renderDropDownSelectDrawer(
          getLocalizedText('common_label_001'),
          VisibilityData.items,
          visibility,
          (value: string | number) => handleSelectVisibilityItem(Number(value)),
          isVisibilityOpen,
          setIsVisibilityOpen,
          getLocalizedText('common_label_001'),
          getLocalizedText('common_label_001'),
        )}
        {renderDropDown(
          getLocalizedText('createcharacter017_label_001'),
          getLocalizedText(Common, llmModelData[llmModel].label),
          setLlmOpen,
        )}
        <StoryLLMSetup
          open={llmOpen}
          onClose={() => setLlmOpen(false)}
          onModelSelected={onLlmModelChange}
          initialValue={llmModel}
          customAPIKey={llmCustomAPIKey}
          onCustomAPIKeyChange={onLlmCustomAPIKeyChange}
        />

        <CustomChipSelector
          label={getLocalizedText('common_label_002')}
          onClick={() => {
            setTagOpen(true);
          }}
          tagType="tags"
          tags={selectedTags}
          handleTagSelect={handleTagSelect}
        />
        {renderTag()}

        <CustomChipSelector
          label={
            <div className={styles.title2}>
              {getLocalizedText('common_label_003')}
              <div className={styles.titleAstrisk}>*</div>
            </div>
          }
          onClick={() => {
            setIsPositionCountryOpen(true);
          }}
          tagType="node"
          reactNode={
            <div className={styles.blackTagContainer}>
              {positionCountry.map((tag, index) => (
                <div key={index} className={styles.blackTag}>
                  {getLocalizedText(getLangKey(tag))}
                  <img
                    src={LineClose.src}
                    className={styles.lineClose}
                    onClick={() => onPositionCountryChange(positionCountry.filter((_, i) => i !== index))}
                  />
                </div>
              ))}
            </div>
          }
          error={positionCountry.length === 0 && essentialWarning}
        />
        {renderPositionCountry()}
      </div>
      <div className={styles.selectItemsArea2}>
        {renderCharacterIP()}
        {renderRecruit()}
        {renderConnect()}
        {renderOperatorInvite()}
        {/*renderMonetization()*/}
        {renderMembershipPlan()}
        {renderNSFW()}
        {renderComment()}
      </div>
    </div>
  );
};

export default CharacterCreatePolicy;
