// app/error.tsx
'use client';

import {useEffect} from 'react';
import {useRouter} from 'next/navigation';
import styles from './error.module.scss';

interface GlobalErrorProps {
  error: Error;
  reset: () => void;
}

export default function GlobalError({error, reset}: GlobalErrorProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    setTimeout(() => {
      router.replace('/'); // 3초 후 홈으로 리디렉트
    }, 3000);
  }, [error, router]);

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorCard}>
        <h1>😢 Oops! 오류가 발생했어요</h1>
        <p>예기치 못한 문제가 발생했습니다.</p>
        <p className={styles.errorMessage}>{error.message}</p>
        <button onClick={() => router.replace('/')} className={styles.homeButton}>
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
