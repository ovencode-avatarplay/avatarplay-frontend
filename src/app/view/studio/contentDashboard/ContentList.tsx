import {useSelector} from 'react-redux';
import ContentDashboardList from '../../main/content/create/content-main/content-dashboard/ContentDashboardList';
import {RootState} from '@/redux-store/ReduxStore';
import {useState} from 'react';
import {GetTotalContentByIdReq, sendContentByIdGetTotal} from '@/app/NetWork/ContentNetwork';
import {ContentInfo, setEditingContentInfo} from '@/redux-store/slices/ContentInfo';
import {useDispatch} from 'react-redux';
import {Box, Button, MenuItem, Select} from '@mui/material';
import styles from './ContentList.module.css';

const ContentList: React.FC = () => {
  const contentInfo = useSelector((state: RootState) => state.myContents.contentDashBoardList ?? []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // DashBoard 에서 선택한 컨텐츠를 Id로 가져옴 (CreateContent사이클 (Chapter, Episode 편집) 에서 사용하기 위함)
  const GetContentByContentId = async (contentId: number) => {
    setLoading(true);

    try {
      const req: GetTotalContentByIdReq = {contentId: contentId};
      const response = await sendContentByIdGetTotal(req);

      if (response?.data) {
        const contentData: ContentInfo = response.data.contentInfo;
      } else {
        throw new Error(`No contentInfo in response for ID: ${contentId}`);
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error; // 에러를 상위로 전달
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.drawerContainer}>
      {/* Filter section */}
      <Box className={styles.filterContainer}>
        <Select className={styles.filterSelect}>
          <MenuItem value="filter1">Filter 1</MenuItem>
          <MenuItem value="filter2">Filter 2</MenuItem>
          <MenuItem value="filter3">Filter 3</MenuItem>
        </Select>
        <Button variant="contained" className={styles.createButton} onClick={() => {}}>
          Create
        </Button>
      </Box>

      <ContentDashboardList
        contentInfo={contentInfo}
        selectedIndex={selectedIndex}
        onItemSelect={GetContentByContentId}
      />
    </Box>
  );
};
export default ContentList;
