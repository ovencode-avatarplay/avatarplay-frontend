import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConversationTalkInfoList, ConversationTalkInfo, ConversationPriortyType, ConversationTalkType } from '@/types/apps/dataTypes';

interface ConversationTalkInfoState {
    conversationList: ConversationTalkInfoList[];
}

const initialState: ConversationTalkInfoState = {
    conversationList: [],
};

export const conversationTalkSlice = createSlice({
    name: 'conversationTalk',
    initialState,
    reducers: {
        addConversationTalk: (state, action: PayloadAction<{ user: ConversationTalkInfo[], character: ConversationTalkInfo[], conversationTpye: ConversationPriortyType }>) => {
            const newId = state.conversationList.length;
            const newConversation: ConversationTalkInfoList = {
                id: newId,
                conversationTpye: action.payload.conversationTpye,
                user: action.payload.user,
                character: action.payload.character,
            };
            state.conversationList.push(newConversation);
        },

        addConversationTalkItem: (state, action: PayloadAction<{ conversationIndex: number, type: 'user' | 'character', newTalk: string }>) => {
            const { conversationIndex, type, newTalk } = action.payload;
            const conversation = state.conversationList[conversationIndex];

            if (conversation) {
                const newTalkItem: ConversationTalkInfo = {
                    type: type === 'user' ? ConversationTalkType.Speech : ConversationTalkType.Action,
                    talk: newTalk,
                };

                if (type === 'user') {
                    conversation.user.push(newTalkItem);
                } else if (type === 'character') {
                    conversation.character.push(newTalkItem);
                }
            }
        },

        updateConversationTalk: (state, action: PayloadAction<{ conversationIndex: number, itemIndex: number, type: 'user' | 'character', newTalk: string }>) => {
            const { conversationIndex, itemIndex, type, newTalk } = action.payload;
            const conversation = state.conversationList[conversationIndex];
            if (conversation) {
                if (type === 'user' && conversation.user[itemIndex]) {
                    conversation.user[itemIndex].talk = newTalk;
                } else if (type === 'character' && conversation.character[itemIndex]) {
                    conversation.character[itemIndex].talk = newTalk;
                }
            }
        },

        removeConversationItem: (state, action: PayloadAction<{ conversationIndex: number, itemIndex: number, type: 'user' | 'character' }>) => {
            const { conversationIndex, itemIndex, type } = action.payload;
            const conversation = state.conversationList[conversationIndex];
            if (conversation) {
                if (type === 'user') {
                    conversation.user.splice(itemIndex, 1);
                } else if (type === 'character') {
                    conversation.character.splice(itemIndex, 1);
                }
            }
        },

        removeConversationTalk: (state, action: PayloadAction<number>) => {
            const index = action.payload;
            state.conversationList.splice(index, 1);
            state.conversationList.forEach((conversation, idx) => {
                conversation.id = idx;
            });
        },
    },
});

export const { addConversationTalk, addConversationTalkItem, updateConversationTalk, removeConversationItem, removeConversationTalk } = conversationTalkSlice.actions;
export const conversationTalkReducer = conversationTalkSlice.reducer;
export default conversationTalkSlice.reducer;
