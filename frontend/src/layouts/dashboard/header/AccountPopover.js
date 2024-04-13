import { Avatar, Box, Divider, IconButton, MenuItem, Popover, Tooltip, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CommonHelper } from 'src/utils/commonHelper';

export default function AccountPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    getUserInfo();
  }, [])

  useEffect(() => {
  }, [imageUrl, imageFile])

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };
  const handleLogout = () => {
    CommonHelper.Logout();
  };

  const getUserInfo = async () => {
    let data = CommonHelper.GetLoggedInUserDetailsFromCookies();
    if (data) {
      setFirstName(data.username || '');
      setLastName(data.last_name || '');
      setEmail(data.email || '');
      setImageUrl(data.image_url || '');
      if (data.image_url) {
        let file = await getImageFileFromImageUrl(data.image_url);
        setImageFile(file);
      }
    }
  }

  const getImageFileFromImageUrl = async (imageUrl) => {
    let fileName = imageUrl.split('/').pop();
    return await CommonHelper.CreateFileFromImageUrl(imageUrl, fileName)
      .then(file => {
        return file;
      });
  }

  const handleClosePopover = () => {
    setOpen(null);
  }

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar
          sx={{ bgcolor: '#00AB55' }}
          src={imageUrl ? imageUrl : `${firstName} ${lastName}`} alt={`${firstName} ${lastName}`} />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }} >
          <Typography variant="subtitle2" noWrap>
            {/* {displayName} */}
            {`${firstName} ${lastName}`}
          </Typography>
          <Tooltip title={email}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
              {email}
            </Typography>
          </Tooltip>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}
