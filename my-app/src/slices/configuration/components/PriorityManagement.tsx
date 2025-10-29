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
} from '@mui/material';
import { Add, Edit, Delete, Check, Close, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { DataGrid, type Column } from '../../../shared/components/DataGrid';

interface Priority {
  id: string;
  name: string;
  description: string;
  color: string;
  slaHours: number;
  order: number;
  isActive: boolean;
  ticketCount: number;
}

const mockPriorities: Priority[] = [
  {
    id: '1',
    name: 'Low',
    description: 'Non-urgent issues that can be resolved within normal business hours',
    color: '#BEE1C3',
    slaHours: 72,
    order: 1,
    isActive: true,
    ticketCount: 34,
  },
  {
    id: '2',
    name: 'Medium',
    description: 'Standard priority for typical issues',
    color: '#A8C5E6',
    slaHours: 48,
    order: 2,
    isActive: true,
    ticketCount: 56,
  },
  {
    id: '3',
    name: 'High',
    description: 'Important issues that need quick attention',
    color: '#FFD54F',
    slaHours: 24,
    order: 3,
    isActive: true,
    ticketCount: 28,
  },
  {
    id: '4',
    name: 'Critical',
    description: 'Urgent issues requiring immediate attention',
    color: '#E57373',
    slaHours: 8,
    order: 4,
    isActive: true,
    ticketCount: 12,
  },
];

export const PriorityManagement = () => {
  const [priorities, setPriorities] = useState<Priority[]>(mockPriorities);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPriority, setEditingPriority] = useState<Priority | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#A8C5E6',
    slaHours: 48,
  });

  const handleOpenDialog = (priority?: Priority) => {
    if (priority) {
      setEditingPriority(priority);
      setFormData({
        name: priority.name,
        description: priority.description,
        color: priority.color,
        slaHours: priority.slaHours,
      });
    } else {
      setEditingPriority(null);
      setFormData({ name: '', description: '', color: '#A8C5E6', slaHours: 48 });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingPriority(null);
    setFormData({ name: '', description: '', color: '#A8C5E6', slaHours: 48 });
  };

  const handleSave = () => {
    if (editingPriority) {
      setPriorities(prev =>
        prev.map(pri =>
          pri.id === editingPriority.id
            ? { ...pri, ...formData }
            : pri
        )
      );
    } else {
      const newPriority: Priority = {
        id: String(priorities.length + 1),
        ...formData,
        order: priorities.length + 1,
        isActive: true,
        ticketCount: 0,
      };
      setPriorities(prev => [...prev, newPriority]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this priority?')) {
      setPriorities(prev => prev.filter(pri => pri.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setPriorities(prev =>
      prev.map(pri =>
        pri.id === id ? { ...pri, isActive: !pri.isActive } : pri
      )
    );
  };

  const handleMoveUp = (id: string) => {
    setPriorities(prev => {
      const index = prev.findIndex(p => p.id === id);
      if (index > 0) {
        const newPriorities = [...prev];
        const temp = newPriorities[index].order;
        newPriorities[index].order = newPriorities[index - 1].order;
        newPriorities[index - 1].order = temp;
        return newPriorities.sort((a, b) => a.order - b.order);
      }
      return prev;
    });
  };

  const handleMoveDown = (id: string) => {
    setPriorities(prev => {
      const index = prev.findIndex(p => p.id === id);
      if (index < prev.length - 1) {
        const newPriorities = [...prev];
        const temp = newPriorities[index].order;
        newPriorities[index].order = newPriorities[index + 1].order;
        newPriorities[index + 1].order = temp;
        return newPriorities.sort((a, b) => a.order - b.order);
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
    },
    {
      field: 'name',
      headerName: 'Priority Name',
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
        </Box>
      ),
    },
    {
      field: 'color',
      headerName: 'Color Badge',
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
      field: 'slaHours',
      headerName: 'SLA Hours',
      width: 120,
      align: 'center',
      renderCell: (params) => (
        <Chip
          label={`${params.value}h`}
          color="info"
          variant="outlined"
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
              disabled={params.row.order === priorities.length}
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
            Priority Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage ticket priorities and SLA response times
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Priority
        </Button>
      </Box>

      <DataGrid
        rows={priorities.sort((a, b) => a.order - b.order)}
        columns={columns}
        pageSize={10}
        enableToolbar={true}
        searchPlaceholder="Search priorities..."
        height={500}
      />

      {/* Priority Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingPriority ? 'Edit Priority' : 'Add New Priority'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Priority Name"
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
              <Grid item xs={12} sm={6}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="SLA Response Hours"
                  value={formData.slaHours}
                  onChange={(e) => setFormData({ ...formData, slaHours: Number(e.target.value) })}
                  required
                  helperText="Hours until response required"
                  inputProps={{ min: 1, max: 168 }}
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
            {editingPriority ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
