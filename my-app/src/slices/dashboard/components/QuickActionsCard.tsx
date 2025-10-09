
import { Card, CardContent, CardHeader, Typography, Button, Box, Avatar } from '@mui/material';
import { Add, Assignment, People, Analytics } from '@mui/icons-material';

interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  color: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
  onClick: () => void;
}

interface QuickActionsCardProps {
  onCreateTicket: () => void;
  onAssignTicket: () => void;
  onViewReports: () => void;
  onManageUsers: () => void;
  userRole: string;
}

export const QuickActionsCard: React.FC<QuickActionsCardProps> = ({
  onCreateTicket,
  onAssignTicket,
  onViewReports,
  onManageUsers,
  userRole,
}) => {
  const getActionsForRole = (role: string): QuickAction[] => {
    const baseActions: QuickAction[] = [
      {
        id: 'create-ticket',
        label: 'Create Ticket',
        description: 'Submit a new support request',
        icon: Add,
        color: 'primary',
        onClick: onCreateTicket,
      },
    ];

    if (role === 'Admin' || role === 'IT Support Agent') {
      baseActions.push({
        id: 'assign-ticket',
        label: 'Assign Tickets',
        description: 'Manage ticket assignments',
        icon: Assignment,
        color: 'secondary',
        onClick: onAssignTicket,
      });
    }

    if (role === 'Admin' || role === 'Department Manager') {
      baseActions.push({
        id: 'view-reports',
        label: 'View Reports',
        description: 'Access analytics and insights',
        icon: Analytics,
        color: 'info',
        onClick: onViewReports,
      });
    }

    if (role === 'Admin') {
      baseActions.push({
        id: 'manage-users',
        label: 'Manage Users',
        description: 'Add and manage system users',
        icon: People,
        color: 'warning',
        onClick: onManageUsers,
      });
    }

    return baseActions;
  };

  const actions = getActionsForRole(userRole);

  const getColorValue = (colorName: string) => {
    const colorMap = {
      primary: '#8B5CF6',
      secondary: '#34D399',
      info: '#3B82F6',
      warning: '#FBBF24',
      error: '#FB7185',
      success: '#22C55E',
    };
    return colorMap[colorName as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <Card sx={{ height: '100%' }}>
      <CardHeader
        title="Quick Actions"
        titleTypographyProps={{ variant: 'h6', fontWeight: 600 }}
      />
      <CardContent sx={{ pt: 0 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {actions.map((action) => {
            const Icon = action.icon;
            const colorValue = getColorValue(action.color);
            
            return (
              <Button
                key={action.id}
                variant="outlined"
                size="large"
                onClick={action.onClick}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  borderColor: `${colorValue}30`,
                  backgroundColor: `${colorValue}08`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: `${colorValue}50`,
                    backgroundColor: `${colorValue}15`,
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.2s ease',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: colorValue,
                    width: 40,
                    height: 40,
                    mr: 2,
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                </Avatar>
                <Box sx={{ textAlign: 'left', flex: 1 }}>
                  <Typography 
                    variant="subtitle1" 
                    sx={{ 
                      fontWeight: 600,
                      color: 'text.primary',
                      mb: 0.5,
                    }}
                  >
                    {action.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.2 }}
                  >
                    {action.description}
                  </Typography>
                </Box>
              </Button>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};