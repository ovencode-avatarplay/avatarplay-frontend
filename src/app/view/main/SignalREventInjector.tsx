'use client';
import {useDispatch} from 'react-redux';
import {setStar} from '@/redux-store/slices/Currency';
import {useSignalR} from '@/hooks/useSignalR';

export function SignalREventInjector({token}: {token: string}) {
  const dispatch = useDispatch();

  useSignalR(token, {
    onSenderGiftStar: payload => {
      console.log('💫 SenderGiftStar 수신:', payload); // ✅ 디버깅 로그
      const amount = typeof payload === 'number' ? payload : payload?.amountStar ?? payload?.amount;
      if (typeof amount === 'number') {
        dispatch(setStar(amount));
      }
    },
    onReceiverGiftStar: payload => {
      console.log('📦 ReceiverGiftStar 수신:', payload); // ✅ 디버깅 로그
      const amount = typeof payload === 'number' ? payload : payload?.amountStar ?? payload?.amount;
      if (typeof amount === 'number') {
        dispatch(setStar(amount));
      }
    },
  });

  return null;
}
