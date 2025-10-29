import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import {
  Add,
  FilterList,
  Refresh,
  Visibility,
  Edit,
  Delete,
  Close,
} from '@mui/icons-material';
import type { Ticket, TicketStatus, TicketPriority } from '../../../shared/types';
import { DataGrid,  createDateColumn, type Column } from '../../../shared/components/DataGrid';
import { CreateTicketForm } from './CreateTicketForm';

interface TicketsPageProps {}

// Mock data
const mockTickets = [
  {
    id: 'TKT-001',
    title: 'Email not working',
    status: 'Open' as TicketStatus,
    priority: 'High' as TicketPriority,
    category: 'Software',
    reportedBy: 'John Doe',
    assignedTo: 'Jane Smith',
    department: 'IT',
    createdAt: '2025-10-09T10:30:00',
    updatedAt: '2025-10-09T10:30:00',
  },
  {
    id: 'TKT-002',
    title: 'Printer not responding',
    status: 'In Progress' as TicketStatus,
    priority: 'Medium' as TicketPriority,
    category: 'Hardware',
    reportedBy: 'Alice Johnson',
    assignedTo: 'Bob Williams',
    department: 'Finance',
    createdAt: '2025-10-08T14:20:00',
    updatedAt: '2025-10-09T09:15:00',
  },
  {
    id: 'TKT-003',
    title: 'VPN connection issues',
    status: 'Waiting' as TicketStatus,
    priority: 'Critical' as TicketPriority,
    category: 'Network',
    reportedBy: 'Charlie Brown',
    assignedTo: 'Diana Prince',
    department: 'Sales',
    createdAt: '2025-10-07T11:00:00',
    updatedAt: '2025-10-09T08:00:00',
  },
  {
    id: 'TKT-004',
    title: 'Software installation request',
    status: 'Resolved' as TicketStatus,
    priority: 'Low' as TicketPriority,
    category: 'Software',
    reportedBy: 'Eve Davis',
    assignedTo: 'Frank Miller',
    department: 'Marketing',
    createdAt: '2025-10-06T09:45:00',
    updatedAt: '2025-10-08T16:30:00',
  },
  {
    id: 'TKT-005',
    title: 'Account access issue',
    status: 'Open' as TicketStatus,
    priority: 'High' as TicketPriority,
    category: 'Access',
    reportedBy: 'George Wilson',
    assignedTo: 'Unassigned',
    department: 'HR',
    createdAt: '2025-10-09T08:15:00',
    updatedAt: '2025-10-09T08:15:00',
  },
];

const statusColors: Record<TicketStatus, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  'Open': 'primary',
  'In Progress': 'info',
  'Waiting': 'warning',
  'Resolved': 'success',
  'Closed': 'default',
};

const priorityColors: Record<TicketPriority, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'> = {
  'Low': 'default',
  'Medium': 'info',
  'High': 'warning',
  'Critical': 'error',
};

export const TicketsPage = ({}: TicketsPageProps) => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateTicket = () => {
    setCreateDialogOpen(false);
    // Refresh tickets list here
  };

  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const columns: Column[] = [
    {
      field: 'id',
      headerName: 'Ticket ID',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value as TicketStatus]}
          size="small"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'priority',
      headerName: 'Priority',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={priorityColors[params.value as TicketPriority]}
          size="small"
          variant="outlined"
          sx={{ fontWeight: 500 }}
        />
      ),
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 130,
    },
    {
      field: 'assignedTo',
      headerName: 'Assigned To',
      width: 150,
    },
    {
      field: 'department',
      headerName: 'Department',
      width: 130,
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
          <Tooltip title="View Details">
            <IconButton
              size="small"
              color="primary"
              onClick={() => navigate(`/tickets/${params.row.id}`)}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" color="primary">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error">
              <Delete fontSize="small" />
            </IconButton>
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
            Tickets
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track support tickets
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Create Ticket
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Waiting">Waiting</MenuItem>
              <MenuItem value="Resolved">Resolved</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              select
              fullWidth
              label="Priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <MenuItem value="all">All Priorities</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Critical">Critical</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Tooltip title="Refresh">
                <IconButton color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="More Filters">
                <IconButton color="primary">
                  <FilterList />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* DataGrid */}
      <DataGrid
        rows={filteredTickets}
        columns={columns}
        pageSize={10}
        checkboxSelection
        onRowSelectionChange={setSelected}
        enableToolbar={true}
        searchPlaceholder="Search tickets by ID, title, or assignee..."
        height={600}
      />

      {/* Create Ticket Dialog */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '90vh',
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1,
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              Create New Ticket
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Submit a new support request
            </Typography>
          </Box>
          <IconButton 
            onClick={() => setCreateDialogOpen(false)}
            sx={{ color: 'text.secondary' }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <CreateTicketForm onSuccess={handleCreateTicket} onCancel={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </Box>
  );
};
