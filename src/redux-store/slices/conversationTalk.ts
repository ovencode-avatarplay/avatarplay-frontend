// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { ConversationTalkInfoList, ConversationTalkInfo, ConversationPriortyType, ConversationTalkType } from '@/types/apps/dataTypes';

// interface ConversationTalkInfoState {
//     conversationList: ConversationTalkInfoList[];
// }

// const initialState: ConversationTalkInfoState = {
//     conversationList: [],
// };

// export const conversationTalkSlice = createSlice({
//     name: 'conversationTalk',
//     initialState,
//     reducers: {
//         addConversationTalk: (state, action: PayloadAction<{ user: ConversationTalkInfo[], character: ConversationTalkInfo[], conversationTpye: ConversationPriortyType }>) => {
//             const newId = state.conversationList.length;
//             const newConversation: ConversationTalkInfoList = {
//                 id: newId,
//                 conversationTpye: action.payload.conversationTpye,
//                 user: JSON.stringify(action.payload.user),       // 직렬화
//                 character: JSON.stringify(action.payload.character), // 직렬화
//             };
//             state.conversationList.push(newConversation);
//         },

//         addConversationTalkItem: (state, action: PayloadAction<{ conversationIndex: number, type: 'user' | 'character', newTalk: string }>) => {
//             const { conversationIndex, type, newTalk } = action.payload;
//             const conversation = state.conversationList[conversationIndex];

//             if (conversation) {
//                 const newTalkItem: ConversationTalkInfo = {
//                     type: type === 'user' ? ConversationTalkType.Speech : ConversationTalkType.Action,
//                     talk: newTalk,
//                 };

//                 if (type === 'user') {
//                     const userArray = JSON.parse(conversation.user) as ConversationTalkInfo[];  // 역직렬화
//                     userArray.push(newTalkItem);
//                     conversation.user = JSON.stringify(userArray);  // 다시 직렬화하여 저장
//                 } else if (type === 'character') {
//                     const characterArray = JSON.parse(conversation.character) as ConversationTalkInfo[];  // 역직렬화
//                     characterArray.push(newTalkItem);
//                     conversation.character = JSON.stringify(characterArray);  // 다시 직렬화하여 저장
//                 }
//             }
//         },

//         updateConversationTalk: (state, action: PayloadAction<{ conversationIndex: number, itemIndex: number, type: 'user' | 'character', newTalk: string }>) => {
//             const { conversationIndex, itemIndex, type, newTalk } = action.payload;
//             const conversation = state.conversationList[conversationIndex];

//             if (conversation) {
//                 if (type === 'user') {
//                     const userArray = JSON.parse(conversation.user) as ConversationTalkInfo[];  // 역직렬화
//                     if (userArray[itemIndex]) {
//                         userArray[itemIndex].talk = newTalk;
//                         conversation.user = JSON.stringify(userArray);  // 다시 직렬화하여 저장
//                     }
//                 } else if (type === 'character') {
//                     const characterArray = JSON.parse(conversation.character) as ConversationTalkInfo[];  // 역직렬화
//                     if (characterArray[itemIndex]) {
//                         characterArray[itemIndex].talk = newTalk;
//                         conversation.character = JSON.stringify(characterArray);  // 다시 직렬화하여 저장
//                     }
//                 }
//             }
//         },

//         removeConversationItem: (state, action: PayloadAction<{ conversationIndex: number, itemIndex: number, type: 'user' | 'character' }>) => {
//             const { conversationIndex, itemIndex, type } = action.payload;
//             const conversation = state.conversationList[conversationIndex];

//             if (conversation) {
//                 if (type === 'user') {
//                     const userArray = JSON.parse(conversation.user) as ConversationTalkInfo[];  // 역직렬화
//                     userArray.splice(itemIndex, 1);  // 해당 인덱스를 제거
//                     conversation.user = JSON.stringify(userArray);  // 다시 직렬화하여 저장
//                 } else if (type === 'character') {
//                     const characterArray = JSON.parse(conversation.character) as ConversationTalkInfo[];  // 역직렬화
//                     characterArray.splice(itemIndex, 1);  // 해당 인덱스를 제거
//                     conversation.character = JSON.stringify(characterArray);  // 다시 직렬화하여 저장
//                 }
//             }
//         },

//         removeConversationTalk: (state, action: PayloadAction<number>) => {
//             const index = action.payload;
//             state.conversationList.splice(index, 1);
//             state.conversationList.forEach((conversation, idx) => {
//                 conversation.id = idx;
//             });
//         },
//     },
// });

// export const { addConversationTalk, addConversationTalkItem, updateConversationTalk, removeConversationItem, removeConversationTalk } = conversationTalkSlice.actions;
// export const conversationTalkReducer = conversationTalkSlice.reducer;
// export default conversationTalkSlice.reducer;
