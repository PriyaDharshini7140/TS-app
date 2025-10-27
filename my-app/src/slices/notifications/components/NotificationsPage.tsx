import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  MenuItem,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Chip,
  Badge,
  Divider,
  Paper,
  Alert,
  FormControlLabel,
  Switch,
} from '@mui/material';
import {
  Notifications,
  Delete,
  MarkEmailRead,
  MarkEmailUnread,
  FilterList,
  Refresh,
  Settings,
  CheckCircle,
  Error,
  Warning,
  Info,
  Assignment,
  Person,
  Security,
  Update,
  Circle,
} from '@mui/icons-material';

interface NotificationsPageProps {
  userRole: string;
}

interface Notification {
  id: string;
  type: 'ticket' | 'user' | 'system' | 'security';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  icon?: string;
}

interface LogEntry {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  type: 'create' | 'update' | 'delete' | 'login' | 'system';
  status: 'success' | 'warning' | 'error';
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'ticket',
    title: 'New ticket assigned',
    message: 'Ticket #TKT-123 "Email server down" has been assigned to you',
    timestamp: '2025-10-13T10:30:00',
    isRead: false,
    priority: 'high',
  },
  {
    id: '2',
    type: 'system',
    title: 'System maintenance scheduled',
    message: 'Scheduled maintenance on October 15, 2025 at 2:00 AM EST',
    timestamp: '2025-10-13T09:15:00',
    isRead: false,
    priority: 'medium',
  },
  {
    id: '3',
    type: 'ticket',
    title: 'Ticket resolved',
    message: 'Your ticket #TKT-098 has been marked as resolved',
    timestamp: '2025-10-13T08:45:00',
    isRead: true,
    priority: 'low',
  },
  {
    id: '4',
    type: 'security',
    title: 'Login from new device',
    message: 'New login detected from Chrome on Windows',
    timestamp: '2025-10-13T08:00:00',
    isRead: false,
    priority: 'critical',
  },
  {
    id: '5',
    type: 'user',
    title: 'New user added',
    message: 'John Smith has been added to your department',
    timestamp: '2025-10-12T16:30:00',
    isRead: true,
    priority: 'low',
  },
];

const mockLogs: LogEntry[] = [
  {
    id: '1',
    action: 'Ticket Created',
    user: 'John Doe',
    timestamp: '2025-10-13T10:30:00',
    details: 'Created ticket TKT-123: Email server down',
    type: 'create',
    status: 'success',
  },
  {
    id: '2',
    action: 'User Updated',
    user: 'Admin',
    timestamp: '2025-10-13T10:15:00',
    details: 'Updated user profile for Sarah Johnson',
    type: 'update',
    status: 'success',
  },
  {
    id: '3',
    action: 'Login Failed',
    user: 'Unknown',
    timestamp: '2025-10-13T09:45:00',
    details: 'Failed login attempt for user admin@company.com',
    type: 'login',
    status: 'error',
  },
  {
    id: '4',
    action: 'Department Deleted',
    user: 'Admin',
    timestamp: '2025-10-13T09:30:00',
    details: 'Deleted department: Marketing',
    type: 'delete',
    status: 'warning',
  },
  {
    id: '5',
    action: 'System Backup',
    user: 'System',
    timestamp: '2025-10-13T08:00:00',
    details: 'Automated system backup completed successfully',
    type: 'system',
    status: 'success',
  },
];

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ userRole }) => {
  const [tabValue, setTabValue] = useState(0);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filterType, setFilterType] = useState('all');
  const [showSettings, setShowSettings] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'ticket':
        return <Assignment />;
      case 'user':
        return <Person />;
      case 'security':
        return <Security />;
      case 'system':
        return <Settings />;
      default:
        return <Info />;
    }
  };

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <CheckCircle color="success" />;
      case 'update':
        return <Update color="info" />;
      case 'delete':
        return <Delete color="error" />;
      case 'login':
        return <Person color="primary" />;
      case 'system':
        return <Settings color="action" />;
      default:
        return <Info />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'error';
      case 'high':
        return 'warning';
      case 'medium':
        return 'info';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = filterType === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filterType);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Notifications & Activity Logs
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Stay updated with system notifications and monitor activity
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <Button variant="outlined" startIcon={<Notifications />}>
              Notifications
            </Button>
          </Badge>
          <Button 
            variant="outlined" 
            startIcon={<Settings />}
            onClick={() => setShowSettings(!showSettings)}
          >
            Settings
          </Button>
        </Box>
      </Box>

      {/* Notification Settings */}
      {showSettings && (
        <Alert severity="info" sx={{ mb: 3 }} onClose={() => setShowSettings(false)}>
          <Typography variant="subtitle2" gutterBottom>
            Notification Preferences
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Email notifications"
            />
            <FormControlLabel
              control={<Switch defaultChecked />}
              label="Push notifications"
            />
            <FormControlLabel
              control={<Switch />}
              label="SMS alerts for critical issues"
            />
          </Box>
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Unread
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'error.main' }}>
                    {unreadCount}
                  </Typography>
                </Box>
                <Notifications sx={{ fontSize: 40, color: 'error.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {notifications.length}
                  </Typography>
                </Box>
                <Assignment sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Critical
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {notifications.filter(n => n.priority === 'critical').length}
                  </Typography>
                </Box>
                <Warning sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Today's Logs
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                    {mockLogs.length}
                  </Typography>
                </Box>
                <Update sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label={`Notifications (${unreadCount})`} icon={<Notifications />} iconPosition="start" />
          <Tab label="Activity Logs" icon={<Assignment />} iconPosition="start" />
        </Tabs>

        {/* Notifications Tab */}
        <TabPanel value={tabValue} index={0}>
          <Box sx={{ p: 3 }}>
            {/* Filters */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  select
                  size="small"
                  label="Filter by type"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  sx={{ minWidth: 200 }}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="ticket">Tickets</MenuItem>
                  <MenuItem value="user">Users</MenuItem>
                  <MenuItem value="system">System</MenuItem>
                  <MenuItem value="security">Security</MenuItem>
                </TextField>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<MarkEmailRead />} onClick={handleMarkAllAsRead}>
                  Mark All Read
                </Button>
                <IconButton size="small" color="primary">
                  <Refresh />
                </IconButton>
              </Box>
            </Box>

            {/* Notifications List */}
            <List>
              {filteredNotifications.map((notification, index) => (
                <Box key={notification.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      bgcolor: notification.isRead ? 'transparent' : 'action.hover',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                    secondaryAction={
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton 
                          edge="end" 
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                        >
                          {notification.isRead ? <MarkEmailUnread /> : <MarkEmailRead />}
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(notification.id)}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: `${getPriorityColor(notification.priority)}.light` }}>
                        {getNotificationIcon(notification.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {!notification.isRead && (
                            <Circle sx={{ fontSize: 8, color: 'primary.main' }} />
                          )}
                          <Typography variant="subtitle2" sx={{ fontWeight: notification.isRead ? 400 : 600 }}>
                            {notification.title}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={notification.priority} 
                            color={getPriorityColor(notification.priority) as any}
                            sx={{ height: 20 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="div">
                            {formatTimestamp(notification.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredNotifications.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            {filteredNotifications.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Notifications sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No notifications to display
                </Typography>
              </Box>
            )}
          </Box>
        </TabPanel>

        {/* Activity Logs Tab */}
        <TabPanel value={tabValue} index={1}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">System Activity</Typography>
              <Button size="small" startIcon={<Refresh />}>
                Refresh
              </Button>
            </Box>

            {/* Logs Timeline */}
            <List>
              {mockLogs.map((log, index) => (
                <Box key={log.id}>
                  <ListItem
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'background.paper' }}>
                        {getLogIcon(log.type)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      disableTypography
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {log.action}
                          </Typography>
                          <Chip 
                            size="small" 
                            label={log.status} 
                            color={log.status === 'success' ? 'success' : log.status === 'error' ? 'error' : 'warning'}
                            sx={{ height: 20 }}
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {log.details}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" component="div">
                            By {log.user} • {formatTimestamp(log.timestamp)}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < mockLogs.length - 1 && <Divider />}
                </Box>
              ))}
            </List>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};
