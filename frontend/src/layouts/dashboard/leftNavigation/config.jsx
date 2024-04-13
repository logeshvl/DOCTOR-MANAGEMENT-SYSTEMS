import SvgColor from '../../../components/svg-color';

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('dashboard'),
  },
  {
    title: 'All Appointment',
    path: '/all-appointment',
    icon: icon('published-post'),
  },
  {
    title: 'New Appointment',
    path: '/new-appointment',
    icon: icon('new-post'),
  },
  {
    title: 'Cancel Appointment',
    path: '/cancel-appointment',
    icon: icon('calendar'),
  },
  {
    title: 'Approved Appointment',
    path: '/approved-appointment',
    icon: icon('integration'),
  },
  {
    title: 'Completd Appointment',
    path: '/completed-appointment',
    icon: icon('integration'),
  },
];

export default navConfig;
