import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';

const ContentInfoManager: React.FC = () => {
    const [inputId, setInputId] = useState<number | ''>(''); // 입력된 ID 상태
    const contentInfo = useSelector((state: RootState) => state.content.contentInfo || []); // Redux에서 contentInfo 가져오기, 없으면 빈 배열 반환
    const [result, setResult] = useState<string | null>(null); // 결과 상태

    const handleSearch = () => {
        if (contentInfo.length > 0) {  // contentInfo가 빈 배열이 아니면 검색 진행
            const foundContent = contentInfo.find(item => item.id === Number(inputId));
            if (foundContent) {
                setResult(`Character Name: ${foundContent.publishInfo?.contentName}`);
            } else {
                setResult('Character not found');
            }
        } else {
            setResult('No content available');
        }
    };

    return (
        <div>
            <input 
                type="number" 
                value={inputId} 
                onChange={(e) => setInputId(Number(e.target.value))} 
                placeholder="Enter ID" 
            />
            <button onClick={handleSearch}>Search</button>
            {result && <div>{result}</div>}
        </div>
    );
};

export default ContentInfoManager;