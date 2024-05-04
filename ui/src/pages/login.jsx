import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage({ onLogin }) {
  return (
    <>
      <Helmet>
        <title> Login | Ansible Manager </title>
      </Helmet>

      <LoginView onLogin={onLogin} />
    </>
  );
}

LoginPage.propTypes = {
  onLogin: PropTypes.func.isRequired,
};