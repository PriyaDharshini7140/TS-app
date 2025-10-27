import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
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
import { Add, Edit, Delete, Check, Close } from '@mui/icons-material';
import { DataGrid, Column } from '../../../shared/components/DataGrid';

interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  description: string;
  isActive: boolean;
  ticketCount: number;
}

const categories = [
  { id: '1', name: 'Hardware' },
  { id: '2', name: 'Software' },
  { id: '3', name: 'Network' },
  { id: '4', name: 'Security' },
  { id: '5', name: 'Access' },
  { id: '6', name: 'Other' },
];

const mockSubcategories: Subcategory[] = [
  { id: '1', name: 'Computer', categoryId: '1', categoryName: 'Hardware', description: 'Desktop and laptop issues', isActive: true, ticketCount: 15 },
  { id: '2', name: 'Printer', categoryId: '1', categoryName: 'Hardware', description: 'Printer related issues', isActive: true, ticketCount: 12 },
  { id: '3', name: 'Monitor', categoryId: '1', categoryName: 'Hardware', description: 'Display issues', isActive: true, ticketCount: 8 },
  { id: '4', name: 'Application', categoryId: '2', categoryName: 'Software', description: 'Application errors', isActive: true, ticketCount: 34 },
  { id: '5', name: 'Operating System', categoryId: '2', categoryName: 'Software', description: 'OS related issues', isActive: true, ticketCount: 23 },
  { id: '6', name: 'License', categoryId: '2', categoryName: 'Software', description: 'Software licensing', isActive: true, ticketCount: 11 },
  { id: '7', name: 'WiFi', categoryId: '3', categoryName: 'Network', description: 'Wireless connectivity', isActive: true, ticketCount: 18 },
  { id: '8', name: 'VPN', categoryId: '3', categoryName: 'Network', description: 'VPN connection issues', isActive: true, ticketCount: 9 },
  { id: '9', name: 'Email', categoryId: '3', categoryName: 'Network', description: 'Email connectivity', isActive: true, ticketCount: 5 },
  { id: '10', name: 'Password Reset', categoryId: '4', categoryName: 'Security', description: 'Password related requests', isActive: true, ticketCount: 19 },
];

export const SubcategoryManagement = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>(mockSubcategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    description: '',
  });
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredSubcategories = categoryFilter === 'all'
    ? subcategories
    : subcategories.filter(sub => sub.categoryId === categoryFilter);

  const handleOpenDialog = (subcategory?: Subcategory) => {
    if (subcategory) {
      setEditingSubcategory(subcategory);
      setFormData({
        name: subcategory.name,
        categoryId: subcategory.categoryId,
        description: subcategory.description,
      });
    } else {
      setEditingSubcategory(null);
      setFormData({ name: '', categoryId: '', description: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingSubcategory(null);
    setFormData({ name: '', categoryId: '', description: '' });
  };

  const handleSave = () => {
    const category = categories.find(cat => cat.id === formData.categoryId);
    if (editingSubcategory) {
      setSubcategories(prev =>
        prev.map(sub =>
          sub.id === editingSubcategory.id
            ? { ...sub, ...formData, categoryName: category?.name || '' }
            : sub
        )
      );
    } else {
      const newSubcategory: Subcategory = {
        id: String(subcategories.length + 1),
        ...formData,
        categoryName: category?.name || '',
        isActive: true,
        ticketCount: 0,
      };
      setSubcategories(prev => [...prev, newSubcategory]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this subcategory?')) {
      setSubcategories(prev => prev.filter(sub => sub.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setSubcategories(prev =>
      prev.map(sub =>
        sub.id === id ? { ...sub, isActive: !sub.isActive } : sub
      )
    );
  };

  const columns: Column[] = [
    {
      field: 'name',
      headerName: 'Subcategory Name',
      flex: 1,
      minWidth: 180,
    },
    {
      field: 'categoryName',
      headerName: 'Parent Category',
      width: 150,
      renderCell: (params) => (
        <Chip label={params.value} size="small" color="primary" variant="outlined" />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
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
      width: 150,
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
            Subcategory Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage subcategories under parent categories
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            select
            size="small"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="all">All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Add Subcategory
          </Button>
        </Box>
      </Box>

      <DataGrid
        rows={filteredSubcategories}
        columns={columns}
        pageSize={10}
        enableToolbar={true}
        searchPlaceholder="Search subcategories..."
        height={500}
      />

      {/* Subcategory Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Parent Category"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Subcategory Name"
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
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name || !formData.categoryId || !formData.description}
          >
            {editingSubcategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
