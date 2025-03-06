import React, {useState} from 'react';
import styles from './DrawerConnectCharacter.module.css';
import CustomDrawer from '@/components/layout/shared/CustomDrawer';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldArrowDown} from '@ui/Icons';
import {getConnectList, getProfileList, ProfileSimpleInfo} from '@/app/NetWork/ProfileNetwork';

interface DrawerConnectCharacterProps {
  connectOpen: boolean;
  setConnectOpen: (open: boolean) => void;
  connectCharacterInfo: ProfileSimpleInfo | null;
  onConnectCharacterInfoChange: (value: ProfileSimpleInfo) => void;
}

const DrawerConnectCharacter: React.FC<DrawerConnectCharacterProps> = ({
  connectOpen,
  setConnectOpen,
  connectCharacterInfo,
  onConnectCharacterInfoChange,
}) => {
  const [connectableCharacterList, setConnectableCharacterList] = useState<ProfileSimpleInfo[]>([]);

  const getConnectableCharacterList = async () => {
    try {
      const response = await getConnectList(); // {languageType: getCurrentLanguage()}
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
      <h2 className={styles.title2}>Connect</h2>
      <div className={styles.connectItem} onClick={getConnectableCharacterList}>
        {!connectCharacterInfo || connectCharacterInfo.profileId === 0 ? (
          <div className={styles.connectItemText}>Select</div>
        ) : (
          <div className={styles.connectItemInfo}>
            <img className={styles.connectItemProfile} src={connectCharacterInfo.iconImageUrl} alt="Character" />
            <div className={styles.connectItemTitle}>{connectCharacterInfo.name}</div>
          </div>
        )}

        <button
          className={styles.dropdownButton}
          onClick={e => {
            e.stopPropagation();
            getConnectableCharacterList();
            setConnectOpen(!connectOpen);
          }}
        >
          <img className={styles.dropdownIcon} src={BoldArrowDown.src} alt="Toggle" />
        </button>
      </div>

      <CustomDrawer open={connectOpen} onClose={() => setConnectOpen(false)} title="Connect">
        <div className={styles.connectDrawerContainer}>
          <div className={styles.connectButtonArea}>
            <CustomButton size="Small" state="Normal" type="Primary" onClick={() => {}}>
              My Character
            </CustomButton>
            <CustomButton size="Small" state="Normal" type="Tertiary" onClick={() => {}}>
              IP Subscribe
            </CustomButton>
          </div>
          <ul className={styles.connectableListArea}>
            {connectableCharacterList.map((item, index) => (
              <li
                key={item.profileId || index}
                className={styles.connectItem}
                onClick={() => {
                  onConnectCharacterInfoChange(item);
                  setConnectOpen(false);
                }}
              >
                <div className={styles.connectItemInfo}>
                  <img className={styles.connectItemProfile} src={item.iconImageUrl} alt="Character" />
                  <div className={styles.connectItemTitle}>{item.name}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CustomDrawer>
    </div>
  );
};

export default DrawerConnectCharacter;
