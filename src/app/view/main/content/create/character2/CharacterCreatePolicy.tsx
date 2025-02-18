import {BoldArrowDown} from '@ui/Icons';
import styles from './CharacterCreatePolicy.module.css';
import {useEffect, useState} from 'react';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import ContentLLMSetup from '../content-main/content-LLMsetup/ContentLLMsetup';
import llmModelData from '../content-main/content-LLMsetup/ContentLLMsetup.json';
import {sendGetTagList} from '@/app/NetWork/ContentNetwork';
import CustomToolTip from '@/components/layout/shared/CustomToolTip';
import CustomRadioButton from '@/components/layout/shared/CustomRadioButton';
import getLocalizedText from '@/utils/getLocalizedText';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';
import {sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo, LanguageType} from '@/redux-store/slices/ContentInfo';
import {getCurrentLanguage} from '@/utils/UrlMove';
import DrawerPostCountry from '../common/DrawerPostCountry';
import CharacterCreateVoiceSetting from './CharacterCreateVoiceSetting';
import OperatorInviteDrawer from './OperatorInviteDrawer';
import DrawerTagSelect from '../common/DrawerTagSelect';
import {OperatorAuthorityType, ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';

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
  operatorProfileIdList: ProfileSimpleInfo[];
  onOperatorProfileIdListChange: (value: ProfileSimpleInfo[]) => void;
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
  operatorProfileIdList,
  onOperatorProfileIdListChange,
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
  const [isAll, setIsAll] = useState<boolean>(false);

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

  const totalLanguages = Object.values(LanguageType).filter(value => typeof value === 'number').length;

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
      <DrawerTagSelect
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
          {renderOperatorList(operatorProfileIdList, false)}
        </div>
        <OperatorInviteDrawer
          isOpen={operatorInviteOpen}
          onClose={() => setOperatorInviteOpen(false)}
          inviteSearchValue={inviteSearchValue}
          operatorList={operatorProfileIdList}
          onUpdateOperatorList={onOperatorProfileIdListChange}
          setInviteSearchValue={setInviteSearchValue}
          renderOperatorList={renderOperatorList}
        />
      </>
    );
  };

  const renderOperatorList = (list: ProfileSimpleInfo[], canEdit: boolean) => {
    return <ul className={styles.operatorList}>{list.map(operator => renderOperatorItem(operator, canEdit))}</ul>;
  };

  const renderOperatorItem = (operator: ProfileSimpleInfo, canEdit: boolean) => (
    <div key={operator.profileId} className={styles.operatorItem}>
      <div className={styles.operatorProfile}>
        <img className={styles.operatorProfileImage} src={operator.iconImageUrl} />
      </div>
      <div className={styles.operatorProfileTextArea}>
        <div className={styles.operatorProfileText}>{operator.name}</div>
        {canEdit ? (
          <CustomDropDown
            displayType="Text"
            items={invitationOption.items}
            onSelect={selected => console.log(`Selected ${selected} for ${operator.name}`)}
            style={{width: '180px', maxWidth: '100%'}}
          />
        ) : (
          <div className={styles.operatorProfileState}>{OperatorAuthorityType[operator.operatorAuthorityType]}</div>
        )}
      </div>
    </div>
  );

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
        <CharacterCreateVoiceSetting voiceOpen={voiceOpen} setVoiceOpen={setVoiceOpen} />
      </>
    );
  };

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
