import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Add,
  MoreVert,
  Edit,
  Delete,
  Person,
  PersonOff,
  Download,
  Upload,
} from '@mui/icons-material';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { UserFilters } from './UserFilters';
import { BulkActionsBar } from './BulkActionsBar';
import { EmptyState } from '../../../shared/components/EmptyState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { useUsersQuery, useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from '../hooks';
import type { CreateUserData, UpdateUserData } from '../types';
import type { User } from '../../../shared/types';

interface UsersPageProps {
  userRole: string;
}

export const UsersPage = ({ userRole }: UsersPageProps) => {
  const [filters, setFilters] = useState({});
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const { data: users, isLoading, error, refetch } = useUsersQuery(filters);
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const canManageUsers = userRole === 'Admin';

  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await createUserMutation.mutate(userData);
      setUserFormOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUpdateUser = async (userData: UpdateUserData) => {
    try {
      await updateUserMutation.mutate(userData);
      setEditingUser(null);
      setUserFormOpen(false);
      refetch();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteUserMutation.mutate(userToDelete.id);
      setDeleteConfirmOpen(false);
      setUserToDelete(null);
      refetch();
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, user: User) => {
    setMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormOpen(true);
    handleMenuClose();
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setDeleteConfirmOpen(true);
    handleMenuClose();
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSelectionChange = (selected: string[]) => {
    setSelectedUsers(selected);
  };

  if (!canManageUsers) {
    return (
      <Box>
        <Alert severity="warning" sx={{ mb: 3 }}>
          You don't have permission to manage users. Contact your administrator for access.
        </Alert>
      </Box>
    );
  }

  if (isLoading) {
    return <LoadingState variant="card" count={8} />;
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 3 }}>
        Failed to load users. Please try again.
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
            Users Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage system users, roles, and permissions
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Upload />}
            size="large"
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download />}
            size="large"
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            size="large"
            onClick={() => setUserFormOpen(true)}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {users?.length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
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
                    {users?.filter(u => u.isActive).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
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
                    {users?.filter(u => !u.isActive).length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inactive Users
                  </Typography>
                </Box>
                <PersonOff sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
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
                    {users?.filter(u => u.role === 'Admin').length || 0}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Administrators
                  </Typography>
                </Box>
                <Person sx={{ fontSize: 40, color: 'info.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <UserFilters onFiltersChange={handleFiltersChange} />
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <BulkActionsBar
          selectedCount={selectedUsers.length}
          onClear={() => setSelectedUsers([])}
          onBulkAction={(action) => console.log('Bulk action:', action)}
        />
      )}

      {/* Users Table */}
      <Card>
        <CardContent sx={{ p: 0 }}>
          {users && users.length > 0 ? (
            <UserTable
              users={users}
              selectedUsers={selectedUsers}
              onSelectionChange={handleSelectionChange}
              onUserAction={handleMenuOpen}
            />
          ) : (
            <Box sx={{ p: 4 }}>
              <EmptyState
                title="No users found"
                description="Get started by adding your first user to the system."
                actionLabel="Add User"
                onAction={() => setUserFormOpen(true)}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* User Form Dialog */}
      <Dialog
        open={userFormOpen}
        onClose={() => {
          setUserFormOpen(false);
          setEditingUser(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingUser ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <UserForm
            user={editingUser}
            onSubmit={editingUser ? handleUpdateUser : handleCreateUser}
            onCancel={() => {
              setUserFormOpen(false);
              setEditingUser(null);
            }}
            isLoading={createUserMutation.isLoading || updateUserMutation.isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => selectedUser && handleEditUser(selectedUser)}>
          <Edit sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem 
          onClick={() => selectedUser && handleDeleteClick(selectedUser)}
          sx={{ color: 'error.main' }}
        >
          <Delete sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Delete Confirmation */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{userToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDeleteUser} 
            color="error" 
            variant="contained"
            disabled={deleteUserMutation.isLoading}
          >
            {deleteUserMutation.isLoading ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};