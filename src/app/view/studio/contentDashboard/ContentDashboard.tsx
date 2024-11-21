'use client';

import React, {useState} from 'react';
import StudioTopMenu from '../StudioDashboardMenu'; // 상단 메뉴 컴포넌트
import ContentList from './ContentList';
import ContentDashboardFooter from '.././StudioDashboardFooter'; // 하단 버튼 컴포넌트
import styles from './ContentDashboard.module.css';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

import EditIcon from '@mui/icons-material/Edit';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';
import StudioFilter from '../StudioFilter';

const ContentDashboard: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('filter1');

  const handleEdit = () => {
    console.log('Edit button clicked');
  };

  const handlePreview = () => {
    console.log('Gallery button clicked');
  };

  const handleDelete = () => {
    console.log('Delete button clicked');
  };

  const handleFilterChange = (value: string) => {
    console.log('Selected filter:', value);
    setSelectedFilter(value);
  };

  const handleCreateClick = () => {
    console.log('Create button clicked');
  };

  const filters = [
    {value: 'filter1', label: 'Filter 1'},
    {value: 'filter2', label: 'Filter 2'},
    {value: 'filter3', label: 'Filter 3'},
  ];
  const buttons = [
    {icon: <EditIcon />, text: 'Edit', onClick: handleEdit},
    {icon: <PreviewIcon />, text: 'Preview', onClick: handlePreview},
    {icon: <DeleteIcon />, text: 'Delete', onClick: handleDelete},
  ];

  return (
    <div className={styles.dashboard}>
      <StudioTopMenu icon={<AutoStoriesIcon />} text="Story" />
      <StudioFilter
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        onCreateClick={handleCreateClick}
      />
      <ContentList />
      <ContentDashboardFooter buttons={buttons} />
    </div>
  );
};

export default ContentDashboard;
