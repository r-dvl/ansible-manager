import { Helmet } from 'react-helmet-async';

import { PlaybooksView } from 'src/sections/playbooks/view';

// ----------------------------------------------------------------------

export default function PlaybooksPage() {
  return (
    <>
      <Helmet>
        <title> Playbooks | Ansible Manager </title>
      </Helmet>

      <PlaybooksView />
    </>
  );
}
