import { Box, Button } from '@mui/material';
import './SearchBoardHeader.css';

const SearchBoardHeader: React.FC = () => {

  const tags = ['All', 'Trending', 'RPG', 'Strategy', 'Simulation', 'Sports', 'Puzzle'];
  
return (
    <div className="search-board">
      {/* Header with swipeable tag buttons */}
      <Box className="search-board-header" >
        {tags.map((tag, index) => (
          <Button
            key={index}
            variant="outlined"
            color="primary"
          >
            {tag}
          </Button>
        ))}
      </Box>

      {/* Search Board Content */}
    </div>
  );
}

export default SearchBoardHeader;