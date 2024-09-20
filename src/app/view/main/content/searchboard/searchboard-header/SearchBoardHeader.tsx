import { Box, Chip } from '@mui/material';
import './SearchBoardHeader.css';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import TagIcon from '@mui/icons-material/Tag';

const SearchBoardHeader: React.FC = () => {

  const tags = [
    {label : 'All', icon : <WhatshotIcon />}, 
    {label : 'Trending', icon : <WhatshotIcon /> }, 
    {label : 'HashTag', icon : <TagIcon /> }, 
    {label : 'All', icon : <WhatshotIcon /> }, 
    {label : 'All', icon : <WhatshotIcon /> }, 
    {label : 'All', icon : <WhatshotIcon /> }, 
    {label : 'All', icon : <WhatshotIcon /> }, 
    {label : 'All', icon : <WhatshotIcon /> }, 
    {label : 'All', icon : <WhatshotIcon /> }, 
  ];
  
return (
    <div className="search-board">
      {/* Header with swipeable tag buttons */}
      <Box className="search-board-header" >
        {tags.map((tag, index) => (
           <Chip
           key={index}
           icon={tag.icon} // 아이콘 추가
           label={tag.label}
           variant="outlined"
           color="primary"
           style={{ margin: '0 4px' }} // Chip 사이 간격 조정
         />
        ))}
        
      </Box>
      

      {/* Search Board Content */}
    </div>
  );
}

export default SearchBoardHeader;