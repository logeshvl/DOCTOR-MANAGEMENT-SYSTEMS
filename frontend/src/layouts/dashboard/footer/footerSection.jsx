import navConfig from '../leftNavigation/config';
import { NavLink as RouterLink } from 'react-router-dom';
import { StyledNavItem, StyledNavItemIcon } from '../../../components/nav-section/styles';

const FooterSection = () => {
  return navConfig.map((nav) => {
    return (
      <StyledNavItem
        component={RouterLink}
        to={nav.path}
        sx={{
          '&.active': {
            color: 'text.primary',
            bgcolor: 'action.selected',
            fontWeight: 'fontWeightBold',
          },
        }}
      >
        <StyledNavItemIcon>{nav.icon && nav.icon}</StyledNavItemIcon>
      </StyledNavItem>
    );
  });
};
export default FooterSection;
