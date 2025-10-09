import { useState } from 'react';
import { Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Avatar, Menu, MenuItem, Tooltip } from '@mui/material';
import { 
  Dashboard, 
  ConfirmationNumber, 
  Business, 
  People, 
  Analytics, 
  Settings,
  Menu as MenuIcon,
  ChevronLeft,
  ChevronRight,
  Brightness4,
  Brightness7,
  AccountCircle,
  Logout,
  ExpandLess,
  ExpandMore,
  Notifications,
  Search
} from '@mui/icons-material';
import type { User } from '../types';
import type { Page } from '../../App';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  user: User;
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  onNavigate: (page: Page) => void;
  onToggleSidebar: () => void;
  onToggleTheme: () => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Dashboard },
  { id: 'tickets', label: 'Tickets', icon: ConfirmationNumber },
  { id: 'departments', label: 'Departments', icon: Business },
  { id: 'users', label: 'Users', icon: People },
  { id: 'reports', label: 'Reports', icon: Analytics },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const getFilteredMenuItems = (userRole: string) => {
  switch (userRole) {
    case 'End User':
      return menuItems.filter(item => ['dashboard', 'tickets'].includes(item.id));
    case 'Department Manager':
      return menuItems.filter(item => ['dashboard', 'tickets', 'reports'].includes(item.id));
    case 'IT Support Agent':
      return menuItems.filter(item => !['users', 'departments'].includes(item.id));
    case 'Admin':
    default:
      return menuItems;
  }
};

export const Layout = ({
  children,
  currentPage,
  user,
  isSidebarCollapsed,
  isDarkMode,
  onNavigate,
  onToggleSidebar,
  onToggleTheme,
  onLogout,
}: LayoutProps) => {
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const filteredMenuItems = getFilteredMenuItems(user.role);
  const drawerWidth = isSidebarCollapsed ? 72 : 280;

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleLogout = () => {
    handleUserMenuClose();
    onLogout();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: isDarkMode 
            ? 'linear-gradient(135deg, #252641 0%, #1A1B2E 100%)'
            : 'linear-gradient(135deg, #FDFDFF 0%, #F8FAFC 100%)',
          color: isDarkMode ? '#F8FAFC' : '#2D3748',
          boxShadow: isDarkMode 
            ? '0 4px 20px rgba(167, 139, 250, 0.1)'
            : '0 4px 20px rgba(139, 92, 246, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onToggleSidebar}
            sx={{ mr: 2 }}
          >
            {isSidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            IT Ticketing System
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton color="inherit">
              <Search />
            </IconButton>
            
            <IconButton 
              color="inherit"
              onClick={() => setNotificationsOpen(!notificationsOpen)}
            >
              <Notifications />
            </IconButton>

            <IconButton color="inherit" onClick={onToggleTheme}>
              {isDarkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            <IconButton
              color="inherit"
              onClick={handleUserMenuOpen}
              sx={{ ml: 1 }}
            >
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: 'primary.main',
                  fontSize: '0.875rem'
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              PaperProps={{
                sx: { 
                  borderRadius: 2,
                  minWidth: 200,
                  boxShadow: isDarkMode 
                    ? '0 8px 30px rgba(167, 139, 250, 0.15)'
                    : '0 8px 30px rgba(139, 92, 246, 0.15)',
                }
              }}
            >
              <MenuItem disabled>
                <Box>
                  <Typography variant="subtitle2">{user.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user.role}
                  </Typography>
                </Box>
              </MenuItem>
              <MenuItem onClick={handleUserMenuClose}>
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            transition: 'width 0.3s ease',
            background: isDarkMode 
              ? 'linear-gradient(180deg, #1F2937 0%, #111827 100%)'
              : 'linear-gradient(180deg, #FDFEFF 0%, #F8FAFC 100%)',
            borderRight: isDarkMode 
              ? '1px solid rgba(167, 139, 250, 0.2)'
              : '1px solid rgba(139, 92, 246, 0.1)',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'hidden', py: 2 }}>
          <List>
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <Tooltip 
                  key={item.id} 
                  title={isSidebarCollapsed ? item.label : ''} 
                  placement="right"
                >
                  <ListItemButton
                    onClick={() => onNavigate(item.id as Page)}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      borderRadius: 2,
                      transition: 'all 0.2s ease',
                      backgroundColor: isActive 
                        ? (isDarkMode ? 'rgba(167, 139, 250, 0.2)' : 'rgba(139, 92, 246, 0.1)')
                        : 'transparent',
                      '&:hover': {
                        backgroundColor: isDarkMode 
                          ? 'rgba(167, 139, 250, 0.1)' 
                          : 'rgba(139, 92, 246, 0.05)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: isActive 
                          ? (isDarkMode ? '#C4B5FD' : '#7C3AED')
                          : 'text.secondary',
                        minWidth: isSidebarCollapsed ? 'auto' : 56,
                        justifyContent: 'center',
                      }}
                    >
                      <Icon />
                    </ListItemIcon>
                    {!isSidebarCollapsed && (
                      <ListItemText 
                        primary={item.label}
                        sx={{
                          color: isActive 
                            ? (isDarkMode ? '#C4B5FD' : '#7C3AED')
                            : 'text.primary',
                          '& .MuiListItemText-primary': {
                            fontWeight: isActive ? 600 : 400,
                          },
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              );
            })}
          </List>
        </Box>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          transition: 'margin 0.3s ease',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3, width: '100%', maxWidth: '100%' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};