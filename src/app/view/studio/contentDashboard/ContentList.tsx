import {useSelector} from 'react-redux';
import ContentDashboardList from '../../main/content/create/content-main/content-dashboard/ContentDashboardList';
import {RootState} from '@/redux-store/ReduxStore';
import {useLayoutEffect, useState} from 'react';
import {
  GetContentsByUserIdReq,
  GetTotalContentByIdReq,
  sendContentByIdGetTotal,
  sendContentByUserIdGet,
} from '@/app/NetWork/ContentNetwork';
import {ContentInfo} from '@/redux-store/slices/ContentInfo';
import {useDispatch} from 'react-redux';
import {Box} from '@mui/material';
import styles from './ContentList.module.css';
import {ContentDashboardItem, setContentDashboardList} from '@/redux-store/slices/MyContentDashboard';

const ContentList: React.FC = () => {
  const contentInfo = useSelector((state: RootState) => state.myContents.contentDashBoardList ?? []);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // 렌더링 전에 Init 실행
  useLayoutEffect(() => {
    Init();
  }, []);

  function Init() {
    getContentsByUserId();
  }
  // 현재 유저가 가진 컨텐츠를 모두 가져옴 (DashBoard 에서 사용하기 위함)
  const getContentsByUserId = async () => {
    setLoading(true);

    try {
      const req: GetContentsByUserIdReq = {};
      const response = await sendContentByUserIdGet(req);

      if (response?.data) {
        const contentData: ContentDashboardItem[] = response.data.contentDashBoardList;
        dispatch(setContentDashboardList(contentData));
      } else {
        throw new Error(`No contentInfo in response for ID: `);
      }
    } catch (error) {
      console.error('Error fetching content by user ID:', error);
    } finally {
      setLoading(false);
    }
  };

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
    <>
      <Box className={styles.drawerContainer}>
        <ContentDashboardList
          contentInfo={contentInfo}
          selectedIndex={selectedIndex}
          onItemSelect={GetContentByContentId}
        />
      </Box>
    </>
  );
};
export default ContentList;
