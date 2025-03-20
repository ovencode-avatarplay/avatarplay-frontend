import React, {useEffect, useState} from 'react';
import styles from './CreateContentIntroduction.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import CustomButton from '@/components/layout/shared/CustomButton';
import EmptyState from '@/components/search/EmptyState';
import {BoldAltArrowDown, LineDashboard} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {SingleInfo} from './SingleDetail';
import {
  ContentCategoryType,
  ContentListInfo,
  ContentType,
  GetContentListReq,
  sendDeleteContent,
  sendGetContentList,
  VisibilityType,
} from '@/app/NetWork/ContentNetwork';
import ContentCard from './ContentCard';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import {pushLocalizedRoute} from '@/utils/UrlMove';
import {useRouter} from 'next/navigation';
import CustomPopup from '@/components/layout/shared/CustomPopup';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';

enum FilterTypes {
  All = 0,
  Public = 1,
  Private = 2,
  Unlisted = 3,
}

interface CreateContentIntroductionProps {}
export const getFilterKey = (key: number): string => {
  switch (key) {
    case FilterTypes.All:
      return getLocalizedText('common_filter_all');
    case FilterTypes.Public:
      return getLocalizedText('common_filter_public');
    case FilterTypes.Private:
      return getLocalizedText('common_filter_private');
    case FilterTypes.Unlisted:
      return getLocalizedText('common_filter_unlisted');
    default:
      return '';
  }
};
const CreateContentIntroduction: React.FC<CreateContentIntroductionProps> = () => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.Series);
  const [selectedFilter, setSelectedFilter] = useState<FilterTypes>(FilterTypes.All);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const router = useRouter();

  const [contentList, setContentList] = useState<ContentListInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const dataProfile = useSelector((state: RootState) => state.profile);
  const [isDeletePopup, setIsDeletePopup] = useState<boolean>(false);
  const [isDeleteNum, setIsDeleteNum] = useState<number>(0);
  const deleteContente = (id: number) => {
    const handleDeleteContent = async (contentId: number) => {
      try {
        const response = await sendDeleteContent({contentId});

        if (response.resultCode === 0) {
          console.log('✅ 콘텐츠 삭제 성공:', response.resultMessage);
        } else {
          console.error('❌ 콘텐츠 삭제 실패:', response.resultMessage);
        }
        fetchContentList();
      } catch (error) {
        console.error('🚨 API 호출 중 오류 발생:', error);
      }
    };

    // 사용 예제
    handleDeleteContent(id); // 콘텐츠 ID 123 삭제 시도
  };

  const handleGo = (id: string) => {
    pushLocalizedRoute(`/create/content/${activeTab === ContentType.Series ? 'series' : 'single'}/${id}`, router);
  };

  const editContente = (id: string, type: ContentType) => {
    if (type == ContentType.Series) pushLocalizedRoute(`/update/content/series/${id}`, router);
    else if (type == ContentType.Single) pushLocalizedRoute(`/update/content/single/${id}`, router);
  };

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
      console.log('response.data', response.data?.contentList);

      // 결과 저장
      if (response.data) setContentList(response.data.contentList);
    } catch (err) {
      setError('콘텐츠 목록을 불러오는 데 실패했습니다.');
      console.error('Error fetching content list:', err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchContentList();
  }, [activeTab]);

  const publishItems: SelectDrawerItem[] = [
    {name: 'All', onClick: () => setSelectedFilter(FilterTypes.All)},
    {name: 'Public', onClick: () => setSelectedFilter(FilterTypes.Public)},
    {name: 'Private', onClick: () => setSelectedFilter(FilterTypes.Private)},
    {name: 'Unlisted', onClick: () => setSelectedFilter(FilterTypes.Unlisted)},
  ];

  const isActive = false;
  return (
    <div className={styles.parent}>
      <div className={styles.header}>
        {/* 상단 네비게이션 */}
        <CustomArrowHeader
          title={getLocalizedText('createcontent001_title_001')}
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
              }}
            >
              {getLocalizedText('createcontent001_label_002')}{' '}
            </button>
            <button
              className={`${styles.tab} ${activeTab === ContentType.Single ? styles.active : ''}`}
              onClick={() => {
                setActiveTab(ContentType.Single);
              }}
            >
              {getLocalizedText('createcontent001_label_003')}{' '}
            </button>
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonContainer}>
            <CustomButton
              size="Large"
              style={{width: '100%', height: '46px'}}
              state="Normal"
              type="Secondary"
              onClick={() => {
                if (activeTab == ContentType.Series) pushLocalizedRoute(`/create/content/condition/series`, router);
                else pushLocalizedRoute(`/create/content/condition/single`, router);
              }}
            >
              {activeTab == ContentType.Series
                ? '+ ' + getLocalizedText('createcontent001_button_004')
                : '+ New Single'}
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
                  {formatText(getLocalizedText('createcontent001_label_005'), [contentList.length.toString()])}{' '}
                  <span>
                    {getFilterKey(selectedFilter)}
                    <img src={BoldAltArrowDown.src} className={styles.filtterArrow} />
                  </span>
                </button>

                <div className={styles.cardGroup}>
                  {contentList
                    .filter(content => {
                      switch (selectedFilter) {
                        case FilterTypes.All:
                          return true;
                        case FilterTypes.Public:
                          return content.visibility === VisibilityType.Public;
                        case FilterTypes.Private:
                          return content.visibility === VisibilityType.Private;
                        case FilterTypes.Unlisted:
                          return content.visibility === VisibilityType.Unlisted;
                        default:
                          return true;
                      }
                    })
                    .map((content, index) => (
                      <ContentCard
                        key={index}
                        content={content}
                        onAddEpisode={() => {
                          handleGo(content.urlLinkKey);
                        }}
                        onDelete={() => {
                          setIsDeleteNum(content.id);
                          setIsDeletePopup(true);
                        }}
                        onEdit={() => {
                          editContente(content.urlLinkKey, activeTab);
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
                  {contentList
                    .filter(
                      content => selectedFilter === FilterTypes.All || content.visibility === VisibilityType.Public,
                    )
                    .map((content, index) => (
                      <ContentCard
                        key={index}
                        content={content}
                        onAddEpisode={() => {
                          pushLocalizedRoute(`/create/content/single/${content.urlLinkKey}`, router);
                        }}
                        onDelete={() => {
                          deleteContente(content.id);
                        }}
                        onEdit={() => {
                          editContente(content.urlLinkKey, activeTab);
                        }}
                        isSingle={true}
                      />
                    ))}
                </div>
              </>
            ) : (
              <EmptyState stateText={getLocalizedText('createcontent001_desc_008')} />
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
      {isDeletePopup && (
        <CustomPopup
          type="alert"
          title={getLocalizedText('common_alert_087')}
          description={getLocalizedText('common_alert_088')}
          buttons={[
            {
              label: getLocalizedText('common_button_cancel'),
              onClick: () => setIsDeletePopup(false),
              isPrimary: false,
            },
            {
              label: getLocalizedText('common_button_confirm'),
              onClick: () => {
                deleteContente(isDeleteNum);
                setIsDeletePopup(false);
              },
              isPrimary: true,
            },
          ]}
        />
      )}
    </div>
  );
};

export default CreateContentIntroduction;
