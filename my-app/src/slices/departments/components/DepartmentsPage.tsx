import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  IconButton,
  Chip,
  Avatar,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { 
  Add, 
  Business, 
  People, 
  Person,
  ExpandMore,
  ExpandLess,
  AccountTree,
  ViewList,
  Edit,
  Delete,
} from '@mui/icons-material';
import { EmptyState } from '../../../shared/components/EmptyState';
import { LoadingState } from '../../../shared/components/LoadingState';
import { Department } from '../../../shared/types';

interface DepartmentsPageProps {
  userRole: string;
}

interface DepartmentNode extends Department {
  parentId?: string;
  managerName?: string;
  children?: DepartmentNode[];
}

// Mock departments data with hierarchy
const mockDepartments: DepartmentNode[] = [
  {
    id: '1',
    name: 'Information Technology',
    description: 'Manages all IT infrastructure and support services',
    managerId: '1',
    managerName: 'John Smith',
    memberCount: 12,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '1.1',
    name: 'IT Support',
    description: 'Technical support and helpdesk services',
    managerId: '2',
    managerName: 'Jane Doe',
    memberCount: 6,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    parentId: '1',
  },
  {
    id: '1.2',
    name: 'Software Development',
    description: 'Application development and maintenance',
    managerId: '3',
    managerName: 'Bob Wilson',
    memberCount: 6,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    parentId: '1',
  },
  {
    id: '2',
    name: 'Human Resources',
    description: 'Handles employee relations and organizational development',
    managerId: '4',
    managerName: 'Alice Johnson',
    memberCount: 8,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2.1',
    name: 'Recruitment',
    description: 'Talent acquisition and onboarding',
    managerId: '5',
    managerName: 'Charlie Brown',
    memberCount: 4,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    parentId: '2',
  },
  {
    id: '3',
    name: 'Finance',
    description: 'Financial planning and accounting operations',
    managerId: '6',
    managerName: 'Diana Prince',
    memberCount: 15,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    name: 'Marketing',
    description: 'Brand management and customer acquisition',
    managerId: '7',
    managerName: 'Eve Davis',
    memberCount: 10,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
  },
];

// Build hierarchy tree
const buildDepartmentTree = (departments: DepartmentNode[]): DepartmentNode[] => {
  const tree: DepartmentNode[] = [];
  const map = new Map<string, DepartmentNode>();

  // Create a map of all departments
  departments.forEach(dept => {
    map.set(dept.id, { ...dept, children: [] });
  });

  // Build the tree
  map.forEach(dept => {
    if (dept.parentId) {
      const parent = map.get(dept.parentId);
      if (parent) {
        parent.children!.push(dept);
      }
    } else {
      tree.push(dept);
    }
  });

  return tree;
};

// Tree view component
interface TreeNodeProps {
  node: DepartmentNode;
  level: number;
  onEdit?: (dept: DepartmentNode) => void;
  onDelete?: (dept: DepartmentNode) => void;
}

const TreeNode = ({ node, level, onEdit, onDelete }: TreeNodeProps) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <>
      <ListItem
        sx={{
          pl: 2 + level * 4,
          borderRadius: 1,
          mb: 0.5,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <ListItemIcon sx={{ minWidth: 40 }}>
          {hasChildren ? (
            <IconButton
              size="small"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          ) : (
            <Box sx={{ width: 40 }} />
          )}
        </ListItemIcon>
        <ListItemIcon sx={{ minWidth: 40 }}>
          <Business color="primary" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography component="div" variant="body1" sx={{ fontWeight: 600 }}>
                {node.name}
              </Typography>
              <Chip label={`${node.memberCount} members`} size="small" color="primary" />
              {!node.isActive && <Chip label="Inactive" size="small" />}
            </Box>
          }
          secondary={
            <Box component="div" sx={{ mt: 0.5 }}>
              <Typography component="div" variant="body2" color="text.secondary">
                {node.description}
              </Typography>
              {node.managerName && (
                <Box component="div" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Person sx={{ fontSize: 16 }} />
                  <Typography component="span" variant="caption" color="text.secondary">
                    Manager: {node.managerName}
                  </Typography>
                </Box>
              )}
            </Box>
          }
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" color="primary" onClick={() => onEdit?.(node)}>
            <Edit fontSize="small" />
          </IconButton>
          <IconButton size="small" color="error" onClick={() => onDelete?.(node)}>
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </ListItem>
      {hasChildren && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <List disablePadding>
            {node.children!.map(child => (
              <TreeNode
                key={child.id}
                node={child}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </List>
        </Collapse>
      )}
    </>
  );
};

export const DepartmentsPage: React.FC<DepartmentsPageProps> = ({ userRole }) => {
  const [departments] = useState<DepartmentNode[]>(mockDepartments);
  const [isLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'tree' | 'grid'>('tree');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<DepartmentNode | null>(null);

  const canManageDepartments = userRole === 'Admin';
  const departmentTree = buildDepartmentTree(departments);

  const handleEdit = (dept: DepartmentNode) => {
    setEditingDepartment(dept);
    setDialogOpen(true);
  };

  const handleDelete = (dept: DepartmentNode) => {
    if (confirm(`Are you sure you want to delete ${dept.name}?`)) {
      console.log('Delete department:', dept.id);
    }
  };

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
            Manage organizational departments and their hierarchy
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Tabs value={viewMode} onChange={(_, value) => setViewMode(value)}>
            <Tab icon={<AccountTree />} iconPosition="start" label="Tree View" value="tree" />
            <Tab icon={<ViewList />} iconPosition="start" label="Grid View" value="grid" />
          </Tabs>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setEditingDepartment(null);
              setDialogOpen(true);
            }}
          >
            Add Department
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

      {/* Tree View */}
      {viewMode === 'tree' && (
        <Paper sx={{ p: 2 }}>
          <List>
            {departmentTree.map(node => (
              <TreeNode
                key={node.id}
                node={node}
                level={0}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </List>
        </Paper>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
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
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Business sx={{ fontSize: 32, color: 'primary.main', mr: 2 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {department.name}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" color="primary" onClick={() => handleEdit(department)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete(department)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {department.description}
                  </Typography>

                  {department.managerName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
                        {department.managerName.charAt(0)}
                      </Avatar>
                      <Typography variant="caption" color="text.secondary">
                        Manager: {department.managerName}
                      </Typography>
                    </Box>
                  )}
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Chip 
                      icon={<People />}
                      label={`${department.memberCount} members`}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={department.isActive ? 'Active' : 'Inactive'}
                      size="small"
                      color={department.isActive ? 'success' : 'default'}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {departments.length === 0 && (
        <Box sx={{ mt: 4 }}>
          <EmptyState
            title="No departments found"
            description="Get started by creating your first department."
            actionLabel="Add Department"
            onAction={() => setDialogOpen(true)}
          />
        </Box>
      )}

      {/* Department Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingDepartment ? 'Edit Department' : 'Add New Department'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Department Name"
                  defaultValue={editingDepartment?.name}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  defaultValue={editingDepartment?.description}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Parent Department (Optional)"
                  defaultValue={editingDepartment?.parentId || ''}
                  SelectProps={{ native: true }}
                >
                  <option value="">None (Top Level)</option>
                  {departments.filter(d => d.id !== editingDepartment?.id).map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Manager Name"
                  defaultValue={editingDepartment?.managerName}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => setDialogOpen(false)}>
            {editingDepartment ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};