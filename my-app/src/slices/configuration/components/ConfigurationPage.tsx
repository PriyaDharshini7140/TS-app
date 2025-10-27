import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { CategoryManagement } from './CategoryManagement';
import { SubcategoryManagement } from './SubcategoryManagement';
import { PriorityManagement } from './PriorityManagement';
import { StatusManagement } from './StatusManagement';

interface ConfigurationPageProps {
  userRole?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

export const ConfigurationPage = ({ userRole = 'Admin' }: ConfigurationPageProps) => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Configuration Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage categories, priorities, statuses, and SLA settings
        </Typography>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              textTransform: 'none',
              minWidth: 120,
              fontWeight: 500,
            },
          }}
        >
          <Tab label="Categories" />
          <Tab label="Subcategories" />
          <Tab label="Priorities" />
          <Tab label="Statuses" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <TabPanel value={currentTab} index={0}>
        <CategoryManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={1}>
        <SubcategoryManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={2}>
        <PriorityManagement />
      </TabPanel>
      <TabPanel value={currentTab} index={3}>
        <StatusManagement />
      </TabPanel>
    </Box>
  );
};
