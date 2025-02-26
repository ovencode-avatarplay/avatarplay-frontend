import React, {useEffect, useState} from 'react';
import styles from './CreateContentIntroduction.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import CustomButton from '@/components/layout/shared/CustomButton';
import EmptyState from '@/components/search/EmptyState';
import {BoldAltArrowDown, LineDashboard} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {SingleInfo} from './SingleDetail';
import {ContentListInfo, ContentType, GetContentListReq, sendGetContentList} from '@/app/NetWork/ContentNetwork';
import ContentCard from './ContentCard';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';

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
  setCurContentInfo: (info: ContentListInfo) => void;
  isSingle: (value: boolean) => void;
}

const CreateContentIntroduction: React.FC<CreateContentIntroductionProps> = ({
  onNextSeriesDetail,
  onNext,
  setCurContentInfo,
  isSingle,
  onNextSingleDetail,
}) => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.Series);
  const [selectedFilter, setSelectedFilter] = useState<FilterTypes>(FilterTypes.All);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const [contentList, setContentList] = useState<ContentListInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dataProfile = useSelector((state: RootState) => state.profile);
  useEffect(() => {
    const fetchContentList = async () => {
      try {
        setLoading(true);
        setError(null);

        // 요청할 데이터
        const payload: GetContentListReq = {
          profileId: dataProfile.currentProfile ? dataProfile.currentProfile?.profileId : -1, // 예제 Profile ID
          contentType: activeTab, // 예제 Content Type
        };

        // API 호출
        const response = await sendGetContentList(payload);

        // 결과 저장
        if (response.data) setContentList(response.data.contentList);
      } catch (err) {
        setError('콘텐츠 목록을 불러오는 데 실패했습니다.');
        console.error('Error fetching content list:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContentList();
  }, [, activeTab]);

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
              className={`${styles.tab} ${activeTab === ContentType.Series ? styles.active : ''}`}
              onClick={() => {
                setActiveTab(ContentType.Series);
                isSingle(false);
              }}
            >
              Series Contents
            </button>
            <button
              className={`${styles.tab} ${activeTab === ContentType.Single ? styles.active : ''}`}
              onClick={() => {
                setActiveTab(ContentType.Single);
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
              {activeTab == ContentType.Series ? '+ New Series' : '+ New Single'}
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
        {activeTab == ContentType.Series && (
          <>
            {/* 콘텐츠 리스트 */}
            {contentList.length > 0 ? (
              <>
                <button className={styles.filterButton} onClick={() => setFilterDrawerOpen(true)}>
                  {FilterTypes[selectedFilter]}
                  <img src={BoldAltArrowDown.src} className={styles.filtterArrow} />
                </button>

                <div className={styles.cardGroup}>
                  {contentList.map((content, index) => (
                    <ContentCard
                      key={index}
                      content={content}
                      onAddEpisode={() => {
                        setCurContentInfo(content);
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
        {activeTab == ContentType.Single && (
          <>
            {/* 콘텐츠 리스트 */}
            {contentList.length > 0 ? (
              <>
                <button className={styles.filterButton} onClick={() => setFilterDrawerOpen(true)}>
                  {FilterTypes[selectedFilter]}
                  <img src={BoldAltArrowDown.src} className={styles.filtterArrow} />
                </button>

                <div className={styles.cardGroup}>
                  {contentList.map((content, index) => (
                    <ContentCard
                      key={index}
                      content={content}
                      onAddEpisode={() => {
                        setCurContentInfo(content);
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
