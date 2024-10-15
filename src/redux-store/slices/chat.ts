// Third-party Imports
import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

// Type Imports
import type {ChatType, ContactType, StatusType, UserChatType} from '@/types/apps/chatTypes';

// Data Imports
// import { db } from '@/fake-db/apps/chat'

import {db} from '@/data/fake-db/apps/chat';

// import characterData from '@/views/apps/chat/CharacterPopup'

export const chatSlice = createSlice({
  name: 'chat',
  initialState: db,
  reducers: {
    getActiveUserData: (state, action: PayloadAction<number>) => {
      const activeUser = state.contacts.find(user => user.id === action.payload);

      //console.log( '액티브유저', activeUser)
      const chat = state.chats.find(chat => chat.characterId === action.payload);

      if (chat && chat.unseenMsgs > 0) {
        chat.unseenMsgs = 0;
      }

      if (activeUser) {
        state.activeUser = activeUser;
      } else state.activeUser = undefined;
    },

    addNewChat: (state, action) => {
      const {id} = action.payload;

      state.contacts.find(contact => {
        if (contact.id === id && !state.chats.find(chat => chat.characterId === contact.id)) {
          state.chats.unshift({
            id: state.chats.length + 1,
            characterId: contact.id,
            unseenMsgs: 0,
            chat: [],
          });
        }
      });
    },

    addNewCharacter: (state, action) => {
      const {character} = action.payload;

      //console.log("character : ", character);
      if (state.chats.some(v => v.characterId == character.id)) return;

      state.contacts.unshift({
        id: character.id,
        fullName: character.name,
        role: '아무거나',
        about: '아무거나',
        avatar: '/images/avatars/2.png',
        avatarColor: 'primary',
        status: 'busy',

        first_mes: character.introduction,
        char_persona: character.characterDescription,
        world_scenario: character.world_scenario,
        secrets: character.secret,
      });

      state.chats.unshift({
        id: state.chats.length + 1,
        characterId: character.id,
        unseenMsgs: 0,
        chat: [],
      });
    },

    deleteCharacter: (state, action: PayloadAction<number>) => {
      const deleteID = action.payload;
      console.log('deleteCharacter', deleteID);
      // 상태에서 해당 id를 제외한 새로운 배열로 상태를 업데이트
      state.chats = state.chats.filter(item => item.characterId !== deleteID);
    },

    setUserStatus: (state, action: PayloadAction<{status: StatusType}>) => {
      state.profileUser = {
        ...state.profileUser,
        status: action.payload.status,
      };
    },

    sendMsg: (state, action: PayloadAction<{msg: string}>) => {
      const {msg} = action.payload;
      const existingChat = state.chats.find(chat => chat.characterId === state.activeUser?.id);

      if (existingChat) {
        existingChat.chat.push({
          message: msg,
          time: new Date(),
          senderId: state.profileUser.id,
          msgStatus: {
            isSent: true,
            isDelivered: false,
            isSeen: false,
          },
        });

        // Remove the chat from its current position
        state.chats = state.chats.filter(chat => chat.characterId !== state.activeUser?.id);

        // Add the chat back to the beginning of the array
        state.chats.unshift(existingChat);
      }
    },

    createMsg: (state, action: PayloadAction<{id: number; msg: string}>) => {
      const {id, msg} = action.payload;

      console.log('아이디 ', id, ' 메시지 ', msg);

      //console.log( id + msg);
      const existingChat = state.chats.find(chat => chat.characterId === state.activeUser?.id);

      if (existingChat) {
        existingChat.chat.push({
          message: msg,
          time: new Date(),
          senderId: id,
          msgStatus: {
            isSent: true,
            isDelivered: false,
            isSeen: false,
          },
        });

        // Remove the chat from its current position
        state.chats = state.chats.filter(chat => chat.characterId !== state.activeUser?.id);

        // Add the chat back to the beginning of the array
        state.chats.unshift(existingChat);
      }
    },

    updateMsg: (state, action: PayloadAction<{id: number; msg: string; idChat: number}>) => {
      const {msg, idChat} = action.payload;

      //console.log( id + msg);
      const existingChat = state.chats.find(chat => chat.characterId === state.activeUser?.id);

      if (!existingChat || idChat >= existingChat?.chat?.length || 0) {
        return;
      }

      const chat = existingChat.chat[idChat];

      chat.message = msg;
      chat.time = new Date();
    },
    updateChatList: (state, action: PayloadAction<{characterId: number; chatList: UserChatType[]}>) => {
      const {characterId, chatList} = action.payload;
      const indexExistingChat = state.chats.findIndex(chat => chat.characterId === characterId);

      state.chats[indexExistingChat].chat = chatList;
    },

    clearChatList: state => {
      state.chats = [];
    },

    updateUserInfo: (
      state,
      action: PayloadAction<{
        userId: number;
        newFullName: string;
        newRole?: string;
        characterDescription?: string;
        worldScenario?: string;
        introduction?: string;
        secret?: string;
      }>,
    ) => {
      // 주어진 ID를 가진 사용자의 인덱스를 찾습니다.
      const {userId, newFullName, newRole, characterDescription, worldScenario, introduction, secret} = action.payload;

      console.log('채팅 타입 데이터 수정됨 ');
      const userIndex = state.contacts.findIndex(contact => contact.id === userId);

      console.log(userIndex, newFullName, newRole);
      console.log(state.contacts[userIndex]);

      // 사용자가 존재하는지 확인합니다.
      if (userIndex !== -1) {
        // 사용자의 이름과 역할을 업데이트합니다.
        try {
          state.contacts[userIndex].fullName = newFullName;
          state.contacts[userIndex].role = newRole || state.contacts[userIndex].role;
          state.profileUser.characterDescription = characterDescription || state.profileUser.characterDescription;
          state.profileUser.worldScenario = worldScenario || state.profileUser.worldScenario;
          state.profileUser.introduction = introduction || state.profileUser.introduction;
          state.profileUser.secret = secret || state.profileUser.secret;
        } catch (e) {
          console.error('error : ', e);
        }

        console.log(`사용자 ${userId}의 정보가 성공적으로 업데이트되었습니다.`);
      } else {
        console.log(`ID가 ${userId}인 사용자를 찾을 수 없습니다.`);
      }
    },

    UpdateMyProfile: (state, action) => {
      const {character} = action.payload.id;

      console.log('MyProfile : ', action.payload.id);

      // state.profileUser =
      // {
      //   ...state.profileUser,
      // }
      state.profileUser.id = action.payload.id;
    },
  },
});

export const {
  createMsg,
  getActiveUserData,
  addNewChat,
  addNewCharacter,
  setUserStatus,
  sendMsg,
  updateMsg,
  updateUserInfo,
  UpdateMyProfile,
  updateChatList,
  deleteCharacter,
  clearChatList,
} = chatSlice.actions;

export default chatSlice.reducer;
