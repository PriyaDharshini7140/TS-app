import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Tabs,
  Tab,
  MenuItem,
} from '@mui/material';
import {
  Save,
  Notifications,
  Security,
  Palette,
  Language,
  AccountCircle,
} from '@mui/icons-material';

interface SettingsPageProps {
  userRole: string;
  onSave?: (settings: any) => void;
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

export const SettingsPage: React.FC<SettingsPageProps> = ({ userRole, onSave }) => {
  const [tabValue, setTabValue] = useState(0);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'IT',
    phoneNumber: '+1 (555) 123-4567',
    timezone: 'America/New_York',
    language: 'en',
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    ticketAssigned: true,
    ticketUpdated: true,
    ticketResolved: true,
    dailyDigest: false,
    weeklyReport: true,
  });

  // Appearance settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    compactView: false,
    sidebarCollapsed: false,
    showAvatars: true,
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveSettings = () => {
    const allSettings = {
      profile: profileSettings,
      notifications: notificationSettings,
      appearance: appearanceSettings,
    };
    
    onSave?.(allSettings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const canManageSystemSettings = userRole === 'Admin';

  return (
    <Box>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account preferences and system settings
        </Typography>
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      {/* Settings Card */}
      <Card>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}
        >
          <Tab icon={<AccountCircle />} label="Profile" iconPosition="start" />
          <Tab icon={<Notifications />} label="Notifications" iconPosition="start" />
          <Tab icon={<Palette />} label="Appearance" iconPosition="start" />
          {canManageSystemSettings && (
            <Tab icon={<Security />} label="System" iconPosition="start" />
          )}
        </Tabs>

        <CardContent sx={{ p: 3 }}>
          {/* Profile Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={profileSettings.name}
                  onChange={(e) => setProfileSettings({ ...profileSettings, name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={profileSettings.email}
                  onChange={(e) => setProfileSettings({ ...profileSettings, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Department"
                  value={profileSettings.department}
                  onChange={(e) => setProfileSettings({ ...profileSettings, department: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={profileSettings.phoneNumber}
                  onChange={(e) => setProfileSettings({ ...profileSettings, phoneNumber: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Timezone"
                  value={profileSettings.timezone}
                  onChange={(e) => setProfileSettings({ ...profileSettings, timezone: e.target.value })}
                >
                  <MenuItem value="America/New_York">Eastern Time (ET)</MenuItem>
                  <MenuItem value="America/Chicago">Central Time (CT)</MenuItem>
                  <MenuItem value="America/Denver">Mountain Time (MT)</MenuItem>
                  <MenuItem value="America/Los_Angeles">Pacific Time (PT)</MenuItem>
                  <MenuItem value="Europe/London">London (GMT)</MenuItem>
                  <MenuItem value="Asia/Tokyo">Tokyo (JST)</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select
                  fullWidth
                  label="Language"
                  value={profileSettings.language}
                  onChange={(e) => setProfileSettings({ ...profileSettings, language: e.target.value })}
                >
                  <MenuItem value="en">English</MenuItem>
                  <MenuItem value="es">Spanish</MenuItem>
                  <MenuItem value="fr">French</MenuItem>
                  <MenuItem value="de">German</MenuItem>
                  <MenuItem value="ja">Japanese</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </TabPanel>

          {/* Notifications Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Email Notifications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        emailNotifications: e.target.checked 
                      })}
                    />
                  }
                  label="Enable email notifications"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.ticketAssigned}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        ticketAssigned: e.target.checked 
                      })}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  }
                  label="Ticket assigned to me"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.ticketUpdated}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        ticketUpdated: e.target.checked 
                      })}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  }
                  label="Ticket updates"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.ticketResolved}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        ticketResolved: e.target.checked 
                      })}
                      disabled={!notificationSettings.emailNotifications}
                    />
                  }
                  label="Ticket resolved"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Push Notifications
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        pushNotifications: e.target.checked 
                      })}
                    />
                  }
                  label="Enable push notifications"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Digest & Reports
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.dailyDigest}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        dailyDigest: e.target.checked 
                      })}
                    />
                  }
                  label="Daily digest email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.weeklyReport}
                      onChange={(e) => setNotificationSettings({ 
                        ...notificationSettings, 
                        weeklyReport: e.target.checked 
                      })}
                    />
                  }
                  label="Weekly summary report"
                />
              </Box>
            </Box>
          </TabPanel>

          {/* Appearance Tab */}
          <TabPanel value={tabValue} index={2}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Display Settings
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 3 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={appearanceSettings.compactView}
                      onChange={(e) => setAppearanceSettings({ 
                        ...appearanceSettings, 
                        compactView: e.target.checked 
                      })}
                    />
                  }
                  label="Compact view"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={appearanceSettings.sidebarCollapsed}
                      onChange={(e) => setAppearanceSettings({ 
                        ...appearanceSettings, 
                        sidebarCollapsed: e.target.checked 
                      })}
                    />
                  }
                  label="Collapse sidebar by default"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={appearanceSettings.showAvatars}
                      onChange={(e) => setAppearanceSettings({ 
                        ...appearanceSettings, 
                        showAvatars: e.target.checked 
                      })}
                    />
                  }
                  label="Show user avatars"
                />
              </Box>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" gutterBottom>
                Theme
              </Typography>
              <TextField
                select
                fullWidth
                label="Theme"
                value={appearanceSettings.theme}
                onChange={(e) => setAppearanceSettings({ ...appearanceSettings, theme: e.target.value })}
                sx={{ maxWidth: 400 }}
              >
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="auto">Auto (System)</MenuItem>
              </TextField>
            </Box>
          </TabPanel>

          {/* System Tab (Admin only) */}
          {canManageSystemSettings && (
            <TabPanel value={tabValue} index={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  System Configuration
                </Typography>
                <Alert severity="info" sx={{ mb: 3 }}>
                  System-wide settings affect all users. Changes require administrator privileges.
                </Alert>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Ticket Auto-assignment"
                      select
                      defaultValue="round-robin"
                    >
                      <MenuItem value="round-robin">Round Robin</MenuItem>
                      <MenuItem value="load-based">Load Based</MenuItem>
                      <MenuItem value="manual">Manual Only</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Default Priority"
                      select
                      defaultValue="medium"
                    >
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="SLA Response Time (hours)"
                      type="number"
                      defaultValue={24}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Session Timeout (minutes)"
                      type="number"
                      defaultValue={30}
                    />
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Require two-factor authentication"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Enable password expiration"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="Allow external ticket submission"
                  />
                </Box>
              </Box>
            </TabPanel>
          )}
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Save />}
          onClick={handleSaveSettings}
        >
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};
