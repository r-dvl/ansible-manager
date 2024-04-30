import { faker } from '@faker-js/faker';
import React, { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import HomePlaybooks from '../home-playbooks';
import HomeWidgetSummary from '../home-widget-summary';
import HomeNextExecutions from '../home-next-executions';
import HomeLatestExecutions from '../home-latest-executions';
import HomeExecutionStatistics from '../home-execution-statistics';

// ----------------------------------------------------------------------

export default function HomeView() {
  const [executionStatistics, setExecutionStatistics] = useState({});

  useEffect(() => {
    fetch(`http://192.168.1.41:8080/v1/logs/execution-statistics?year=2024`)
      .then(response => response.json())
      .then(data => setExecutionStatistics(data));
  }, []);

  if (!executionStatistics.global) {
    return <div>Cargando...</div>;
  }

  const playbookSeries = Object.entries(executionStatistics)
    .filter(([playbook]) => playbook !== 'global')
    .map(([playbook, data]) => ({
      label: playbook,
      value: data.total.reduce((a, b) => a + b, 0),
    }));

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <HomeWidgetSummary
            title="Jobs run"
            total={executionStatistics.global.total.reduce((a, b) => a + b, 0)}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <HomeWidgetSummary
            title="Success"
            total={executionStatistics.global.success.reduce((a, b) => a + b, 0)}
            color="success"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <HomeWidgetSummary
            title="Failed"
            total={executionStatistics.global.failed.reduce((a, b) => a + b, 0)}
            color="error"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <HomeWidgetSummary
            title="Ratio"
            total={Math.round((executionStatistics.global.success.reduce((a, b) => a + b, 0) / executionStatistics.global.total.reduce((a, b) => a + b, 0)) * 100)}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <HomeExecutionStatistics
            title="Execution Statistics"
            subheader="This year"
            chart={{
              labels: [
                '01/01/2024',
                '02/01/2024',
                '03/01/2024',
                '04/01/2024',
                '05/01/2024',
                '06/01/2024',
                '07/01/2024',
                '08/01/2024',
                '09/01/2024',
                '10/01/2024',
                '11/01/2024',
                '12/01/2024',
              ],
              series: [
                {
                  name: 'Success',
                  type: 'area',
                  fill: 'gradient',
                  data: executionStatistics.global.success,
                },
                {
                  name: 'Failed',
                  type: 'area',
                  fill: 'gradient',
                  data: executionStatistics.global.failed,
                },
                {
                  name: 'Total',
                  type: 'column',
                  fill: 'solid',
                  data: executionStatistics.global.total,
                },
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <HomePlaybooks
            title="Playbooks Chart"
            chart={{
              series: playbookSeries,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <HomeLatestExecutions
            title="Latest Executions"
            list={[...Array(5)].map((_, index) => ({
              id: "001",
              title: "Backup",
              description: "Success",
              image: `/assets/images/covers/cover_${index + 1}.jpg`,
              postedAt: faker.date.recent(),
            }))}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <HomeNextExecutions
            title="Next Executions"
            list={[...Array(5)].map((_, index) => ({
              id: faker.string.uuid(),
              title: [
                'Backup',
                'Host Maintenance',
                'Cleanup',
                'Lookup',
                'Sync',
              ][index],
              type: `order${index + 1}`,
              time: faker.date.past(),
            }))}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
