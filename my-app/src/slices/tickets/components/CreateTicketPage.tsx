import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  AttachFile,
  Delete,
  Upload,
  Info,
} from '@mui/icons-material';

interface CreateTicketPageProps {
  currentUserDepartment?: string;
}

const categories = [
  { value: 'Hardware', label: 'Hardware', subcategories: ['Computer', 'Printer', 'Monitor', 'Keyboard/Mouse', 'Phone'] },
  { value: 'Software', label: 'Software', subcategories: ['Application', 'Operating System', 'License', 'Installation'] },
  { value: 'Network', label: 'Network', subcategories: ['Connectivity', 'VPN', 'WiFi', 'Email'] },
  { value: 'Security', label: 'Security', subcategories: ['Access Control', 'Password Reset', 'Antivirus', 'Data Protection'] },
  { value: 'Access', label: 'Access & Permissions', subcategories: ['Account Creation', 'Permission Change', 'Group Access', 'Application Access'] },
  { value: 'Other', label: 'Other', subcategories: ['General Inquiry', 'Feature Request', 'Consultation'] },
];

const departments = [
  'IT', 'Finance', 'HR', 'Sales', 'Marketing', 'Operations', 'Legal', 'Engineering',
];

const projects = [
  'ERP System Upgrade',
  'Cloud Migration',
  'Office Relocation',
  'Security Enhancement',
  'General Support',
];

const priorities = [
  { value: 'Low', label: 'Low', color: '#BEE1C3', hours: 72 },
  { value: 'Medium', label: 'Medium', color: '#A8C5E6', hours: 48 },
  { value: 'High', label: 'High', color: '#FFD54F', hours: 24 },
  { value: 'Critical', label: 'Critical', color: '#E57373', hours: 8 },
];

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: Yup.string()
    .required('Description is required')
    .min(20, 'Please provide more details (at least 20 characters)')
    .max(2000, 'Description must not exceed 2000 characters'),
  department: Yup.string().required('Department is required'),
  category: Yup.string().required('Category is required'),
  subcategory: Yup.string().required('Subcategory is required'),
  priority: Yup.string().required('Priority is required'),
  project: Yup.string(),
});

export const CreateTicketPage = ({ currentUserDepartment = 'IT' }: CreateTicketPageProps) => {
  const navigate = useNavigate();
  const [attachments, setAttachments] = useState<File[]>([]);

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      department: currentUserDepartment,
      project: '',
      category: '',
      subcategory: '',
      priority: 'Medium',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log('Ticket created:', values, attachments);
      alert('Ticket created successfully!');
      navigate('/tickets');
    },
  });

  const selectedCategory = categories.find(cat => cat.value === formik.values.category);
  const selectedPriority = priorities.find(p => p.value === formik.values.priority);
  
  // Calculate SLA due date
  const calculateSLADueDate = () => {
    if (!selectedPriority) return null;
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + selectedPriority.hours);
    return dueDate;
  };

  const slaDate = calculateSLADueDate();

  const handleCategoryChange = (value: string) => {
    formik.setFieldValue('category', value);
    formik.setFieldValue('subcategory', ''); // Reset subcategory when category changes
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setAttachments(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={() => navigate('/tickets')} sx={{ color: 'primary.main' }}>
          <ArrowBack />
        </IconButton>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            Create New Ticket
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Submit a new support request
          </Typography>
        </Box>
      </Box>

      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          {/* Main Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Title */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    placeholder="Brief description of the issue"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                  />
                </Grid>

                {/* Description */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    placeholder="Provide detailed information about your issue..."
                    multiline
                    rows={6}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                </Grid>

                {/* Department & Project */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Department"
                    name="department"
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.department && Boolean(formik.errors.department)}
                    helperText={
                      (formik.touched.department && formik.errors.department) ||
                      'Auto-filled based on your profile'
                    }
                  >
                    {departments.map((dept) => (
                      <MenuItem key={dept} value={dept}>
                        {dept}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Project (Optional)"
                    name="project"
                    value={formik.values.project}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value="">None</MenuItem>
                    {projects.map((project) => (
                      <MenuItem key={project} value={project}>
                        {project}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Category & Subcategory */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Category"
                    name="category"
                    value={formik.values.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    onBlur={formik.handleBlur}
                    required
                    error={formik.touched.category && Boolean(formik.errors.category)}
                    helperText={formik.touched.category && formik.errors.category}
                  >
                    {categories.map((cat) => (
                      <MenuItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    fullWidth
                    label="Subcategory"
                    name="subcategory"
                    value={formik.values.subcategory}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    disabled={!formik.values.category}
                    error={formik.touched.subcategory && Boolean(formik.errors.subcategory)}
                    helperText={
                      (formik.touched.subcategory && formik.errors.subcategory) ||
                      (formik.values.category ? '' : 'Select a category first')
                    }
                  >
                    {selectedCategory?.subcategories.map((subcat) => (
                      <MenuItem key={subcat} value={subcat}>
                        {subcat}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                {/* Priority */}
                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Priority"
                    name="priority"
                    value={formik.values.priority}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    error={formik.touched.priority && Boolean(formik.errors.priority)}
                    helperText={
                      (formik.touched.priority && formik.errors.priority) ||
                      'Select priority level based on urgency'
                    }
                  >
                    {priorities.map((priority) => (
                      <MenuItem key={priority.value} value={priority.value}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: priority.color,
                            }}
                          />
                          <Typography>{priority.label}</Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                            (SLA: {priority.hours}h)
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

              {/* Attachments */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Attachments
                </Typography>
                <Box
                  sx={{
                    border: '2px dashed',
                    borderColor: 'border',
                    borderRadius: 2,
                    p: 3,
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={() => document.getElementById('file-input')?.click()}
                >
                  <input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                  <Upload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PDF, DOC, PNG, JPG up to 10MB each
                  </Typography>
                </Box>

                {attachments.length > 0 && (
                  <List sx={{ mt: 2 }}>
                    {attachments.map((file, index) => (
                      <ListItem
                        key={index}
                        sx={{
                          bgcolor: 'action.hover',
                          borderRadius: 1,
                          mb: 1,
                        }}
                      >
                        <AttachFile sx={{ mr: 2, color: 'text.secondary' }} />
                        <ListItemText
                          primary={file.name}
                          secondary={`${(file.size / 1024).toFixed(2)} KB`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => removeAttachment(index)}
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
              </Grid>

                {/* Action Buttons */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/tickets')}
                      sx={{ minWidth: 120 }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ minWidth: 120 }}
                      disabled={formik.isSubmitting}
                    >
                      {formik.isSubmitting ? 'Creating...' : 'Create Ticket'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Sidebar - SLA Info & Help */}
          <Grid item xs={12} md={4}>
            {/* SLA Information */}
            {slaDate && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Info sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6">SLA Information</Typography>
                  </Box>
                  
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Priority Level
                    </Typography>
                    <Chip
                      label={formik.values.priority}
                      sx={{
                        mt: 0.5,
                        bgcolor: selectedPriority?.color,
                        color: 'text.primary',
                        fontWeight: 600,
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      Response Time
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedPriority?.hours} hours
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Expected Due Date
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {slaDate.toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Help Card */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Need Help?
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  Before submitting a ticket, you may want to:
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemText
                      primary="Check the Knowledge Base"
                      secondary="Find solutions to common issues"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Contact Your Manager"
                      secondary="For department-specific issues"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Emergency Support"
                      secondary="Call ext. 1234 for urgent issues"
                      primaryTypographyProps={{ variant: 'body2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
