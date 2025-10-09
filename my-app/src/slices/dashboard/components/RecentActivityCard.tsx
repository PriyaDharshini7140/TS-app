
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  Chip,
  Box,
  Button
} from '@mui/material';
import { 
  Add, 
  Assignment, 
  CheckCircle, 
  Comment, 
  Edit,
  MoreHoriz 
} from '@mui/icons-material';
import type { RecentActivity } from '../types';

interface RecentActivityCardProps {
  activities: RecentActivity[];
  isLoading?: boolean;
  onViewAll?: () => void;
}

export const RecentActivityCard: React.FC<RecentActivityCardProps> = ({
  activities,
  isLoading = false,
  onViewAll,
}) => {
  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'ticket_created':
        return <Add sx={{ color: 'primary.main' }} />;
      case 'ticket_assigned':
        return <Assignment sx={{ color: 'info.main' }} />;
      case 'ticket_resolved':
        return <CheckCircle sx={{ color: 'success.main' }} />;
      case 'ticket_updated':
        return <Edit sx={{ color: 'warning.main' }} />;
      case 'comment_added':
        return <Comment sx={{ color: 'secondary.main' }} />;
      default:
        return <MoreHoriz sx={{ color: 'text.secondary' }} />;
    }
  };

  const getActivityColor = (type: RecentActivity['type']) => {
    switch (type) {
      case 'ticket_created':
        return '#8B5CF6';
      case 'ticket_assigned':
        return '#3B82F6';
      case 'ticket_resolved':
        return '#22C55E';
      case 'ticket_updated':
        return '#FBBF24';
      case 'comment_added':
        return '#34D399';
      default:
        return '#6B7280';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (isLoading) {
    return (
      <Card sx={{ height: '100%' }}>
        <CardHeader
          title="Recent Activity"
          titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        />
        <CardContent sx={{ pt: 0 }}>
          <List>
            {Array.from({ length: 5 }).map((_, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'grey.200' }} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ height: 16, bgcolor: 'grey.200', borderRadius: 1, mb: 1 }} />
                  }
                  secondary={
                    <Box sx={{ height: 12, bgcolor: 'grey.200', borderRadius: 1, width: '70%' }} />
                  }
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Recent Activity"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
        action={
          onViewAll && (
            <Button size="small" onClick={onViewAll}>
              View All
            </Button>
          )
        }
      />
      <CardContent sx={{ pt: 0, pb: 2 }}>
        {activities.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No recent activity
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {activities.map((activity, index) => (
              <ListItem 
                key={activity.id} 
                sx={{ 
                  px: 0,
                  borderBottom: index < activities.length - 1 ? '1px solid' : 'none',
                  borderColor: 'divider',
                  pb: index < activities.length - 1 ? 2 : 0,
                  mb: index < activities.length - 1 ? 2 : 0,
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: `${getActivityColor(activity.type)}20`,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {activity.title}
                      </Typography>
                      {activity.ticketId && (
                        <Chip
                          label={activity.ticketId}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            height: 20,
                            fontSize: '0.7rem',
                            borderColor: getActivityColor(activity.type),
                            color: getActivityColor(activity.type),
                          }}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {activity.description}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <span>{activity.user}</span>
                        <span>•</span>
                        <span>{formatTimeAgo(activity.timestamp)}</span>
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};