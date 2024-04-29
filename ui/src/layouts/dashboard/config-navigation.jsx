import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'home',
    path: '/',
    icon: icon('ic_disabled'),
  },
  {
    title: 'playbooks',
    path: '/products',
    icon: icon('ic_cart'),
  },
  {
    title: 'hosts',
    path: '/blog',
    icon: icon('ic_blog'),
  },
  {
    title: 'user',
    path: '/user',
    icon: icon('ic_user'),
  },
  {
    title: 'login',
    path: '/login',
    icon: icon('ic_lock'),
  },
];

export default navConfig;
