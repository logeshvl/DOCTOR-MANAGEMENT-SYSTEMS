import MailIcon from '@mui/icons-material/Mail';
import { AppBar, Badge, Box, Button, IconButton, Stack, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import useResponsive from 'src/hooks/useResponsive';
import { CommonHelper } from 'src/utils/commonHelper';
import Iconify from '../../../components/iconify';
import AccountPopover from './AccountPopover';
import LanguagePopover from './LanguagePopover';


const NAV_WIDTH = 10;
const HEADER_MOBILE = 64;
const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'white',
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: `calc(100% - ${NAV_WIDTH + 1}px)`,
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

export default function Header({ onOpenNav }) {
  const [isVerified, setisVerified] = useState(true);
  const isDesktop = useResponsive('up', 'lg');

  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = () => {
    let data = CommonHelper.GetLoggedInUserDetailsFromCookies();
    if (data) {
      setisVerified(data.is_verified)
    }
  };

  return (
    <StyledRoot>
      <StyledToolbar>
        {isDesktop && (
          <IconButton
            onClick={onOpenNav}
            sx={{
              mr: 1,
              color: 'text.primary',
              display: { lg: 'none' },
            }}
          >
            <Iconify icon="eva:menu-2-fill" />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            xs: 0.5,
            sm: 1,
          }}
        >
          {isVerified ? (
            <></>
          ) : (
            <Button size="small"  variant="contained">
              <Badge variant="dot" sx={{ mr: 1 }}>
                <MailIcon />
              </Badge>
              Email  Verified
            </Button>
          )}
          <LanguagePopover />
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
