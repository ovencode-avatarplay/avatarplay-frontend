import React, {useEffect, useState} from 'react';
import styles from './DrawerOperatorInvite.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomButton from '@/components/layout/shared/CustomButton';
import {LineArrowDown, LineCheck} from '@ui/Icons';
import {
  InviteProfileReq,
  OperatorAuthorityType,
  ProfileInfo,
  ProfileSimpleInfo,
  SearchProfileReq,
  SearchProfileType,
  sendInviteProfileReq,
  sendSearchProfileReq,
} from '@/app/NetWork/ProfileNetwork';
import {getCurrentLanguage} from '@/utils/UrlMove';
import CustomDropDown from '@/components/layout/shared/CustomDropDown';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inviteSearchValue: string;
  setInviteSearchValue: (value: string) => void;
  operatorList: ProfileSimpleInfo[];
  onUpdateOperatorList: (updatedList: ProfileSimpleInfo[]) => void;
}

const OperatorInviteDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  inviteSearchValue,
  setInviteSearchValue,
  operatorList,
  onUpdateOperatorList,
}) => {
  const [selectedSearchAuthType, setSelectedSearchAuthType] = useState<OperatorAuthorityType>(0);
  const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);

  const [searchedList, setSearchedList] = useState<ProfileInfo[]>([]);
  const [searchListOpen, setSearchListOpen] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchSelected, setSearchSelected] = useState<boolean>(false);
  const [selectedItemAuthTypes, setSelectedItemAuthTypes] = useState<{[key: number]: OperatorAuthorityType}>({});
  const [itemDropdownOpenStates, setItemDropdownOpenStates] = useState<{[key: number]: boolean}>({});

  const getOperatorAuthorityLabel = (value: number): string => {
    return (
      Object.keys(OperatorAuthorityType).find(
        key => OperatorAuthorityType[key as keyof typeof OperatorAuthorityType] === value,
      ) || 'Unknown'
    );
  };

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (!searchSelected && inviteSearchValue.trim() !== '') {
      const timeout = setTimeout(() => {
        handleOnSearch();
      }, 1000);
      setSearchTimeout(timeout);
    }

    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [inviteSearchValue]);

  const handleOnSearch = async () => {
    if (!inviteSearchValue.trim()) {
      alert('Please enter a search term.');
      return;
    }

    const payload: SearchProfileReq = {
      search: inviteSearchValue,
    };

    try {
      const response = await sendSearchProfileReq(payload);

      if (response && response.data) {
        setSearchedList(response.data.memberProfileList);
        setSearchListOpen(true);
      } else {
        setSearchedList([]);
        setSearchListOpen(false);
      }
    } catch (error) {
      console.error('Error search profile:', error);
      setSearchedList([]);
      setSearchListOpen(false);
    }
  };

  const handleOnClickInvite = async () => {
    if (!inviteSearchValue.trim()) {
      alert('Please enter a search term.');
      return;
    }

    const payload: InviteProfileReq = {
      languageType: getCurrentLanguage(),
      search: inviteSearchValue,
      operatorAuthorityType: selectedSearchAuthType,
    };

    try {
      const response = await sendInviteProfileReq(payload);

      if (response && response.data) {
        const newProfile: ProfileSimpleInfo = {
          ...response.data.inviteProfileInfo,
          operatorAuthorityType: selectedSearchAuthType,
        };

        const updatedList = [...operatorList, newProfile];
        onUpdateOperatorList(updatedList);

        console.log('New Operator:', newProfile);
        alert(`Invited: ${newProfile.name}`);
      } else {
        alert('No matching profile found.');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to fetch profile. Please try again.');
    }
  };

  const handleSearchAuthTypeChange = (id: number, newAuthType: OperatorAuthorityType) => {
    const updatedList = operatorList.map(operator =>
      operator.profileId === id ? {...operator, operatorAuthorityType: newAuthType} : operator,
    );
    onUpdateOperatorList(updatedList);
  };

  const toggleDropdown = (index: number) => {
    setItemDropdownOpenStates(prev => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleItemAuthTypeChange = (
    profileId: number,
    index: number,
    authType: string,
    onUpdateAuthType?: (id: number, authType: OperatorAuthorityType) => void,
  ) => {
    const newAuthType = OperatorAuthorityType[authType as keyof typeof OperatorAuthorityType];
    setSelectedItemAuthTypes(prev => ({
      ...prev,
      [profileId]: newAuthType,
    }));
    setItemDropdownOpenStates(prev => ({
      ...prev,
      [index]: false,
    }));

    if (onUpdateAuthType) {
      onUpdateAuthType(profileId, newAuthType);
    }
  };

  const renderOperatorList = (
    list: ProfileSimpleInfo[],
    canEdit: boolean,
    onUpdateRole?: (id: number, role: OperatorAuthorityType) => void,
  ) => {
    return (
      <ul className={styles.operatorList}>
        {list.map((operator, index) => renderOperatorItem(operator, index, canEdit, onUpdateRole))}
      </ul>
    );
  };

  const renderOperatorItem = (
    operator: ProfileSimpleInfo,
    index: number,
    canEdit: boolean,
    onUpdateRole?: (id: number, role: OperatorAuthorityType) => void,
  ) => {
    return (
      <div key={operator.profileId} className={styles.operatorItem}>
        <div className={styles.operatorProfile}>
          <img className={styles.operatorProfileImage} src={operator.iconImageUrl} />
        </div>
        <div className={styles.operatorProfileTextArea}>
          <div className={styles.operatorProfileText}>{operator.name}</div>
          {canEdit ? (
            renderOperatorDropDown(
              itemDropdownOpenStates[index] || false,
              authType => handleItemAuthTypeChange(operator.profileId, index, authType, onUpdateRole),
              selectedItemAuthTypes[index] || operator.operatorAuthorityType,
              () => toggleDropdown(index),
              true,
            )
          ) : (
            <div className={styles.operatorProfileState}>
              {getOperatorAuthorityLabel(operator.operatorAuthorityType)}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOperatorDropDown = (
    isOpen: boolean,
    onClickAction: (authType: string) => void,
    selectedAuthType: OperatorAuthorityType,
    toggleDropdown: () => void,
    isItem?: boolean,
  ) => {
    return (
      <div className={styles.dropdownContainer}>
        <button className={styles.dropdownButton} onClick={toggleDropdown}>
          {OperatorAuthorityType[selectedAuthType]}
          <img
            className={styles.dropdownIcon}
            src={LineArrowDown.src}
            style={isOpen ? {transform: 'rotate(180deg)'} : {}}
          />
        </button>
        {isOpen && (
          <ul className={`${styles.authDropdown} ${isItem ? styles.itemDropDown : ''}`}>
            {Object.keys(OperatorAuthorityType)
              .filter(key => isNaN(Number(key)))
              .map((authType, index) => (
                <li key={index} className={styles.authDropdownItem} onClick={() => onClickAction(authType)}>
                  {authType}
                  <img
                    className={`${styles.checkIcon} ${
                      selectedAuthType === OperatorAuthorityType[authType as keyof typeof OperatorAuthorityType]
                        ? styles.selectedIcon
                        : ''
                    }`}
                    src={LineCheck.src}
                  />
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <CustomDrawer
      title="Operator Invitation"
      open={isOpen}
      onClose={onClose}
      contentStyle={{padding: '0', paddingTop: '16px'}}
    >
      <div className={styles.inviteDrawerContainer}>
        <div className={styles.inviteInputArea}>
          <div className={styles.inviteInputBox}>
            <input
              className={styles.inviteInputText}
              type="text"
              placeholder="Enter email or username"
              value={inviteSearchValue}
              onChange={e => {
                setInviteSearchValue(e.target.value);
                setSearchSelected(false);
              }}
            />
            {searchedList?.length > 0 && searchListOpen && (
              <div className={styles.searchResultContainer}>
                <ul className={styles.searchResultList}>
                  {searchedList?.map(profile => (
                    <li
                      key={profile.id}
                      className={styles.searchResultItem}
                      onClick={() => {
                        setInviteSearchValue(profile.name);
                        setSearchListOpen(false);
                        setSearchSelected(true);
                      }}
                    >
                      <img className={styles.profileImage} src={profile.iconImageUrl || '/default-profile.png'} />
                      <div className={styles.profileName}>{profile.name}</div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {renderOperatorDropDown(
              searchDropdownOpen,
              authType => {
                setSelectedSearchAuthType(OperatorAuthorityType[authType as keyof typeof OperatorAuthorityType]);
                setSearchDropdownOpen(false);
              },
              selectedSearchAuthType,
              () => setSearchDropdownOpen(!searchDropdownOpen),
            )}
          </div>
          <CustomButton
            size="Medium"
            state="Normal"
            type="ColorPrimary"
            customClassName={[styles.inviteButton]}
            onClick={handleOnClickInvite}
          >
            Invite
          </CustomButton>
        </div>
        {renderOperatorList(operatorList, true, handleSearchAuthTypeChange)}
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
  );
};

export default OperatorInviteDrawer;
