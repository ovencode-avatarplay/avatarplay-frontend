// import React, {useState} from 'react';
// import {Box, IconButton, Typography} from '@mui/material';
// import PrevIcon from '@mui/icons-material/NavigateBefore';
// import NextIcon from '@mui/icons-material/NavigateNext';
// import {useSelector} from 'react-redux';
// import {RootState} from '@/redux-store/ReduxStore';
// import {RegenerateMessageGroup} from '@/app/NetWork/ChatNetwork';

// TODO : ModifyQuestionSlice 에서 메시지 재생성 그룹을 가져와서 세팅함.

// const ChatRegenerateGroupNav: React.FC = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const handlePrev = (event: React.MouseEvent<HTMLButtonElement>) => {
//     event.stopPropagation();
//     setCurrentIndex(prev => (prev > 0 ? prev - 1 : prev));
//   };
//   const regenerateGroups: RegenerateMessageGroup = useSelector(
//     (state: RootState) => state.modifyQuestion.regeneratedMessageGroup,
//   );

//   const handleNext = (event: React.MouseEvent<HTMLButtonElement>) => {
//     event.stopPropagation();
//     setCurrentIndex(prev => (prev < regenerateGroups.maxMessageIdx - 1 ? prev + 1 : prev));
//   };

//   const handleSetChatArea = () => {
//     // TODO : 채팅 영역을 기존에 선택된 id에 해당하는 messsage를 지우고, 새로 선택된 id에 해당하는 message를 뿌리도록 prevMessage 또는 parsedMessage에 세팅해주고 새로 렌더링
//   };

//   return (
//     <Box justifySelf="end">
//       {regenerateGroups.maxMessageIdx > 1 && (
//         <Box display="flex" alignItems="center">
//           {/* 이전 버튼 */}
//           <IconButton onClick={handlePrev} disabled={currentIndex === 0}>
//             <PrevIcon />
//           </IconButton>

//           {/* 인덱스 및 항목 개수 표시 */}
//           <Typography variant="body2">{`${currentIndex + 1} / ${regenerateGroups.maxMessageIdx}`}</Typography>

//           {/* 다음 버튼 */}
//           <IconButton onClick={handleNext} disabled={currentIndex === regenerateGroups.maxMessageIdx - 1}>
//             <NextIcon />
//           </IconButton>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default ChatRegenerateGroupNav;
