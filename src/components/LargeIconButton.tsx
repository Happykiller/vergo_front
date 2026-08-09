import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';

const LargeIconButton = styled(IconButton)({
  width: 60,
  height: 60,
  '& .MuiSvgIcon-root': {
    fontSize: 40,
  },
});

export default LargeIconButton;