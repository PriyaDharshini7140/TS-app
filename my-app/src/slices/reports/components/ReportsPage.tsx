import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  TextField,
  MenuItem,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  FileDownload,
  Print,
  Refresh,
  TrendingUp,
  Assessment,
  Speed,
  People,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data
const ticketsByStatus = [
  { name: 'Open', value: 45, color: '#8B5CF6' },
  { name: 'In Progress', value: 32, color: '#3B82F6' },
  { name: 'Waiting', value: 18, color: '#FBBF24' },
  { name: 'Resolved', value: 125, color: '#34D399' },
  { name: 'Closed', value: 89, color: '#9CA3AF' },
];

const ticketsByPriority = [
  { name: 'Low', count: 45 },
  { name: 'Medium', count: 78 },
  { name: 'High', count: 52 },
  { name: 'Critical', count: 14 },
];

const ticketTrends = [
  { date: 'Oct 03', created: 12, resolved: 8 },
  { date: 'Oct 04', created: 15, resolved: 11 },
  { date: 'Oct 05', created: 8, resolved: 14 },
  { date: 'Oct 06', created: 18, resolved: 9 },
  { date: 'Oct 07', created: 14, resolved: 16 },
  { date: 'Oct 08', created: 11, resolved: 13 },
  { date: 'Oct 09', created: 16, resolved: 10 },
];

const departmentStats = [
  { department: 'IT', tickets: 89, avgTime: 2.3 },
  { department: 'Finance', tickets: 45, avgTime: 3.1 },
  { department: 'HR', tickets: 67, avgTime: 1.8 },
  { department: 'Sales', tickets: 52, avgTime: 2.9 },
  { department: 'Marketing', tickets: 38, avgTime: 2.5 },
];

const StatCard = ({ title, value, subtitle, icon: Icon, color }: any) => {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, color: color || 'primary.main', mb: 0.5 }}>
              {value}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
          <Box
            sx={{
              p: 1.5,
              borderRadius: 2,
              bgcolor: `${color || 'primary.main'}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: color || 'primary.main', fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const ReportsPage = () => {
  const [dateRange, setDateRange] = useState({
    start: new Date(2025, 9, 1),
    end: new Date(2025, 9, 9),
  });
  const [reportType, setReportType] = useState('overview');
  const [department, setDepartment] = useState('all');

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ width: '100%', maxWidth: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              Reports & Analytics
            </Typography>
            <Typography variant="body1" color="text.secondary">
              View comprehensive ticket analytics and performance metrics
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button variant="outlined" startIcon={<Print />}>
              Print
            </Button>
            <Button variant="contained" startIcon={<FileDownload />}>
              Export
            </Button>
          </Box>
        </Box>

        {/* Filters */}
  <Paper sx={{ p: 3, mb: 3, width: '100%', maxWidth: '100%' }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Report Type"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <MenuItem value="overview">Overview</MenuItem>
                <MenuItem value="performance">Performance</MenuItem>
                <MenuItem value="department">By Department</MenuItem>
                <MenuItem value="agent">By Agent</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <MenuItem value="all">All Departments</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="Start Date"
                value={dateRange.start}
                onChange={(newValue) => setDateRange({ ...dateRange, start: newValue || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <DatePicker
                label="End Date"
                value={dateRange.end}
                onChange={(newValue) => setDateRange({ ...dateRange, end: newValue || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                sx={{ height: 56 }}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Stats Cards */}
  <Grid container spacing={3} sx={{ mb: 4, width: '100%' }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Tickets"
              value="309"
              subtitle="Last 30 days"
              icon={Assessment}
              color="#8B5CF6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Avg Resolution Time"
              value="2.5 days"
              subtitle="Across all tickets"
              icon={Speed}
              color="#3B82F6"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Resolution Rate"
              value="87%"
              subtitle="On-time resolution"
              icon={TrendingUp}
              color="#34D399"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Active Agents"
              value="24"
              subtitle="Handling tickets"
              icon={People}
              color="#FBBF24"
            />
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {/* Ticket Trends */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, width: '100%', maxWidth: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Ticket Trends (7 Days)
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={ticketTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="created" stroke="#8B5CF6" strokeWidth={2} name="Created" />
                  <Line type="monotone" dataKey="resolved" stroke="#34D399" strokeWidth={2} name="Resolved" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Tickets by Status */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, width: '100%', maxWidth: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Tickets by Status
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ticketsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(props) => {
                      const { name, percent } = props;
                      return `${name} ${(percent as any * 100).toFixed(0)}%`;
                    }}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {ticketsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Tickets by Priority */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, width: '100%', maxWidth: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Tickets by Priority
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ticketsByPriority}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Department Performance */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, width: '100%', maxWidth: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Department Performance
              </Typography>
              <Divider sx={{ mb: 3 }} />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentStats} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" />
                  <YAxis dataKey="department" type="category" width={80} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="tickets" fill="#8B5CF6" radius={[0, 8, 8, 0]} name="Tickets" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>

        {/* Department Stats Table */}
  <Paper sx={{ p: 3, width: '100%', maxWidth: '100%' }}>
          <Typography variant="h6" gutterBottom>
            Department Statistics
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box component="thead">
                <Box component="tr" sx={{ borderBottom: 2, borderColor: 'divider' }}>
                  <Box component="th" sx={{ textAlign: 'left', py: 2, px: 1 }}>Department</Box>
                  <Box component="th" sx={{ textAlign: 'right', py: 2, px: 1 }}>Total Tickets</Box>
                  <Box component="th" sx={{ textAlign: 'right', py: 2, px: 1 }}>Avg Resolution Time</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {departmentStats.map((dept, index) => (
                  <Box 
                    component="tr" 
                    key={index}
                    sx={{ 
                      borderBottom: 1, 
                      borderColor: 'divider',
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  >
                    <Box component="td" sx={{ py: 2, px: 1 }}>{dept.department}</Box>
                    <Box component="td" sx={{ textAlign: 'right', py: 2, px: 1 }}>{dept.tickets}</Box>
                    <Box component="td" sx={{ textAlign: 'right', py: 2, px: 1 }}>{dept.avgTime} days</Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};
