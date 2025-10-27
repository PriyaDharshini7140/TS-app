import { Box, Grid, Typography } from '@mui/material';
import { 
  ConfirmationNumber, 
  Assignment, 
  CheckCircle, 
  Schedule,
  PriorityHigh,
  Warning
} from '@mui/icons-material';
import { StatCard } from './StatCard';
import { QuickActionsCard } from './QuickActionsCard';
import { RecentActivityCard } from './RecentActivityCard';
import { ChartCard } from './ChartCard';
import { LoadingState } from '../../../shared/components/LoadingState';
import { 
  useDashboardStatsQuery, 
  useRecentActivityQuery, 
  useTicketsByStatusQuery,
  useTicketsByPriorityQuery,
  useTicketTrendsQuery 
} from '../hooks';

interface DashboardPageProps {
  userRole: string;
  onNavigate: (page: string) => void;
  onViewTicket: (ticketId: string) => void;
}

// Mock data for employee tickets
const mockEmployeeTickets = [
  {
    id: 'TKT-001',
    title: 'Email not working',
    status: 'Open' as const,
    priority: 'High' as const,
    createdAt: '2025-10-20T10:30:00',
    slaHours: 18,
  },
  {
    id: 'TKT-005',
    title: 'Account access issue',
    status: 'In Progress' as const,
    priority: 'High' as const,
    createdAt: '2025-10-19T08:15:00',
    slaHours: 5,
  },
  {
    id: 'TKT-012',
    title: 'Software installation request',
    status: 'Waiting' as const,
    priority: 'Medium' as const,
    createdAt: '2025-10-18T14:20:00',
    slaHours: 32,
  },
];

// Mock data for manager team tickets
const mockTeamTickets = [
  {
    id: 'TKT-001',
    title: 'Email not working',
    status: 'Open' as const,
    priority: 'High' as const,
    assignee: 'Jane Smith',
    department: 'IT',
    createdAt: '2025-10-20T10:30:00',
    slaBreach: false,
  },
  {
    id: 'TKT-002',
    title: 'Printer not responding',
    status: 'In Progress' as const,
    priority: 'Medium' as const,
    assignee: 'Bob Williams',
    department: 'IT',
    createdAt: '2025-10-19T14:20:00',
    slaBreach: false,
  },
  {
    id: 'TKT-003',
    title: 'VPN connection issues',
    status: 'Waiting' as const,
    priority: 'Critical' as const,
    assignee: 'Diana Prince',
    department: 'IT',
    createdAt: '2025-10-17T11:00:00',
    slaBreach: true,
  },
];

export const DashboardPage = ({
  userRole,
  onNavigate,
  onViewTicket,
}: DashboardPageProps) => {
  const { data: stats, isLoading: statsLoading } = useDashboardStatsQuery();
  const { data: activities, isLoading: activitiesLoading } = useRecentActivityQuery(8);
  const { data: statusData, isLoading: statusLoading } = useTicketsByStatusQuery();
  const { data: priorityData, isLoading: priorityLoading } = useTicketsByPriorityQuery();
  const { data: trendsData, isLoading: trendsLoading } = useTicketTrendsQuery(7);

  const getWelcomeMessage = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'System Overview';
      case 'IT Support Agent':
        return 'Your Support Dashboard';
      case 'Department Manager':
        return 'Department Overview';
      case 'End User':
        return 'Your Tickets';
      default:
        return 'Dashboard';
    }
  };

  const getStatsForRole = (role: string) => {
    if (!stats) return [];

    const baseStats = [
      {
        title: 'Total Tickets',
        value: stats.totalTickets,
        subtitle: 'All time',
        icon: <ConfirmationNumber />,
        color: 'primary' as const,
        trend: { value: 12, isPositive: true },
      },
      {
        title: 'Open Tickets',
        value: stats.openTickets,
        subtitle: 'Needs attention',
        icon: <Assignment />,
        color: 'warning' as const,
        trend: { value: 5, isPositive: false },
      },
      {
        title: 'Resolved',
        value: stats.resolvedTickets,
        subtitle: 'This month',
        icon: <CheckCircle />,
        color: 'success' as const,
        trend: { value: 18, isPositive: true },
      },
    ];

    if (role === 'End User') {
      return [
        {
          title: 'My Tickets',
          value: stats.myTickets,
          subtitle: 'Total submitted',
          icon: <ConfirmationNumber />,
          color: 'primary' as const,
        },
        {
          title: 'Open',
          value: stats.myOpenTickets,
          subtitle: 'In progress',
          icon: <Schedule />,
          color: 'warning' as const,
        },
        {
          title: 'Avg Resolution',
          value: `${stats.avgResolutionTime} days`,
          subtitle: 'Average time',
          icon: <CheckCircle />,
          color: 'info' as const,
        },
      ];
    }

    if (role === 'Admin') {
      return [
        ...baseStats,
        {
          title: 'High Priority',
          value: stats.highPriorityTickets,
          subtitle: 'Needs immediate attention',
          icon: <PriorityHigh />,
          color: 'error' as const,
        },
        {
          title: 'Overdue',
          value: stats.overdueTickets,
          subtitle: 'Past due date',
          icon: <Warning />,
          color: 'error' as const,
        },
        {
          title: 'Avg Resolution',
          value: `${stats.avgResolutionTime} days`,
          subtitle: 'Average time',
          icon: <CheckCircle />,
          color: 'info' as const,
        },
      ];
    }

    return baseStats;
  };

  const statsData = getStatsForRole(userRole);

  if (statsLoading) {
    return <LoadingState variant="card" count={6} />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          {getWelcomeMessage(userRole)}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {userRole === 'Admin' 
            ? 'Monitor and manage all system activities'
            : userRole === 'End User'
            ? 'Track your support requests and submit new tickets'
            : 'Manage your assigned tickets and department activities'
          }
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsData.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <StatCard
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
              isLoading={statsLoading}
            />
          </Grid>
        ))}
      </Grid>

      {/* Charts and Activity */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <QuickActionsCard
            onCreateTicket={() => onNavigate('tickets')}
            onAssignTicket={() => onNavigate('tickets')}
            onViewReports={() => onNavigate('reports')}
            onManageUsers={() => onNavigate('users')}
            userRole={userRole}
          />
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <RecentActivityCard
            activities={activities || []}
            isLoading={activitiesLoading}
            onViewAll={() => onNavigate('tickets')}
          />
        </Grid>
      </Grid>

      {/* Charts Row */}
      {(userRole === 'Admin' || userRole === 'Department Manager') && (
        <Grid container spacing={3}>
          {/* Tickets by Status */}
          <Grid item xs={12} md={4}>
            <ChartCard
              title="Tickets by Status"
              type="pie"
              data={statusData || []}
              height={250}
              isLoading={statusLoading}
            />
          </Grid>

          {/* Tickets by Priority */}
          <Grid item xs={12} md={4}>
            <ChartCard
              title="Tickets by Priority"
              type="bar"
              data={priorityData || []}
              height={250}
              isLoading={priorityLoading}
            />
          </Grid>

          {/* Ticket Trends */}
          <Grid item xs={12} md={4}>
            <ChartCard
              title="7-Day Trends"
              type="line"
              data={trendsData || []}
              height={250}
              isLoading={trendsLoading}
            />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};