import React from 'react';
import styles from './Workroom.module.css';
import {BoldAltArrowDown, BoldViewGallery, LineList} from '@ui/Icons';
import DropDownMenu, {DropDownMenuItem} from '@/components/create/DropDownMenu';
import getLocalizedText from '@/utils/getLocalizedText';

interface WorkroomFilterProps {
  detailViewButton: boolean;
  detailView: boolean;
  setDetailView: React.Dispatch<React.SetStateAction<boolean>>;
  sortDropDownOpen: boolean;
  setSortDropDownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedSort: number;
  dropDownMenuItems: DropDownMenuItem[];
}

const WorkroomFilter: React.FC<WorkroomFilterProps> = ({
  detailViewButton,
  detailView,
  setDetailView,
  sortDropDownOpen,
  setSortDropDownOpen,
  selectedSort,
  dropDownMenuItems,
}) => {
  return (
    <>
      <div className={styles.filterLeft}>
        {detailViewButton && (
          <button className={styles.detailViewButton} onClick={() => setDetailView(prev => !prev)}>
            <img src={!detailView ? BoldViewGallery.src : LineList.src} alt="detailView" />
          </button>
        )}
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
            selectedIndex={selectedSort}
          />
        )}
      </div>
    </>
  );
};

export default WorkroomFilter;
