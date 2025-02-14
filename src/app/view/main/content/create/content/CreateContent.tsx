import React, {useState} from 'react';
import styles from './CreateContent.module.css';
import CustomArrowHeader from '@/components/layout/shared/CustomArrowHeader';
import CustomButton from '@/components/layout/shared/CustomButton';
import EmptyState from '@/components/search/EmptyState';
import {BoldAltArrowDown, LineDashboard} from '@ui/Icons';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
import {ExpandMore} from '@mui/icons-material';
import classNames from 'classnames';

enum FilterTypes {
  All = 0,
  Edit = 1,
  Create = 2,
  Name = 3,
  Popularity = 4,
}
const CreateContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'series' | 'single'>('series');
  const [selectedFilter, setSelectedFilter] = useState<FilterTypes>(FilterTypes.All);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);

  const publishItems: SelectDrawerItem[] = [
    {
      name: 'All',
      onClick: () => {
        setSelectedFilter(FilterTypes.All);
      },
    },
    {
      name: 'Edit',
      onClick: () => {
        setSelectedFilter(FilterTypes.Edit);
      },
    },
    {
      name: 'Create',
      onClick: () => {
        setSelectedFilter(FilterTypes.Create);
      },
    },
    {
      name: 'Name',
      onClick: () => {
        setSelectedFilter(FilterTypes.Name);
      },
    },
    {
      name: 'Popularity',
      onClick: () => {
        setSelectedFilter(FilterTypes.Popularity);
      },
    },
  ];
  return (
    <>
      {/* 상단 네비게이션 (CustomArrowHeader 적용) */}
      <CustomArrowHeader
        title="Create Series Contents"
        backLink="/"
        children={
          <div className={styles.rightArea}>
            <button className={styles.dashBoard} onClick={() => {}}>
              <img className={styles.dashBoardIcon} src={LineDashboard.src} />
              {/* <div className={styles.redDot}></div> */}
            </button>
            {/* <UserDropdown /> */}
          </div>
        }
      />

      <div className={styles.container}>
        {/* 탭 메뉴 */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'series' ? styles.active : ''}`}
            onClick={() => setActiveTab('series')}
          >
            Series Contents
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'single' ? styles.active : ''}`}
            onClick={() => setActiveTab('single')}
          >
            Single Contents
          </button>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.buttonContainer}>
          <CustomButton size="Large" style={{width: '180px', height: '46px'}} state="Normal" type="Secondary">
            + New Series
          </CustomButton>
          <CustomButton size="Large" style={{width: '180px', height: '46px'}} state="Normal" type="Secondary">
            + Episode
          </CustomButton>
        </div>
        <button className={styles.filterButton} onClick={() => setFilterDrawerOpen(true)}>
          {FilterTypes[selectedFilter]}
          <img src={BoldAltArrowDown.src} className={styles.filtterArrow}></img>
        </button>
        {/* 빈 상태 메시지 */}
        <EmptyState stateText="It will be displayed when a new episode is registered" />
      </div>
      <SelectDrawer
        items={publishItems}
        isOpen={filterDrawerOpen}
        onClose={() => {
          setFilterDrawerOpen(false);
        }}
        selectedIndex={selectedFilter}
      />
    </>
  );
};

export default CreateContent;
