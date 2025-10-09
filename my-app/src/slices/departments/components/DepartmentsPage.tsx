import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
} from '@mui/material';
import { Add, Business, People, Person } from '@mui/icons-material';
import { EmptyState } from '../../../shared/components/EmptyState';
import { LoadingState } from '../../../shared/components/LoadingState';
import type { Department } from '../../../shared/types';

interface DepartmentsPageProps {
  userRole: string;
}

// Mock departments data
const mockDepartments: Department[] = [
  {
    id: '1',
    name: 'Information Technology',
    description: 'Manages all IT infrastructure and support services',
    managerId: '1',
    memberCount: 12,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Human Resources',
    description: 'Handles employee relations and organizational development',
    managerId: '3',
    memberCount: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    name: 'Finance',
    description: 'Financial planning and accounting operations',
    managerId: '4',
    memberCount: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Marketing',
    description: 'Brand management and customer acquisition',
    managerId: '5',
    memberCount: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ userRole }) => {
  const [departments] = useState<Department[]>(mockDepartments);
  const [isLoading] = useState(false);

  const canManageDepartments = userRole === 'Admin';

  if (!canManageDepartments) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You don't have permission to manage departments. Contact your administrator for access.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingState variant="card" count={6} />;
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Departments Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage organizational departments and their settings
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          Add Department
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {departments.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Departments
                  </Typography>
                </Box>
                <Business sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {departments.filter(d => d.isActive).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Departments
                  </Typography>
                </Box>
                <Business sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main' }}>
                    {departments.reduce((sum, d) => sum + d.memberCount, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Members
                  </Typography>
                </Box>
                <People sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {Math.round(departments.reduce((sum, d) => sum + d.memberCount, 0) / departments.length)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg Team Size
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Departments Grid */}
      <Grid container spacing={3}>
        {departments.map((department) => (
          <Grid item xs={12} sm={6} md={4} key={department.id}>
            <Card 
              sx={{ 
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Business sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {department.name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {department.description}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {department.memberCount} members
                  </Typography>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      px: 1, 
                      py: 0.5, 
                      borderRadius: 1, 
                      bgcolor: department.isActive ? 'success.light' : 'grey.300',
                      color: department.isActive ? 'success.dark' : 'grey.600',
                    }}
                  >
                    {department.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {departments.length === 0 && (
        <Box sx={{ mt: 4 }}>
          <EmptyState
            title="No departments found"
            description="Get started by creating your first department."
            actionLabel="Add Department"
            onAction={() => console.log('Add department')}
          />
        </Box>
      )}
    </Box>
  );
};