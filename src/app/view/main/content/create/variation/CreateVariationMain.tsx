interface Props {}

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './CreateVariationMain.module.css';
import SwipeTagList from '@/app/view/studio/workroom/SwipeTagList';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import {useEffect, useLayoutEffect, useState} from 'react';
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
import CharacterGalleryCreate from '@/app/view/studio/characterDashboard/CharacterGalleryCreate';
import {GalleryCategory} from '@/app/view/studio/characterDashboard/CharacterGalleryData';
import useCustomRouter from '@/utils/useCustomRouter';

const CreateVariationMain: React.FC<Props> = ({}) => {
  const {back} = useCustomRouter();

  //#region Pre Define
  const variationTags = ['Portrait', 'Pose', 'Expressions', 'Video'];

  //#endregion

  //#region State
  const [loading, setLoading] = useState(false);
  const [detailView, setDetailView] = useState(false);
  const [characterList, setCharacterList] = useState<CharacterInfo[]>([]);
  const [filteredList, setFilteredList] = useState<CharacterInfo[]>([]);

  const [selectedIpFilter, setSelectedIpFilter] = useState<CharacterIP>(CharacterIP.Original);

  const [isSelecting, setIsSelecting] = useState(false);
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

  const routerBack = () => {
    back('/main/homefeed');
  };

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

  //#region Hooks

  useEffect(() => {
    // TODO : 필터 작업
    // setFilteredList(characterList.filter(char => char.characterIP === selectedIpFilter));
    setFilteredList(characterList);
  }, [selectedIpFilter, characterList]);

  useEffect(() => {
    console.log(filteredList);
  }, [filteredList]);
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
      <div className={styles.characterListContainer}>
        <div className={styles.filterArea}>{renderFilter(true, detailView)}</div>
        <div className={`${styles.characterGrid} ${detailView ? styles.largeGrid : styles.detailGrid}`}>
          {filteredList.map((character, index) => {
            return renderCharacterItem(character, index);
          })}
        </div>
      </div>
    );
  };

  const renderCharacterItem = (character: CharacterInfo, key: number) => {
    return (
      <div
        key={key}
        className={`${styles.characterItem} ${detailView ? styles.characterLargeItem : styles.characterDetailItem}`}
        onClick={() => setSelectedCharacter(character)}
      >
        <div className={styles.characterImage}>
          <img src={character.mainImageUrl} alt={character.name} />
        </div>
        <div className={styles.characterInfoArea}>
          <div className={styles.characterName}>{character.name}</div>
          <div
            className={`${styles.characterIp} ${
              character.characterIP === CharacterIP.Original ? styles.original : styles.fan
            }`}
          >
            {character.characterIP === CharacterIP.Original ? 'Original' : 'Fan'}
          </div>
        </div>
      </div>
    );
  };

  const renderVariationList = () => {
    return (
      <div className={styles.variationListContainer}>
        <SwipeTagList
          tags={variationTags}
          currentTag={tagStates.variation}
          onTagChange={tag => handleTagClick('variation', tag)}
        />
      </div>
    );
  };

  //#endregion

  return (
    <div className={styles.variationMainContainer}>
      <CreateDrawerHeader
        title={getLocalizedText('TODO : Create Variation')}
        onClose={() => {
          if (selectedCharacter) {
            setSelectedCharacter(null);
          } else {
            routerBack();
          }
        }}
      ></CreateDrawerHeader>

      {selectedCharacter ? (
        <>
          {renderVariationList()}
          <CharacterGalleryCreate
            open={true}
            onClose={() => {}}
            category={
              tagStates.variation === 'Portrait'
                ? GalleryCategory.Portrait
                : tagStates.variation === 'Pose'
                ? GalleryCategory.Pose
                : tagStates.variation === 'Expressions'
                ? GalleryCategory.Expression
                : GalleryCategory.Portrait
            }
            selectedPortraitUrl={selectedCharacter?.mainImageUrl || ''}
            onUploadGalleryImages={() => {}}
          />
        </>
      ) : (
        renderCharacterList()
      )}
    </div>
  );
};

export default CreateVariationMain;
