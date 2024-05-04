import { Helmet } from 'react-helmet-async';

import { HostsView } from 'src/sections/hosts/view';

// ----------------------------------------------------------------------

export default function HostsPage() {
  return (
    <>
      <Helmet>
        <title> Hosts | Ansible Manager </title>
      </Helmet>

      <HostsView />
    </>
  );
}
