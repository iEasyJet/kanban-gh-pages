import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

function EmojiPicker({ icon, onChange }) {
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [isShowPopup, setIsShowPopup] = useState(false);

  useEffect(() => {
    setSelectedEmoji(icon);
  }, [icon]);

  function selectEmoji(e) {
    setIsShowPopup(false);
    onChange(e.native);
  }

  function togglePopup() {
    setIsShowPopup(!isShowPopup);
  }

  return (
    <Box sx={{ position: 'relative', width: 'max-content' }}>
      <Typography
        variant="h3"
        fontWeight="700"
        sx={{
          cursor: 'pointer',
        }}
        onClick={togglePopup}
      >
        {selectedEmoji}
      </Typography>
      <Box
        sx={{
          display: isShowPopup ? 'block' : 'none',
          position: 'absolute',
          top: '100%',
          zIndex: 100,
        }}
      >
        <Picker
          data={data}
          theme="dark"
          onEmojiSelect={selectEmoji}
          showPreview={false}
        />
      </Box>
    </Box>
  );
}

export default EmojiPicker;
