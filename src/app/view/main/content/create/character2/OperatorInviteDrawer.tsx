import React, {useEffect, useState} from 'react';
import styles from './OperatorInviteDrawer.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomButton from '@/components/layout/shared/CustomButton';
import {LineArrowDown} from '@ui/Icons';
import {
  InviteProfileReq,
  OperatorAuthorityType,
  ProfileInfo,
  ProfileSimpleInfo,
  SearchProfileReq,
  sendInviteProfileReq,
  sendSearchProfileReq,
} from '@/app/NetWork/ProfileNetwork';
import {getCurrentLanguage} from '@/utils/UrlMove';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  inviteSearchValue: string;
  setInviteSearchValue: (value: string) => void;
  operatorList: ProfileSimpleInfo[];
  onUpdateOperatorList: (updatedList: ProfileSimpleInfo[]) => void;
  renderOperatorList: (list: ProfileSimpleInfo[], canEdit: boolean) => React.ReactNode;
}

const OperatorInviteDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  inviteSearchValue,
  setInviteSearchValue,
  operatorList,
  onUpdateOperatorList,
  renderOperatorList,
}) => {
  const [selectedAuthType, setSelectedAuthType] = useState<OperatorAuthorityType>(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [searchedList, setSearchedList] = useState<ProfileInfo[]>([]);
  const [searchListOpen, setSearchListOpen] = useState<boolean>(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [searchSelected, setSearchSelected] = useState<boolean>(false);

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
      operatorAuthorityType: selectedAuthType,
    };

    try {
      const response = await sendInviteProfileReq(payload);

      if (response && response.data) {
        const newProfile: ProfileSimpleInfo = {
          ...response.data.inviteProfileInfo,
          operatorAuthorityType: selectedAuthType,
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
                    <li key={profile.id} className={styles.searchResultItem}>
                      <img className={styles.profileImage} src={profile.iconImageUrl || '/default-profile.png'} />
                      <div className={styles.profileName}>{profile.name}</div>
                      <button
                        className={styles.inviteButton}
                        onClick={() => {
                          setInviteSearchValue(profile.name);
                          setSearchListOpen(false);
                          setSearchSelected(true);
                        }}
                      >
                        Select
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className={styles.dropdownContainer}>
              <button className={styles.dropdownButton} onClick={() => setDropdownOpen(!dropdownOpen)}>
                {OperatorAuthorityType[selectedAuthType]}
                <img
                  className={styles.dropdownIcon}
                  src={LineArrowDown.src}
                  style={dropdownOpen ? {transform: 'rotate(180deg)'} : {}}
                />
              </button>
              {dropdownOpen && (
                <ul className={styles.authDropdown}>
                  {Object.keys(OperatorAuthorityType)
                    .filter(key => isNaN(Number(key)))
                    .map((authType, index) => (
                      <li
                        key={index}
                        className={styles.authDropdownItem}
                        onClick={() => {
                          setSelectedAuthType(OperatorAuthorityType[authType as keyof typeof OperatorAuthorityType]);
                          setDropdownOpen(false);
                        }}
                      >
                        {authType}
                      </li>
                    ))}
                </ul>
              )}
            </div>
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
        {renderOperatorList(operatorList, true)}
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
