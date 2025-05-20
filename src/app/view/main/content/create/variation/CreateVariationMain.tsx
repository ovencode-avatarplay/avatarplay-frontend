import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import styles from './CreateVariationMain.module.css';
import SwipeTagList from '@/components/layout/shared/SwipeTagList';
import {useEffect, useLayoutEffect, useState} from 'react';
import {
  CharacterIP,
  CreateVariationSort,
  sendGetCreateVariationList,
  CreateVariationInfo,
} from '@/app/NetWork/CharacterNetwork';
import getLocalizedText from '@/utils/getLocalizedText';
import {BoldAltArrowDown, BoldViewGallery, LineList} from '@ui/Icons';
import CharacterGalleryCreate from '@/app/view/studio/characterDashboard/CharacterGalleryCreate';
import {GalleryCategory} from '@/app/view/studio/characterDashboard/CharacterGalleryData';
import useCustomRouter from '@/utils/useCustomRouter';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateVariationMain: React.FC<Props> = ({open, onClose}) => {
  const {back} = useCustomRouter();

  //#region Pre Define
  const variationTags = ['Portrait', 'Pose', 'Expressions', 'Video'];

  //#endregion

  //#region State
  const [loading, setLoading] = useState(false);
  const [detailView, setDetailView] = useState(false);

  const [createVariationList, setCreateVariationList] = useState<CreateVariationInfo[]>([]);

  const [selectedIpFilter, setSelectedIpFilter] = useState<CharacterIP>(CharacterIP.Original);
  const [selectedSortFilter, setSelectedSortFilter] = useState<CreateVariationSort>(CreateVariationSort.Newest);

  const [selectedVariation, setSelectedVariation] = useState<CreateVariationInfo | null>(null);
  const [tagStates, setTagStates] = useState({
    variation: 'Portrait',
  });

  const [sortDropDownOpen, setSortDropDownOpen] = useState(false);

  //#endregion

  useLayoutEffect(() => {
    Init();
  }, []);

  function Init() {
    getCreateVariationList();
  }

  //#region function

  const dropDownMenuItems: DropDownMenuItem[] = [
    {
      name: getLocalizedText('common_sort_newest'),
      onClick: () => {
        setSortDropDownOpen(false);
        setSelectedSortFilter(CreateVariationSort.Newest);
        getCreateVariationList();
      },
    },
    {
      name: getLocalizedText('common_sort_Name'),
      onClick: () => {
        setSortDropDownOpen(false);
        setSelectedSortFilter(CreateVariationSort.Name);
        getCreateVariationList();
      },
    },
  ];

  const routerBack = () => {
    back('/main/homefeed');
  };

  // 현재 유저가 가진 캐릭터를 모두 가져옴

  const getCreateVariationList = async () => {
    setLoading(true);

    try {
      const response = await sendGetCreateVariationList({
        characterIp: selectedIpFilter,
        sort: selectedSortFilter,
      });

      if (response.data) {
        const createVariationList: CreateVariationInfo[] = response.data?.characterVariationInfoList;
        setCreateVariationList(createVariationList);
      } else {
        throw new Error(`No createVariationList in response`);
      }
    } catch (error) {
      console.error('Error fetching create variation list :', error);
    } finally {
      setLoading(false);
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
    getCreateVariationList();
  }, [selectedIpFilter, selectedSortFilter]);

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
        <div className={styles.filterRight} onClick={() => setSortDropDownOpen(true)}>
          <div className={styles.filterText}>{getLocalizedText('TODO : Filter')}</div>
          <img src={BoldAltArrowDown.src} alt="filter" />
          {sortDropDownOpen && (
            <DropDownMenu
              items={dropDownMenuItems}
              onClose={() => setSortDropDownOpen(false)}
              className={styles.sortDropDown}
              useSelected={true}
              selectedIndex={selectedSortFilter}
            />
          )}
        </div>
      </>
    );
  };

  const renderCharacterList = () => {
    return (
      <div className={styles.characterListContainer}>
        <div className={styles.filterArea}>{renderFilter(true, detailView)}</div>
        <div className={`${styles.characterGrid} ${detailView ? styles.largeGrid : styles.detailGrid}`}>
          {createVariationList.map((variation, index) => {
            return renderVariationItem(variation, index);
          })}
        </div>
      </div>
    );
  };

  const renderVariationItem = (variation: CreateVariationInfo, key: number) => {
    return (
      <div
        key={key}
        className={`${styles.characterItem} ${detailView ? styles.characterLargeItem : styles.characterDetailItem}`}
        onClick={() => setSelectedVariation(variation)}
      >
        <div className={styles.characterImage}>
          <img src={variation.mainImageUrl} alt={variation.name} />
        </div>
        <div className={styles.characterInfoArea}>
          <div className={styles.characterName}>{variation.name}</div>
          <div
            className={`${styles.characterIp} ${
              variation.characterIP === CharacterIP.Original ? styles.original : styles.fan
            }`}
          >
            {variation.characterIP === CharacterIP.Original ? 'Original' : 'Fan'}
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
          if (selectedVariation) {
            setSelectedVariation(null);
          } else {
            routerBack();
          }
        }}
      ></CreateDrawerHeader>

      {selectedVariation ? (
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
            selectedPortraitUrl={selectedVariation?.mainImageUrl || ''}
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
