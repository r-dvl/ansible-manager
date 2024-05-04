import cronParser from 'cron-parser';
import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

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
  const [nextExecutions, setNextExecutions] = useState([]);
  const [nextExecutionsError, setNextExecutionsError] = useState(null);
  const apiUrl = 'https://ansible-manager-api.rdvl-server.site'

  useEffect(() => {
    fetch(`${apiUrl}/v1/logs/execution-statistics?year=2024`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching execution statistics');
        }
        return response.json();
      })
      .then(data => setExecutionStatistics(data))
      .catch(error => setStatisticsError(error.message));

    fetch(`${apiUrl}/v1/logs/last-executions`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching latest executions');
        }
        return response.json();
      })
      .then(data => setLatestExecutions(data))
      .catch(error => setExecutionsError(error.message));

    fetch(`${apiUrl}/v1/crontab/read?crontab=/crontabs/ansible`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching next executions');
        }
        return response.json();
      })
      .then(data => {
        try {
          const nextExecutionsData = data.crontab.map(({ description, cron_expression, task_name }, index) => {
            const interval = cronParser.parseExpression(cron_expression);
            const nextDate = interval.next().toDate();
            return {
              id: task_name,
              title: task_name,
              description,
              type: `order${index + 1}`,
              time: nextDate,
            };
          });
          setNextExecutions(nextExecutionsData);
        } catch (error) {
          setNextExecutionsError(error.message);
        }
      })
      .catch(error => setNextExecutionsError(error.message));
  }, []);

  if (statisticsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        Error fetching execution statistics: {statisticsError}
      </Box>
    );
  }

  if (executionsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        Error fetching latest executions: {executionsError}
      </Box>
    );
  }

  if (!executionStatistics.global) {
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

  if (nextExecutionsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        Error fetching next executions: {nextExecutionsError}
      </Box>
    );
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
            icon={<img alt="icon" src="/assets/icons/jobs/play.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <HomeWidgetSummary
            title="Success"
            total={executionStatistics.global.success.reduce((a, b) => a + b, 0)}
            color="success"
            icon={<img alt="icon" src="/assets/icons/jobs/success.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <HomeWidgetSummary
            title="Failed"
            total={executionStatistics.global.failed.reduce((a, b) => a + b, 0)}
            color="error"
            icon={<img alt="icon" src="/assets/icons/jobs/failed.svg" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <HomeWidgetSummary
            title="Ratio"
            total={Math.round((executionStatistics.global.success.reduce((a, b) => a + b, 0) / executionStatistics.global.total.reduce((a, b) => a + b, 0)) * 100)}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/jobs/ratio.svg" />}
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
              const dateObject = new Date(execution.datetime);
              return {
                id: `${execution.playbook}-${execution.datetime}-${index}`,
                title: execution.playbook,
                description: execution.status,
                image: `/assets/icons/jobs/${execution.status}.svg`,
                postedAt: dateObject,
              };
            })}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <HomeNextExecutions
            title="Next Executions"
            list={nextExecutions.map(({ id, title, description, type, time }) => ({
              id,
              title,
              description,
              type,
              time,
            }))}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
