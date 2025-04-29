interface Props {}

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './CreateVariationMain.module.css';
import SwipeTagList from '@/app/view/studio/workroom/SwipeTagList';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {useLayoutEffect, useState} from 'react';
import {getCurrentLanguage} from '@/utils/UrlMove';
import {
  sendGetCharacterList,
  GetCharacterListReq,
  sendGetCharacterProfileInfo,
  CharacterIP,
} from '@/app/NetWork/CharacterNetwork';
import {GetCharacterInfoReq} from '@/app/NetWork/CharacterNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldAltArrowDown, BoldViewGallery, LineList} from '@ui/Icons';

const CreateVariationMain: React.FC<Props> = ({}) => {
  //#region Pre Define
  const variationTags = ['Portrait', 'Pose', 'Expressions', 'Video'];
  //#endregion

  //#region State
  const [loading, setLoading] = useState(false);
  const [detailView, setDetailView] = useState(false);
  const [characterList, setCharacterList] = useState<CharacterInfo[]>([]);

  const [selectedIpFilter, setSelectedIpFilter] = useState<CharacterIP>(CharacterIP.Original);

  const [selectedCharacter, setSelectedCharacter] = useState<CharacterInfo | null>(null);
  const [tagStates, setTagStates] = useState({
    variation: 'Portrait',
  });
  //#endregion

  useLayoutEffect(() => {
    Init();
  }, []);

  function Init() {
    getCharacterList();
  }

  //#region function

  // 현재 유저가 가진 캐릭터를 모두 가져옴

  const getCharacterList = async () => {
    setLoading(true);

    try {
      const characterListreq: GetCharacterListReq = {
        languageType: getCurrentLanguage(),
      };
      const response = await sendGetCharacterList(characterListreq);

      if (response.data) {
        const characterInfoList: CharacterInfo[] = response.data?.characterInfoList;
        setCharacterList(characterInfoList);
      } else {
        throw new Error(`No contentInfo in response for ID: `);
      }
    } catch (error) {
      console.error('Error fetching content by user ID:', error);
    } finally {
      setLoading(false);
    }
  };

  // Id로 캐릭터 정보를 가져옴
  const getCharacterInfo = async (id: number) => {
    try {
      const req: GetCharacterInfoReq = {languageType: getCurrentLanguage(), profileId: id};
      const response = await sendGetCharacterProfileInfo(req);

      if (response.data) {
        const characterInfo: CharacterInfo = response.data?.characterInfo;
        setSelectedCharacter(characterInfo);
      } else {
        throw new Error(`No characterInfo in response : ${id}`);
      }
    } catch (error) {
      console.error('Error get Character Info by Id :', error);
    } finally {
    }
  };

  //#endregion

  //#region Handler
  const handleTagClick = (type: keyof typeof tagStates, tag: string) => {
    setTagStates(prev => ({...prev, [type]: tag}));
  };
  //#endregion

  //#region Render
  const renderFilter = (detailViewButton: boolean, detailView: boolean) => {
    return (
      <>
        <div className={styles.filterLeft}>
          {detailViewButton && (
            <button
              className={styles.detailViewButton}
              onClick={() => {
                setDetailView(prev => !prev);
              }}
            >
              <img src={!detailView ? BoldViewGallery.src : LineList.src} alt="detailView" />
            </button>
          )}
          <button
            className={`${styles.filterButton} ${selectedIpFilter === CharacterIP.Original ? styles.selected : ''}`}
            onClick={() => {
              setSelectedIpFilter(CharacterIP.Original);
            }}
          >
            <div className={styles.filterText}>{getLocalizedText('TODO : Original')}</div>
          </button>

          <button
            className={`${styles.filterButton} ${selectedIpFilter === CharacterIP.Fan ? styles.selected : ''}`}
            onClick={() => {
              setSelectedIpFilter(CharacterIP.Fan);
            }}
          >
            <div className={styles.filterText}>{getLocalizedText('TODO : Fan')}</div>
          </button>
        </div>
        <div className={styles.filterRight}>
          <div className={styles.filterText}>{getLocalizedText('TODO : Filter')}</div>
          <img src={BoldAltArrowDown.src} alt="filter" />
        </div>
      </>
    );
  };

  const renderCharacterList = () => {
    return (
      <div>
        <div className={styles.filterArea}>{renderFilter(true, detailView)}</div>
        <div className={styles.characterGrid}>
          {characterList.map((character, index) => {
            return renderCharacterItem(character, index);
          })}
        </div>
      </div>
    );
  };

  const renderCharacterItem = (character: CharacterInfo, key: number) => {
    return (
      <div key={key} className={styles.characterItem}>
        <div className={styles.characterImage}>
          <img src={character.mainImageUrl} alt={character.name} />
        </div>
        <div>{character.name}</div>
      </div>
    );
  };

  const renderVariationList = () => {
    return (
      <div>
        <SwipeTagList
          tags={variationTags}
          currentTag={tagStates.variation}
          onTagChange={tag => handleTagClick('variation', tag)}
        />
        {tagStates.variation}
      </div>
    );
  };

  //#endregion

  return (
    <div className={styles.variationMainContainer}>
      <CreateDrawerHeader title="Create Variation" onClose={() => {}}></CreateDrawerHeader>

      {selectedCharacter ? renderVariationList() : renderCharacterList()}
    </div>
  );
};

export default CreateVariationMain;
