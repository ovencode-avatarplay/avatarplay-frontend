import React, {useState} from 'react';
import styles from './DrawerConnectCharacter.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomButton from '@/components/layout/shared/CustomButton';
import {LineArrowDown, LineCheck} from '@ui/Icons';
import {getConnectList, GetConnectListReq, getProfileList, ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';
import getLocalizedText from '@/utils/getLocalizedText';

interface DrawerConnectCharacterProps {
  curCharacterId?: number;
  connectOpen: boolean;
  setConnectOpen: (open: boolean) => void;
  connectCharacterInfo: ProfileSimpleInfo | null;
  onConnectCharacterSelected: (value: number) => void;
  onConnectCharacterInfoChange: (value: ProfileSimpleInfo) => void;
  // onConnectCharacterIdChange: (value: number) => void;
}

const DrawerConnectCharacter: React.FC<DrawerConnectCharacterProps> = ({
  curCharacterId = 0,
  connectOpen,
  setConnectOpen,
  connectCharacterInfo,
  onConnectCharacterSelected,
  onConnectCharacterInfoChange,
  // onConnectCharacterIdChange,
}) => {
  const [connectableCharacterList, setConnectableCharacterList] = useState<ProfileSimpleInfo[]>([]);

  const getConnectableCharacterList = async () => {
    try {
      const payload: GetConnectListReq = {
        profileId: curCharacterId,
      };

      const response = await getConnectList(payload); // {languageType: getCurrentLanguage()}
      if (response) {
        const characterInfoList: ProfileSimpleInfo[] = response;
        setConnectableCharacterList(characterInfoList);
      } else {
        throw new Error(`No contentInfo in response`);
      }
    } catch (error) {
      console.error('Error fetching character list:', error);
    }
  };

  return (
    <div className={styles.dropDownArea}>
      <h2 className={styles.title2}>{getLocalizedText('CreateCharacter', 'createcharacter017_label_003')}</h2>
      <div
        className={styles.connectItem}
        onClick={e => {
          e.stopPropagation();
          getConnectableCharacterList();
          setConnectOpen(!connectOpen);
        }}
      >
        {!connectCharacterInfo || connectCharacterInfo.profileId === 0 ? (
          <div className={styles.connectItemText}>{getLocalizedText('Common', 'common_sample_079')}</div>
        ) : (
          <div className={styles.connectItemInfo}>
            <img className={styles.connectItemProfile} src={connectCharacterInfo.iconImageUrl} alt="Character" />
            <div className={styles.connectItemTitle}>{connectCharacterInfo.name}</div>
          </div>
        )}

        <button className={styles.dropdownButton}>
          <img className={styles.dropdownIcon} src={LineArrowDown.src} alt="Toggle" />
        </button>
      </div>

      <CustomDrawer
        open={connectOpen}
        onClose={() => setConnectOpen(false)}
        title={getLocalizedText('common_alert_016')}
      >
        <div className={styles.connectDrawerContainer}>
          <div className={styles.connectButtonArea}>
            <CustomButton size="Small" state="Normal" type="Primary" onClick={() => {}}>
              {getLocalizedText('common_button_mycharacter')}
            </CustomButton>
            <CustomButton size="Small" state="Normal" type="Tertiary" onClick={() => {}}>
              {getLocalizedText('common_button_ipsubscribe')}
            </CustomButton>
          </div>
          <ul className={styles.connectableListArea}>
            {connectableCharacterList.map((item, index) => (
              <li
                key={item.profileId || index}
                className={styles.dropdownItem}
                onClick={() => {
                  onConnectCharacterSelected(item.profileId);
                  onConnectCharacterInfoChange(item);
                  // onConnectCharacterIdChange(item.profileId);
                  setConnectOpen(false);
                }}
              >
                <div className={styles.dropdownInfo}>
                  <img className={styles.connectItemProfile} src={item.iconImageUrl} alt="Character" />
                  <div className={styles.connectItemTitle}>{item.name}</div>
                </div>
                {connectCharacterInfo?.profileId === item.profileId && (
                  <img className={styles.checkIcon} src={LineCheck.src}></img>
                )}
              </li>
            ))}
          </ul>
        </div>
      </CustomDrawer>
    </div>
  );
};

export default DrawerConnectCharacter;
