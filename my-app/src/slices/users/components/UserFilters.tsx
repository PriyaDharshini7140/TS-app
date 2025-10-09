import { useState } from 'react';
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Grid,
  InputAdornment,
} from '@mui/material';
import { Search, FilterList, Clear } from '@mui/icons-material';

interface UserFiltersProps {
  onFiltersChange: (filters: any) => void;
}

export const UserFilters: React.FC<UserFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    department: '',
    isActive: '',
  });

  const roles = ['Admin', 'IT Support Agent', 'Department Manager', 'End User'];
  const departments = [
    'IT',
    'Human Resources', 
    'Finance',
    'Marketing',
    'Sales',
    'Operations',
    'Customer Support',
    'Engineering',
    'Legal',
    'Executive',
  ];

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    
    // Convert string values to appropriate types for API
    const apiFilters: any = { ...newFilters };
    if (apiFilters.isActive === 'true') apiFilters.isActive = true;
    else if (apiFilters.isActive === 'false') apiFilters.isActive = false;
    else delete apiFilters.isActive;
    
    // Remove empty filters
    Object.keys(apiFilters).forEach(key => {
      if (!apiFilters[key]) delete apiFilters[key];
    });
    
    onFiltersChange(apiFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      role: '',
      department: '',
      isActive: '',
    };
    setFilters(clearedFilters);
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some(value => value);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search users..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Role"
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Department"
            value={filters.department}
            onChange={(e) => handleFilterChange('department', e.target.value)}
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2}>
          <TextField
            fullWidth
            select
            size="small"
            label="Status"
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
          >
            <MenuItem value="">All Users</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </TextField>
        </Grid>
        
        <Grid item xs={12} sm={12} md={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              disabled={!hasActiveFilters}
            >
              Filter
            </Button>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};