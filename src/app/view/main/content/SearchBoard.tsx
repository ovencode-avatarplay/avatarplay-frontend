import React, { useEffect } from 'react'
import { fetchCharacterInfo } from '@/app/NetWork/MyNetWork'

const SearchBoard: React.FC = () => {

    useEffect(() => {
        console.log('이 코드는 컴포넌트가 마운트될 때 한번만 실행됩니다.');
        init();
      
        return () => {
        };
      }, []);
    
      const init = async () => {
        const resCharacterInfo = await fetchCharacterInfo();
      }

    return (
        <main className="content">
            <p>
                c
            </p>
            <p>
                o
            </p>
            <p>
                n
            </p>
            <p>
                t
            </p>
            <p>
                e
            </p>
            <p>
                n
            </p>
            <p>
                t
            </p>
        </main>
    )
}

export default SearchBoard
