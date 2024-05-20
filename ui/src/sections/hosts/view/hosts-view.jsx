import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import HostsCard from '../hosts-card';
import HostsSort from '../hosts-sort';
import { apiUrl } from '../../../../config';
import HostsFilters from '../hosts-filters';

export default function HostsView() {
  const [hosts, setHosts] = useState([]);
  const [hostsError, setHostsError] = useState(null);
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(() => {
    fetch(`${apiUrl}/v1/hosts/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching hosts data');
        }
        return response.json();
      })
      .then(data => {
        const hostsArray = Object.keys(data).map(key => ({
          name: key,
          ...data[key]
        }));
        setHosts(hostsArray);
      })
      .catch(error => setHostsError(error.message));
  }, []);

  if (hostsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        Error fetching hosts data: {hostsError}
      </Box>
    );
  }

  if (!hosts) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hosts
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <HostsFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          <HostsSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {hosts.map((host) => (
          <Grid item key={host.ansible_host} xs={12} sm={6} md={3}>
            <HostsCard host={host} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
