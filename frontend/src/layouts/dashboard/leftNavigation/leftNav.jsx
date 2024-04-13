import { Avatar, Box, Button, Drawer, Link, Stack, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CommonHelper } from 'src/utils/commonHelper';
import Logos from '../../../assets/logo.png';
import NavSection from '../../../components/nav-section';
import Scrollbar from '../../../components/scrollbar';
import useResponsive from '../../../hooks/useResponsive';
import navConfig from './config';
import { useNavigate } from "react-router-dom";
const NAV_WIDTH = 280;

const StyledAccount = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: alpha(theme.palette.grey[1], 0.12),
}));

export default function Nav({ openNav, onCloseNav }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isDesktop = useResponsive('up', 'lg');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    getUserInfo();
    if (openNav) {
      onCloseNav();
    }
  }, [pathname]);

  const logoStyle = {
    height: '40px',
  };

  const getUserInfo = async () => {
    let data = CommonHelper.GetLoggedInUserDetailsFromCookies();
    if (data) {
      setFirstName(data.username || '');
    }
  };

  const getImageFileFromImageUrl = async (imageUrl) => {
    let fileName = imageUrl.split('/').pop();
    return await CommonHelper.CreateFileFromImageUrl(imageUrl, fileName).then((file) => {
      return file;
    });
  };
  const navigateToPayment = () => {
    navigate("/payment");
  }

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
      }}
    >
      <Box sx={{ px: 2.5, py: 3, display: 'inline-flex' }}>
        <Link href="/dashboard">
          <img src={Logos} style={logoStyle} />
        </Link>
        <Link href="/dashboard" underline="none">
          <Typography variant="subtitle2" sx={{ ml: 1, fontSize: '20px', color: 'text.primary' }}>
            Doctor Management
          </Typography>
        </Link>
      </Box>

      <Box sx={{ mb: 5, mx: 2.5 }}>
        <Link underline="none">
          <StyledAccount>
            <Avatar
              sx={{ bgcolor: '#00AB55' }}
              src={firstName ? firstName : ' '}
              alt={`${firstName} ${''}`}
            />

            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.primary', fontWeight: 'fontWeightBold' }}>
                {firstName}
              </Typography>

              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              </Typography>
            </Box>
          </StyledAccount>
        </Link>
      </Box>

      <NavSection data={navConfig} />

      <Box sx={{ flexGrow: 1 }} />

      {/* <Box sx={{ px: 2.5, pb: 3, mt: 10 }}>
        <Stack alignItems="center" spacing={3} sx={{ pt: 5, borderRadius: 2, position: 'relative' }}>
          <Box
            component="img"
            src="/assets/illustrations/illustration_avatar.png"
            sx={{ width: 100, position: 'absolute', top: -50 }}
          />

          <Box sx={{ textAlign: 'center' }}>
            <Typography gutterBottom variant="h6">
              Need to use?
            </Typography>

            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              From only $1
            </Typography>
          </Box>

          <Button variant="contained" onClick={navigateToPayment}>
            Upgrade to Pro
          </Button>
        </Stack>
      </Box> */}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV_WIDTH },
      }}
    >
      {isDesktop && (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: NAV_WIDTH,
              bgcolor: 'background.default',
              borderRightStyle: 'dashed',
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
