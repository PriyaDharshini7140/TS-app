import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Tooltip,
  Chip,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { Add, Edit, Delete, People, Security } from '@mui/icons-material';
import { DataGrid, Column, createDateColumn } from '../../../shared/components/DataGrid';

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: string;
}

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access and configuration rights',
    userCount: 3,
    permissions: ['all'],
    isSystemRole: true,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: '2',
    name: 'IT Support Agent',
    description: 'Can manage tickets and assist users',
    userCount: 12,
    permissions: ['tickets.view', 'tickets.create', 'tickets.edit', 'tickets.assign', 'users.view'],
    isSystemRole: true,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: '3',
    name: 'Department Manager',
    description: 'Can view and manage department tickets',
    userCount: 8,
    permissions: ['tickets.view', 'tickets.create', 'reports.view', 'users.view'],
    isSystemRole: true,
    createdAt: '2025-01-01T00:00:00',
  },
  {
    id: '4',
    name: 'End User',
    description: 'Basic user with ticket creation rights',
    userCount: 156,
    permissions: ['tickets.view.own', 'tickets.create'],
    isSystemRole: true,
    createdAt: '2025-01-01T00:00:00',
  },
];

const availablePermissions = [
  { id: 'tickets.view', label: 'View All Tickets', category: 'Tickets' },
  { id: 'tickets.view.own', label: 'View Own Tickets', category: 'Tickets' },
  { id: 'tickets.create', label: 'Create Tickets', category: 'Tickets' },
  { id: 'tickets.edit', label: 'Edit Tickets', category: 'Tickets' },
  { id: 'tickets.delete', label: 'Delete Tickets', category: 'Tickets' },
  { id: 'tickets.assign', label: 'Assign Tickets', category: 'Tickets' },
  { id: 'users.view', label: 'View Users', category: 'Users' },
  { id: 'users.create', label: 'Create Users', category: 'Users' },
  { id: 'users.edit', label: 'Edit Users', category: 'Users' },
  { id: 'users.delete', label: 'Delete Users', category: 'Users' },
  { id: 'departments.view', label: 'View Departments', category: 'Departments' },
  { id: 'departments.edit', label: 'Manage Departments', category: 'Departments' },
  { id: 'reports.view', label: 'View Reports', category: 'Reports' },
  { id: 'reports.export', label: 'Export Reports', category: 'Reports' },
  { id: 'config.view', label: 'View Configuration', category: 'Configuration' },
  { id: 'config.edit', label: 'Edit Configuration', category: 'Configuration' },
  { id: 'sla.view', label: 'View SLA Settings', category: 'SLA' },
  { id: 'sla.edit', label: 'Edit SLA Settings', category: 'SLA' },
];

interface RolesPageProps {
  userRole?: string;
}

export const RolesPage = ({ userRole = 'Admin' }: RolesPageProps) => {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[],
  });

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions,
      });
    } else {
      setEditingRole(null);
      setFormData({ name: '', description: '', permissions: [] });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingRole(null);
    setFormData({ name: '', description: '', permissions: [] });
  };

  const handleSave = () => {
    if (editingRole) {
      setRoles(prev =>
        prev.map(role =>
          role.id === editingRole.id
            ? { ...role, ...formData }
            : role
        )
      );
    } else {
      const newRole: Role = {
        id: String(roles.length + 1),
        ...formData,
        userCount: 0,
        isSystemRole: false,
        createdAt: new Date().toISOString(),
      };
      setRoles(prev => [...prev, newRole]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this role? Users with this role will be unassigned.')) {
      setRoles(prev => prev.filter(role => role.id !== id));
    }
  };

  const handlePermissionToggle = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const groupedPermissions = availablePermissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = [];
    }
    acc[perm.category].push(perm);
    return acc;
  }, {} as Record<string, typeof availablePermissions>);

  const columns: Column[] = [
    {
      field: 'name',
      headerName: 'Role Name',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Security sx={{ color: 'primary.main' }} />
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {params.value}
            </Typography>
            {params.row.isSystemRole && (
              <Chip label="System Role" size="small" color="info" sx={{ mt: 0.5 }} />
            )}
          </Box>
        </Box>
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      minWidth: 250,
    },
    {
      field: 'userCount',
      headerName: 'Users',
      width: 120,
      align: 'center',
      renderCell: (params) => (
        <Chip
          icon={<People />}
          label={params.value}
          size="small"
          color="primary"
        />
      ),
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      width: 150,
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value.includes('all') ? 'All' : params.value.length}
          size="small"
          color="secondary"
        />
      ),
    },
    createDateColumn('createdAt', 'Created', 180),
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      filterable: false,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenDialog(params.row)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.isSystemRole ? 'Cannot delete system role' : 'Delete'}>
            <span>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(params.row.id)}
                disabled={params.row.isSystemRole}
              >
                <Delete fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Role Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage user roles and permissions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Create Role
        </Button>
      </Box>

      {/* DataGrid */}
      <DataGrid
        rows={roles}
        columns={columns}
        pageSize={10}
        enableToolbar={true}
        searchPlaceholder="Search roles..."
        height={600}
      />

      {/* Role Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingRole ? 'Edit Role' : 'Create New Role'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={editingRole?.isSystemRole}
                  helperText={editingRole?.isSystemRole ? 'System roles cannot be renamed' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={2}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Permissions
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Select the permissions for this role
                </Typography>
              </Grid>
              {Object.entries(groupedPermissions).map(([category, perms]) => (
                <Grid item xs={12} sm={6} key={category}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        {category}
                      </Typography>
                      <FormGroup>
                        {perms.map((perm) => (
                          <FormControlLabel
                            key={perm.id}
                            control={
                              <Checkbox
                                checked={formData.permissions.includes(perm.id) || formData.permissions.includes('all')}
                                onChange={() => handlePermissionToggle(perm.id)}
                                disabled={formData.permissions.includes('all')}
                                size="small"
                              />
                            }
                            label={<Typography variant="body2">{perm.label}</Typography>}
                          />
                        ))}
                      </FormGroup>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name || !formData.description}
          >
            {editingRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
