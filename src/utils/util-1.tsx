'use client'
import { useRouter } from 'next/navigation';

export const useBackHandler = () => {
    const router = useRouter();

    const handleBackClick = () => {
        // Perform any condition checks here
        console.log('뒤로 가기 버튼 클릭');
        router.back();
    };

    return handleBackClick;
};