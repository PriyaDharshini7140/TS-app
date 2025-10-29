import { useState } from 'react';
import {
  Box,
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
  Typography,
  Switch,
  FormControlLabel,
} from '@mui/material';
import { Add, Edit, Delete, Check, Close, ArrowUpward, ArrowDownward, DragIndicator } from '@mui/icons-material';
import { DataGrid, type Column } from '../../../shared/components/DataGrid';

interface Status {
  id: string;
  name: string;
  description: string;
  color: string;
  order: number;
  isActive: boolean;
  isDefaultStatus: boolean;
  canTransitionTo: string[];
  ticketCount: number;
}

const mockStatuses: Status[] = [
  {
    id: '1',
    name: 'Open',
    description: 'Newly created ticket awaiting assignment',
    color: '#A8C5E6',
    order: 1,
    isActive: true,
    isDefaultStatus: true,
    canTransitionTo: ['2', '3', '5'],
    ticketCount: 45,
  },
  {
    id: '2',
    name: 'In Progress',
    description: 'Ticket is being worked on',
    color: '#90CAF9',
    order: 2,
    isActive: true,
    isDefaultStatus: false,
    canTransitionTo: ['3', '4'],
    ticketCount: 28,
  },
  {
    id: '3',
    name: 'Waiting',
    description: 'Waiting for customer response or external dependency',
    color: '#FFD54F',
    order: 3,
    isActive: true,
    isDefaultStatus: false,
    canTransitionTo: ['2', '4', '5'],
    ticketCount: 12,
  },
  {
    id: '4',
    name: 'Resolved',
    description: 'Issue has been resolved',
    color: '#BEE1C3',
    order: 4,
    isActive: true,
    isDefaultStatus: false,
    canTransitionTo: ['2', '5'],
    ticketCount: 89,
  },
  {
    id: '5',
    name: 'Closed',
    description: 'Ticket is closed and archived',
    color: '#9E9E9E',
    order: 5,
    isActive: true,
    isDefaultStatus: false,
    canTransitionTo: [],
    ticketCount: 156,
  },
];

export const StatusManagement = () => {
  const [statuses, setStatuses] = useState<Status[]>(mockStatuses);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#A8C5E6',
    isDefaultStatus: false,
  });

  const handleOpenDialog = (status?: Status) => {
    if (status) {
      setEditingStatus(status);
      setFormData({
        name: status.name,
        description: status.description,
        color: status.color,
        isDefaultStatus: status.isDefaultStatus,
      });
    } else {
      setEditingStatus(null);
      setFormData({ name: '', description: '', color: '#A8C5E6', isDefaultStatus: false });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingStatus(null);
    setFormData({ name: '', description: '', color: '#A8C5E6', isDefaultStatus: false });
  };

  const handleSave = () => {
    if (editingStatus) {
      setStatuses(prev =>
        prev.map(status =>
          status.id === editingStatus.id
            ? { ...status, ...formData }
            : status
        )
      );
    } else {
      const newStatus: Status = {
        id: String(statuses.length + 1),
        ...formData,
        order: statuses.length + 1,
        isActive: true,
        canTransitionTo: [],
        ticketCount: 0,
      };
      setStatuses(prev => [...prev, newStatus]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this status?')) {
      setStatuses(prev => prev.filter(status => status.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setStatuses(prev =>
      prev.map(status =>
        status.id === id ? { ...status, isActive: !status.isActive } : status
      )
    );
  };

  const handleMoveUp = (id: string) => {
    setStatuses(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index > 0) {
        const newStatuses = [...prev];
        const temp = newStatuses[index].order;
        newStatuses[index].order = newStatuses[index - 1].order;
        newStatuses[index - 1].order = temp;
        return newStatuses.sort((a, b) => a.order - b.order);
      }
      return prev;
    });
  };

  const handleMoveDown = (id: string) => {
    setStatuses(prev => {
      const index = prev.findIndex(s => s.id === id);
      if (index < prev.length - 1) {
        const newStatuses = [...prev];
        const temp = newStatuses[index].order;
        newStatuses[index].order = newStatuses[index + 1].order;
        newStatuses[index + 1].order = temp;
        return newStatuses.sort((a, b) => a.order - b.order);
      }
      return prev;
    });
  };

  const columns: Column[] = [
    {
      field: 'order',
      headerName: 'Order',
      width: 80,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <DragIndicator sx={{ color: 'text.secondary', fontSize: 18 }} />
          <Typography variant="body2">{params.value}</Typography>
        </Box>
      ),
    },
    {
      field: 'name',
      headerName: 'Status Name',
      width: 150,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              bgcolor: params.row.color,
              border: '2px solid',
              borderColor: 'background.paper',
            }}
          />
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {params.value}
          </Typography>
          {params.row.isDefaultStatus && (
            <Chip label="Default" size="small" color="info" sx={{ ml: 0.5 }} />
          )}
        </Box>
      ),
    },
    {
      field: 'color',
      headerName: 'Color',
      width: 120,
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          sx={{
            bgcolor: params.value,
            color: 'text.primary',
            fontFamily: 'monospace',
            fontSize: '0.75rem',
          }}
          size="small"
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 1,
      minWidth: 250,
    },
    {
      field: 'ticketCount',
      headerName: 'Tickets',
      width: 100,
      align: 'center',
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" />
      ),
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
          icon={params.value ? <Check /> : <Close />}
        />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      sortable: false,
      filterable: false,
      align: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Move Up">
            <IconButton
              size="small"
              onClick={() => handleMoveUp(params.row.id)}
              disabled={params.row.order === 1}
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Down">
            <IconButton
              size="small"
              onClick={() => handleMoveDown(params.row.id)}
              disabled={params.row.order === statuses.length}
            >
              <ArrowDownward fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenDialog(params.row)}
            >
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.isActive ? 'Deactivate' : 'Activate'}>
            <IconButton
              size="small"
              color={params.row.isActive ? 'warning' : 'success'}
              onClick={() => handleToggleActive(params.row.id)}
            >
              {params.row.isActive ? <Close fontSize="small" /> : <Check fontSize="small" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDelete(params.row.id)}
              disabled={params.row.isDefaultStatus}
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6" gutterBottom>
            Status Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage ticket statuses and workflow transitions
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Status
        </Button>
      </Box>

      <DataGrid
        rows={statuses.sort((a, b) => a.order - b.order)}
        columns={columns}
        pageSize={10}
        enableToolbar={true}
        searchPlaceholder="Search statuses..."
        height={500}
      />

      {/* Status Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingStatus ? 'Edit Status' : 'Add New Status'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Status Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Color (Hex)"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="#A8C5E6"
                  helperText="Enter hex color code"
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          width: 24,
                          height: 24,
                          borderRadius: 1,
                          bgcolor: formData.color,
                          mr: 1,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isDefaultStatus}
                      onChange={(e) => setFormData({ ...formData, isDefaultStatus: e.target.checked })}
                    />
                  }
                  label="Set as default status for new tickets"
                />
              </Grid>
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
            {editingStatus ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
