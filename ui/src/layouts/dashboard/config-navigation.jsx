import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'home',
    path: '/',
    icon: icon('home'),
  },
  {
    title: 'playbooks',
    path: '/playbooks',
    icon: icon('playbooks'),
  },
  {
    title: 'hosts',
    path: '/hosts',
    icon: icon('hosts'),
  },
];

export default navConfig;
