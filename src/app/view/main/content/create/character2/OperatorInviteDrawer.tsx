import React, {useEffect, useState} from 'react';
import styles from './OperatorInviteDrawer.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomButton from '@/components/layout/shared/CustomButton';
import {LineArrowDown} from '@ui/Icons';
import {
  InviteProfileReq,
  ProfileInfo,
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
  operatorList: OperatorData[];
  onUpdateOperatorList: (updatedList: OperatorData[]) => void;
  renderOperatorList: (list: OperatorData[], canEdit: boolean) => React.ReactNode;
}

export interface OperatorData {
  id: number;
  name: string;
  profileImage: string;
  role: string;
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
  const roleOptions = ['Owner', 'CanEdit', 'OnlyComment'];
  const [selectedRole, setSelectedRole] = useState(roleOptions[0]);
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
      }, 2000);
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
        setSearchedList(response.data.memeberProfileList);
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
      operatorAuthorityType: roleOptions.indexOf(selectedRole),
    };

    try {
      const response = await sendInviteProfileReq(payload);

      if (response && response.data) {
        const newProfile: OperatorData = {
          id: response.data.inviteProfileInfo.profileId,
          name: response.data.inviteProfileInfo.name,
          profileImage: response.data.inviteProfileInfo.iconImageUrl || '/default-profile.png',
          role: selectedRole,
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
                {selectedRole}
                <img
                  className={styles.dropdownIcon}
                  src={LineArrowDown.src}
                  style={dropdownOpen ? {transform: 'rotate(180deg)'} : {}}
                />
              </button>
              {dropdownOpen && (
                <ul className={styles.authDropdown}>
                  {roleOptions.map((role, index) => (
                    <li
                      key={index}
                      className={styles.authDropdownItem}
                      onClick={() => {
                        setSelectedRole(role);
                        setDropdownOpen(false);
                      }}
                    >
                      {role}
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
