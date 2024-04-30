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
  const [latestExecutions, setLatestExecutions] = useState([]);
  const [statisticsError, setStatisticsError] = useState(null);
  const [executionsError, setExecutionsError] = useState(null);

  useEffect(() => {
    fetch('https://ansible.rdvl-server.site/api/v1/logs/execution-statistics?year=2024')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching execution statistics');
        }
        return response.json();
      })
      .then(data => setExecutionStatistics(data))
      .catch(error => setStatisticsError(error.message));

    fetch('https://ansible.rdvl-server.site/api/v1/logs/last-executions')
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching latest executions');
        }
        return response.json();
      })
      .then(data => setLatestExecutions(data))
      .catch(error => setExecutionsError(error.message));
  }, []);

  if (statisticsError) {
    return <div>Error fetching execution statistics: {statisticsError}</div>;
  }

  if (executionsError) {
    return <div>Error fetching latest executions: {executionsError}</div>;
  }

  if (!executionStatistics.global) {
    return <div>Loading...</div>;
  };

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
            list={latestExecutions.map((execution, index) => {
              // Convertir el string datetime a un objeto Date
              const dateObject = new Date(execution.datetime);
              return {
                id: `${execution.playbook}-${execution.datetime}-${index}`,
                title: execution.playbook,
                description: execution.status,
                image: `/assets/icons/jobs/${execution.status}.png`,
                postedAt: dateObject,
              };
            })}
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
