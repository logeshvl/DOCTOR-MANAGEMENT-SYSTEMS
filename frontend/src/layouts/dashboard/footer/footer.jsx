import { styled } from '@mui/material';

const Footer = styled('div')(() => ({
  marginTop: '1.5rem',
  padding: '1.5rem',
  backgroundColor: 'white',
  position: 'fixed',
  bottom: 0,
  left: 0,
  width: '100%',
  zIndex: 100,
  borderTop: '1px solid #f3f3f3',
  display: 'flex',
}));
export default Footer;
