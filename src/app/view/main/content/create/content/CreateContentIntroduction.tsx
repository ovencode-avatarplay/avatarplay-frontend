import React, {useState} from 'react';
import styles from './CreateContentIntroduction.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import CustomButton from '@/components/layout/shared/CustomButton';
import EmptyState from '@/components/search/EmptyState';
import {BoldAltArrowDown, LineDashboard} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import ContentCard, {ContentInfo, mockContentInfo} from './ContentCard';
import {mockSeries, SeriesInfo} from './SeriesDetail';
import {mockSingle, SingleInfo} from './SingleDetail';

enum FilterTypes {
  All = 0,
  Edit = 1,
  Create = 2,
  Name = 3,
  Popularity = 4,
}

interface CreateContentIntroductionProps {
  onNext: () => void;
  onNextSeriesDetail: () => void;
  onNextSingleDetail: () => void;
  setCurContentInfo: (info: SeriesInfo) => void;
  setCurSingleInfo: (info: SingleInfo) => void;
  isSingle: (value: boolean) => void;
}

const CreateContentIntroduction: React.FC<CreateContentIntroductionProps> = ({
  onNextSeriesDetail,
  onNext,
  setCurContentInfo,
  isSingle,
  setCurSingleInfo,
  onNextSingleDetail,
}) => {
  const [activeTab, setActiveTab] = useState<'series' | 'single'>('series');
  const [selectedFilter, setSelectedFilter] = useState<FilterTypes>(FilterTypes.All);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const publishItems: SelectDrawerItem[] = [
    {name: 'All', onClick: () => setSelectedFilter(FilterTypes.All)},
    {name: 'Edit', onClick: () => setSelectedFilter(FilterTypes.Edit)},
    {name: 'Create', onClick: () => setSelectedFilter(FilterTypes.Create)},
    {name: 'Name', onClick: () => setSelectedFilter(FilterTypes.Name)},
    {name: 'Popularity', onClick: () => setSelectedFilter(FilterTypes.Popularity)},
  ];

  const isActive = false;
  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        {/* 상단 네비게이션 */}
        <CustomArrowHeader
          title="Create Series Contents"
          backLink="/"
          children={
            <div className={styles.rightArea}>
              <button className={styles.dashBoard} onClick={() => {}}>
                <img className={styles.dashBoardIcon} src={LineDashboard.src} />
              </button>
            </div>
          }
        />

        <div className={styles.container}>
          {/* 탭 메뉴 */}
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'series' ? styles.active : ''}`}
              onClick={() => {
                setActiveTab('series');
                isSingle(false);
              }}
            >
              Series Contents
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'single' ? styles.active : ''}`}
              onClick={() => {
                setActiveTab('single');
                isSingle(true);
              }}
            >
              Single Contents
            </button>
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonContainer}>
            <CustomButton
              size="Large"
              style={{width: '100%', height: '46px'}}
              state="Normal"
              type="Secondary"
              onClick={onNext}
            >
              {activeTab == 'series' ? '+ New Series' : '+ New Single'}
            </CustomButton>
          </div>
          {/* {isActive ||
            (mockContentInfo.length > 0 && (
              <button className={styles.filterButton} onClick={() => setFilterDrawerOpen(true)}>
                {FilterTypes[selectedFilter]}
                <img src={BoldAltArrowDown.src} className={styles.filtterArrow} />
              </button>
            ))} */}
        </div>
      </div>
      <div className={styles.container}>
        {activeTab == 'series' && (
          <>
            {/* 콘텐츠 리스트 */}
            {mockContentInfo.length > 0 ? (
              <>
                <button className={styles.filterButton} onClick={() => setFilterDrawerOpen(true)}>
                  {FilterTypes[selectedFilter]}
                  <img src={BoldAltArrowDown.src} className={styles.filtterArrow} />
                </button>

                <div className={styles.cardGroup}>
                  {mockContentInfo.map((content, index) => (
                    <ContentCard
                      key={index}
                      content={content}
                      onAddEpisode={() => {
                        setCurContentInfo(mockSeries);
                        onNextSeriesDetail();
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState stateText="It will be displayed when a new episode is registered" />
            )}
          </>
        )}
        {activeTab == 'single' && (
          <>
            {/* 콘텐츠 리스트 */}
            {mockContentInfo.length > 0 ? (
              <>
                <button className={styles.filterButton} onClick={() => setFilterDrawerOpen(true)}>
                  {FilterTypes[selectedFilter]}
                  <img src={BoldAltArrowDown.src} className={styles.filtterArrow} />
                </button>

                <div className={styles.cardGroup}>
                  {mockContentInfo.map((content, index) => (
                    <ContentCard
                      key={index}
                      content={content}
                      onAddEpisode={() => {
                        setCurSingleInfo(mockSingle);
                        onNextSingleDetail();
                      }}
                    />
                  ))}
                </div>
              </>
            ) : (
              <EmptyState stateText="It will be displayed when a new episode is registered" />
            )}
          </>
        )}
      </div>

      {/* 필터 선택 드로어 */}
      <SelectDrawer
        name="Filter"
        items={publishItems}
        isOpen={filterDrawerOpen}
        onClose={() => setFilterDrawerOpen(false)}
        selectedIndex={selectedFilter}
      />
    </div>
  );
};

export default CreateContentIntroduction;
