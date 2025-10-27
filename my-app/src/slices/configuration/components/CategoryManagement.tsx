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
import { Add, Edit, Delete, Check, Close } from '@mui/icons-material';
import { DataGrid, Column, createDateColumn } from '../../../shared/components/DataGrid';

interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  isActive: boolean;
  ticketCount: number;
  createdAt: string;
}

const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Hardware',
    description: 'Physical equipment issues',
    icon: '🖥️',
    isActive: true,
    ticketCount: 45,
    createdAt: '2025-01-15T10:00:00',
  },
  {
    id: '2',
    name: 'Software',
    description: 'Application and software related issues',
    icon: '💻',
    isActive: true,
    ticketCount: 78,
    createdAt: '2025-01-15T10:00:00',
  },
  {
    id: '3',
    name: 'Network',
    description: 'Network connectivity and access',
    icon: '🌐',
    isActive: true,
    ticketCount: 32,
    createdAt: '2025-01-15T10:00:00',
  },
  {
    id: '4',
    name: 'Security',
    description: 'Security and access control',
    icon: '🔒',
    isActive: true,
    ticketCount: 23,
    createdAt: '2025-01-15T10:00:00',
  },
  {
    id: '5',
    name: 'Access',
    description: 'User access and permissions',
    icon: '🔑',
    isActive: true,
    ticketCount: 56,
    createdAt: '2025-01-15T10:00:00',
  },
  {
    id: '6',
    name: 'Other',
    description: 'General inquiries and other requests',
    icon: '📋',
    isActive: true,
    ticketCount: 12,
    createdAt: '2025-01-15T10:00:00',
  },
];

export const CategoryManagement = () => {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
  });

  const handleOpenDialog = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', icon: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', icon: '' });
  };

  const handleSave = () => {
    if (editingCategory) {
      // Update existing
      setCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, ...formData }
            : cat
        )
      );
    } else {
      // Create new
      const newCategory: Category = {
        id: String(categories.length + 1),
        ...formData,
        isActive: true,
        ticketCount: 0,
        createdAt: new Date().toISOString(),
      };
      setCategories(prev => [...prev, newCategory]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      setCategories(prev => prev.filter(cat => cat.id !== id));
    }
  };

  const handleToggleActive = (id: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id ? { ...cat, isActive: !cat.isActive } : cat
      )
    );
  };

  const columns: Column[] = [
    {
      field: 'icon',
      headerName: 'Icon',
      width: 80,
      align: 'center',
      renderCell: (params) => (
        <span style={{ fontSize: '24px' }}>{params.value}</span>
      ),
    },
    {
      field: 'name',
      headerName: 'Category Name',
      flex: 1,
      minWidth: 150,
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
    createDateColumn('createdAt', 'Created', 180),
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
            Category Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage ticket categories and their settings
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Category
        </Button>
      </Box>

      <DataGrid
        rows={categories}
        columns={columns}
        pageSize={10}
        enableToolbar={true}
        searchPlaceholder="Search categories..."
        height={500}
      />

      {/* Category Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add New Category'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Category Name"
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
                  label="Icon (Emoji)"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="🖥️"
                  helperText="Enter an emoji to represent this category"
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
            {editingCategory ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
