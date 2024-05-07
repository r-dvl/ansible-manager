import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import Label from 'src/components/label';

export default function ShopProductCard({ host }) {
  const renderStatus = (
    <Label
      variant="filled"
      color='info'
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {host.group}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={host.name}
      src='/assets/images/hosts/server.svg'
      sx={{
        top: '50%',
        left: '50%',
        width: '50%',
        height: '50%',
        objectFit: 'cover',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
      }}
    />
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {host && renderStatus}
        {renderImg}
      </Box>
      <Divider sx={{ my: 3 }} />
      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography variant="h6">
          {host.name}
        </Typography>
        <Typography variant="subtitle2">
          {host.ansible_host}
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="space-between"/>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  host: PropTypes.object,
};
