import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  TextField,
  Avatar,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Delete,
  AttachFile,
  Send,
  Person,
  CalendarToday,
  Category,
  PriorityHigh,
  Assignment,
} from '@mui/icons-material';
import type { TicketStatus, TicketPriority } from '../../../shared/types';

interface TicketDetailsPageProps {
  ticketId?: string | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

// Mock data
const mockTicket = {
  id: 'TKT-001',
  title: 'Email not working',
  description: 'I cannot send or receive emails since this morning. The application shows "Connection timeout" error whenever I try to access my inbox.',
  status: 'Open' as TicketStatus,
  priority: 'High' as TicketPriority,
  category: 'Software',
  reportedBy: 'John Doe',
  reportedByEmail: 'john.doe@company.com',
  assignedTo: 'Jane Smith',
  assignedToEmail: 'jane.smith@company.com',
  department: 'IT',
  createdAt: '2025-10-09T10:30:00',
  updatedAt: '2025-10-09T10:30:00',
  dueDate: '2025-10-12T17:00:00',
  tags: ['email', 'urgent', 'software'],
  comments: [
    {
      id: '1',
      author: 'Jane Smith',
      role: 'IT Support Agent',
      content: 'I\'ve received your ticket. Looking into the issue now.',
      createdAt: '2025-10-09T10:35:00',
      isInternal: false,
    },
    {
      id: '2',
      author: 'Jane Smith',
      role: 'IT Support Agent',
      content: 'Checked the email server logs. No issues on our end.',
      createdAt: '2025-10-09T11:00:00',
      isInternal: true,
    },
  ],
  attachments: [
    {
      id: '1',
      filename: 'error-screenshot.png',
      fileSize: 245678,
      uploadedBy: 'John Doe',
      uploadedAt: '2025-10-09T10:30:00',
    },
  ],
  history: [
    {
      id: '1',
      action: 'Ticket created',
      user: 'John Doe',
      timestamp: '2025-10-09T10:30:00',
    },
    {
      id: '2',
      action: 'Assigned to Jane Smith',
      user: 'System',
      timestamp: '2025-10-09T10:32:00',
    },
  ],
};

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

export const TicketDetailsPage = ({ ticketId: propTicketId }: TicketDetailsPageProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const ticketId = propTicketId || params.id;
  const [comment, setComment] = useState('');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/tickets')}
              variant="outlined"
            >
              Back
            </Button>
            <Typography variant="h5" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {mockTicket.id}
            </Typography>
            <Chip
              label={mockTicket.status}
              color={statusColors[mockTicket.status]}
              size="small"
            />
            <Chip
              label={mockTicket.priority}
              color={priorityColors[mockTicket.priority]}
              size="small"
              variant="outlined"
            />
          </Box>
          <Typography variant="h4" gutterBottom>
            {mockTicket.title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" startIcon={<Edit />}>
            Edit
          </Button>
          <Button variant="outlined" color="error" startIcon={<Delete />}>
            Delete
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {mockTicket.description}
            </Typography>
            
            {mockTicket.tags.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                {mockTicket.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" variant="outlined" />
                ))}
              </Box>
            )}
          </Paper>

          {/* Tabs */}
          <Paper>
            <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Comments" />
              <Tab label="Attachments" />
              <Tab label="History" />
            </Tabs>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ p: 3 }}>
                {/* Comments List */}
                <List>
                  {mockTicket.comments.map((comment) => (
                    <ListItem key={comment.id} alignItems="flex-start" sx={{ px: 0, py: 2 }}>
                      <ListItemAvatar>
                        <Avatar>{comment.author.charAt(0)}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box>
                              <Typography variant="subtitle2" component="span">
                                {comment.author}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" component="span" sx={{ ml: 1 }}>
                                {comment.role}
                              </Typography>
                              {comment.isInternal && (
                                <Chip label="Internal" size="small" color="warning" sx={{ ml: 1, height: 20 }} />
                              )}
                            </Box>
                            <Typography variant="caption" color="text.secondary">
                              {formatDate(comment.createdAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
                            {comment.content}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                {/* Add Comment */}
                <Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="outlined" startIcon={<AttachFile />}>
                      Attach File
                    </Button>
                    <Button variant="contained" endIcon={<Send />}>
                      Send Comment
                    </Button>
                  </Box>
                </Box>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ p: 3 }}>
                <List>
                  {mockTicket.attachments.map((attachment) => (
                    <ListItem
                      key={attachment.id}
                      sx={{
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 2,
                        mb: 1,
                      }}
                      secondaryAction={
                        <Button variant="outlined" size="small">
                          Download
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <AttachFile />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={attachment.filename}
                        secondary={`${formatFileSize(attachment.fileSize)} • Uploaded by ${attachment.uploadedBy} on ${formatDate(attachment.uploadedAt)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ p: 3 }}>
                <List>
                  {mockTicket.history.map((entry) => (
                    <ListItem key={entry.id} alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                          <Assignment />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={entry.action}
                        secondary={`${entry.user} • ${formatDate(entry.timestamp)}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ticket Details
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Reported By
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {mockTicket.reportedBy}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mockTicket.reportedByEmail}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Person fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Assigned To
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {mockTicket.assignedTo}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mockTicket.assignedToEmail}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Category fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Category
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {mockTicket.category}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Assignment fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Department
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {mockTicket.department}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Created
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {formatDate(mockTicket.createdAt)}
                </Typography>
              </Box>

              <Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <CalendarToday fontSize="small" color="action" />
                  <Typography variant="caption" color="text.secondary">
                    Due Date
                  </Typography>
                </Box>
                <Typography variant="body2">
                  {formatDate(mockTicket.dueDate)}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Quick Actions */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button variant="outlined" fullWidth>
                Change Status
              </Button>
              <Button variant="outlined" fullWidth>
                Reassign
              </Button>
              <Button variant="outlined" fullWidth>
                Change Priority
              </Button>
              <Button variant="outlined" fullWidth color="success">
                Mark as Resolved
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
