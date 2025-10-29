import { Avatar, Chip, IconButton, Typography, Box } from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { DataGrid, createDateColumn, type Column } from '../../../shared/components/DataGrid';
import type { User } from '../../../shared/types';

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  onSelectionChange: (selected: string[]) => void;
  onUserAction: (event: React.MouseEvent<HTMLElement>, user: User) => void;
  isLoading?: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  selectedUsers,
  onSelectionChange,
  onUserAction,
  isLoading = false,
}) => {
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'IT Support Agent':
        return 'primary';
      case 'Department Manager':
        return 'secondary';
      case 'End User':
        return 'default';
      default:
        return 'default';
    }
  };

  const columns: Column<User>[] = [
    {
      field: 'name',
      headerName: 'User',
      flex: 1,
      minWidth: 250,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: 40,
              height: 40,
            }}
          >
            {params.row.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              {params.row.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      field: 'role',
      headerName: 'Role',
      width: 180,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getRoleColor(params.value) as any}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 150,
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value ? 'Active' : 'Inactive'}
          color={params.value ? 'success' : 'default'}
          size="small"
        />
      ),
    },
    createDateColumn('lastLogin', 'Last Login', 180),
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      align: 'center',
      renderCell: (params) => (
        <IconButton
          onClick={(e) => onUserAction(e, params.row as User)}
          size="small"
        >
          <MoreVert />
        </IconButton>
      ),
    },
  ];

  return (
    <DataGrid
      rows={users}
      columns={columns}
      loading={isLoading}
      pageSize={10}
      checkboxSelection
      onRowSelectionChange={onSelectionChange}
      enableToolbar={true}
      searchPlaceholder="Search users by name, email, role..."
      height={600}
    />
  );
};
