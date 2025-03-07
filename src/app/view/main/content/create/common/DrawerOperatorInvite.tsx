import React, {useEffect, useRef, useState} from 'react';
import styles from './DrawerOperatorInvite.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomInput from '@/components/layout/shared/CustomInput';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldLetter, LineArrowDown, LineCheck, LineComment, LineDelete, LineEdit} from '@ui/Icons';
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
import CustomPopup from '@/components/layout/shared/CustomPopup';

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
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  const [authDropdownOpen, setAuthDropdownOpen] = useState(false);
  const authDropdownRef = useRef<HTMLDivElement | null>(null);
  const setAuthDropdownRef = (el: HTMLDivElement | null) => {
    authDropdownRef.current = el;
  };

  const dropdownRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const setDropdownRef = (index: number) => (el: HTMLDivElement | null) => {
    dropdownRefs.current[index] = el;
  };
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);

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
        setInviteSearchValue('');
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
              index,
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

  const handleDeleteOperator = (deleteIndex: number) => {
    setDeleteConfirmIndex(deleteIndex);
  };

  const confirmDeleteOperator = () => {
    if (deleteConfirmIndex === null) return;

    const updatedList = operatorList.filter((_, idx) => idx !== deleteConfirmIndex);
    onUpdateOperatorList(updatedList);
    setDeleteConfirmIndex(null); // 팝업 닫기
  };

  const cancelDeleteOperator = () => {
    setDeleteConfirmIndex(null); // 삭제 취소 시 팝업 닫기
  };

  const renderOperatorDropDown = (
    isOpen: boolean,
    onClickAction: (authType: string) => void,
    selectedAuthType: OperatorAuthorityType,
    toggleDropdown: () => void,
    index: number,
    isItem?: boolean,
  ) => {
    const tmpList = Object.keys(OperatorAuthorityType).filter(
      key => isNaN(Number(key)) && Number(OperatorAuthorityType[key as keyof typeof OperatorAuthorityType]) > 1,
    );
    return (
      <div
        className={isItem ? `${styles.selectedDropdownContainer}` : `${styles.dropdownContainer}`}
        ref={isItem ? setDropdownRef(index) : authDropdownRef}
      >
        <button className={styles.dropdownButton} onClick={toggleDropdown}>
          {OperatorAuthorityType[selectedAuthType]}
          <img
            className={styles.dropdownIcon}
            src={LineArrowDown.src}
            style={isOpen ? {transform: 'rotate(180deg)'} : {}}
          />
        </button>
        {isOpen && (
          <ul className={styles.authDropdown}>
            {tmpList.map((authType, idx) => (
              <li
                key={idx}
                className={styles.authDropdownItem}
                onClick={() => onClickAction(authType)}
                style={!isItem && tmpList.length - 1 === idx ? {borderBottom: 'none'} : {}}
              >
                {authType}
                <img className={styles.authIcon} src={idx === 0 ? LineEdit.src : idx === 1 ? LineComment.src : ''} />
              </li>
            ))}
            {isItem && (
              <li
                key="delete"
                className={`${styles.authDropdownItem} ${styles.isRed} `}
                onClick={() => handleDeleteOperator(index)}
                style={{borderBottom: 'none'}}
              >
                Delete
                <img className={styles.authIcon} src={LineDelete.src} />
              </li>
            )}
          </ul>
        )}
      </div>
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setSearchListOpen(false);
      }
    };

    if (searchListOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [searchListOpen, setSearchListOpen]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      let updatedStates = {...itemDropdownOpenStates};
      let hasChanges = false;

      Object.keys(dropdownRefs.current).forEach(key => {
        const dropdownRef = dropdownRefs.current[Number(key)];
        if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
          updatedStates[Number(key)] = false;
          hasChanges = true;
        }
      });

      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target as Node)) {
        setSearchDropdownOpen(false);
      }

      if (authDropdownRef.current && !authDropdownRef.current.contains(event.target as Node)) {
        setAuthDropdownOpen(false);
        hasChanges = true;
      }

      if (hasChanges) {
        setItemDropdownOpenStates(updatedStates);
      }
    };

    if (searchListOpen || authDropdownOpen || Object.values(itemDropdownOpenStates).some(isOpen => isOpen)) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [searchListOpen, authDropdownOpen, itemDropdownOpenStates]);

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
              <div className={styles.searchResultContainer} ref={searchDropdownRef}>
                <ul className={styles.searchResultList}>
                  {searchedList?.map((profile, index) => {
                    const isIncluded = operatorList.some(operator => operator.profileId === profile.id);

                    return (
                      <li
                        key={profile.id}
                        className={`${styles.searchResultItem} ${
                          searchedList.length - 1 === index ? styles.lastItem : ''
                        } ${isIncluded ? styles.disabledItem : ''}`}
                        onClick={() => {
                          if (!isIncluded) {
                            setInviteSearchValue(profile.name);
                            setSearchListOpen(false);
                            setSearchSelected(true);
                          }
                        }}
                      >
                        <div className={styles.headArea}>
                          <img
                            className={styles.searchProfileImage}
                            src={profile.iconImageUrl || '/default-profile.png'}
                          />
                          <div className={styles.searchProfileName}>{profile.name}</div>
                        </div>

                        {isIncluded && (
                          <div className={styles.tailArea}>
                            <div className={styles.tailText}>Already Added</div>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
            {renderOperatorDropDown(
              authDropdownOpen,
              authType => {
                setSelectedSearchAuthType(OperatorAuthorityType[authType as keyof typeof OperatorAuthorityType]);
                setAuthDropdownOpen(false);
              },
              selectedSearchAuthType,
              () => setAuthDropdownOpen(!authDropdownOpen),
              -1,
            )}
          </div>
          <button className={styles.inviteButton} onClick={handleOnClickInvite}>
            <img className={styles.inviteIcon} src={BoldLetter.src} />
          </button>
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
      {deleteConfirmIndex !== null && (
        <CustomPopup
          type="alert"
          title={`If you proceed, "${operatorList[deleteConfirmIndex].name}" will lose their channel management privileges.`}
          buttons={[
            {label: 'Cancel', onClick: cancelDeleteOperator},
            {label: 'Delete', onClick: confirmDeleteOperator, isPrimary: true},
          ]}
          onClose={cancelDeleteOperator}
        />
      )}
    </CustomDrawer>
  );
};

export default OperatorInviteDrawer;
