'use client';

import CreateContentIntroduction from '@/app/view/main/content/create/content/CreateContentIntroduction';
import TermsAndConditions from '@/app/view/main/content/create/content/TermsAndConditions';

export default function CreateCharacterPage() {
  return <TermsAndConditions isSingle={false} />;
}

//dash
('http://localhost:3000/ko/create/content');
('http://localhost:3000/ko/create/content/series/[[id]]');
('http://localhost:3000/ko/create/content/single/[[id]]');

// 1번보고끝
('http://localhost:3000/ko/create/content/condition/single');
('http://localhost:3000/ko/create/content/condition/series');

//create
('http://localhost:3000/ko/create/content/series');
('http://localhost:3000/ko/create/content/single');

('http://localhost:3000/ko/create/content/series/[[id1]]/episode');
('http://localhost:3000/ko/create/content/single/[[id1]]/episode');

// update
('http://localhost:3000/ko/update/content/series/[[id1]]');
('http://localhost:3000/ko/update/content/single/[[id1]]');

('http://localhost:3000/ko/update/content/series/episode/[[id2]]');
('http://localhost:3000/ko/update/content/single/episode/[[id2]]');
