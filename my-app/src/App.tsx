import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import {
  ThemeProvider,
  createTheme,
} from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Layout } from "./shared/components/Layout";
import { LoginForm } from "./slices/auth/components/LoginForm";
import { SignupForm } from "./slices/auth/components/SignupForm";
import { DashboardPage } from "./slices/dashboard/components/DashboardPage";
import { TicketsPage } from "./slices/tickets/components/TicketsPage";
import { TicketDetailsPage } from "./slices/tickets/components/TicketDetailsPage";
import { ReportsPage } from "./slices/reports/components/ReportsPage";
import { UsersPage } from "./slices/users/components/UsersPage";
import { RolesPage } from "./slices/roles/components/RolesPage";
import { DepartmentsPage } from "./slices/departments/components/DepartmentsPage";
import { SettingsPage } from "./slices/settings/components/SettingsPage";
import { SLAPage } from "./slices/sla/components/SLAPage";
import { NotificationsPage } from "./slices/notifications/components/NotificationsPage";
import { ConfigurationPage } from "./slices/configuration/components/ConfigurationPage";
import type { User } from "./shared/types";

// Create MUI theme with professional corporate colors
const createAppTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#3B82F6" : "#1976D2", // Professional blue
        light: isDarkMode ? "#60A5FA" : "#42A5F5",
        dark: isDarkMode ? "#2563EB" : "#1565C0",
        contrastText: "#FFFFFF",
      },
      secondary: {
        main: isDarkMode ? "#64748B" : "#546E7A", // Professional gray
        light: isDarkMode ? "#94A3B8" : "#78909C",
        dark: isDarkMode ? "#475569" : "#37474F",
        contrastText: "#FFFFFF",
      },
      background: {
        default: isDarkMode ? "#0F172A" : "#F5F7FA",
        paper: isDarkMode ? "#1E293B" : "#FFFFFF",
      },
      text: {
        primary: isDarkMode ? "#F1F5F9" : "#1A202C",
        secondary: isDarkMode ? "#94A3B8" : "#64748B",
      },
      error: {
        main: isDarkMode ? "#EF4444" : "#D32F2F",
        light: isDarkMode ? "#F87171" : "#E57373",
        dark: isDarkMode ? "#DC2626" : "#C62828",
        contrastText: "#FFFFFF",
      },
      success: {
        main: isDarkMode ? "#10B981" : "#43A047", // Professional green
        light: isDarkMode ? "#34D399" : "#66BB6A",
        dark: isDarkMode ? "#059669" : "#2E7D32",
        contrastText: "#FFFFFF",
      },
      warning: {
        main: isDarkMode ? "#F59E0B" : "#FFA726",
        light: isDarkMode ? "#FBBF24" : "#FFB74D",
        dark: isDarkMode ? "#D97706" : "#F57C00",
        contrastText: "#1A202C",
      },
      info: {
        main: isDarkMode ? "#0EA5E9" : "#0288D1",
        light: isDarkMode ? "#38BDF8" : "#03A9F4",
        dark: isDarkMode ? "#0284C7" : "#01579B",
        contrastText: "#FFFFFF",
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 700,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: "1rem",
        fontWeight: 500,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: "0.875rem",
        fontWeight: 400,
        lineHeight: 1.43,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: "8px",
            boxShadow: "none",
            padding: "8px 16px",
            "&:hover": {
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
            },
          },
          contained: {
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
            },
          },
          outlined: {
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
              backgroundColor: isDarkMode
                ? "rgba(59, 130, 246, 0.08)"
                : "rgba(25, 118, 210, 0.04)",
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            boxShadow: isDarkMode
              ? "0 1px 3px rgba(0, 0, 0, 0.5)"
              : "0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)",
            border: isDarkMode
              ? "1px solid rgba(51, 65, 85, 0.5)"
              : "1px solid rgba(226, 232, 240, 0.8)",
            transition: "all 0.2s ease",
            "&:hover": {
              boxShadow: isDarkMode
                ? "0 4px 12px rgba(0, 0, 0, 0.6)"
                : "0 4px 8px rgba(0, 0, 0, 0.15)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "0.75rem",
          },
          colorPrimary: {
            background: isDarkMode
              ? "rgba(59, 130, 246, 0.2)"
              : "rgba(25, 118, 210, 0.1)",
            color: isDarkMode ? "#60A5FA" : "#1565C0",
          },
          colorSecondary: {
            background: isDarkMode
              ? "rgba(100, 116, 139, 0.2)"
              : "rgba(84, 110, 122, 0.1)",
            color: isDarkMode ? "#94A3B8" : "#37474F",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "8px",
            backgroundImage: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode ? "#3B82F6" : "#1976D2",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: isDarkMode
                    ? "#3B82F6"
                    : "#1976D2",
                  borderWidth: 2,
                },
            },
          },
        },
      },
    },
  });

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppContext();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Auth Route wrapper (redirect to dashboard if already authenticated)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppContext();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

// App Context
const AppContext = React.createContext<{
  isAuthenticated: boolean;
  currentUser: User | null;
  isDarkMode: boolean;
  isSidebarCollapsed: boolean;
  handleLogin: (credentials: any) => Promise<void>;
  handleSignup: (signupData: any) => Promise<void>;
  handleLogout: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  authError: string | null;
  authLoading: boolean;
} | null>(null);

const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const theme = createAppTheme(isDarkMode);

  const handleLogin = async (credentials: any) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Mock login - replace with actual authentication
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUser: User = {
        id: "1",
        name: "John Doe",
        email: credentials.email,
        role:
          credentials.email === "admin@company.com"
            ? "Admin"
            : "End User",
        department: "IT",
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError(
        "Invalid credentials. Try admin@company.com / admin123",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignup = async (signupData: any) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      // Mock signup - replace with actual registration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockUser: User = {
        id: "2",
        name: signupData.name,
        email: signupData.email,
        role: "End User",
        department: signupData.department,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      setCurrentUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError("Registration failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setAuthError(null);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        currentUser,
        isDarkMode,
        isSidebarCollapsed,
        handleLogin,
        handleSignup,
        handleLogout,
        toggleTheme,
        toggleSidebar,
        authError,
        authLoading,
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppContext.Provider>
  );
}

// Main App Routes Component
function AppRoutes() {
  const navigate = useNavigate();
  const { currentUser, isDarkMode, isSidebarCollapsed, handleLogout, toggleTheme, toggleSidebar } = useAppContext();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <AuthPages />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <AuthPages />
          </AuthRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout
              user={currentUser!}
              isSidebarCollapsed={isSidebarCollapsed}
              isDarkMode={isDarkMode}
              onToggleSidebar={toggleSidebar}
              onToggleTheme={toggleTheme}
              onLogout={handleLogout}
            >
              <Routes>
                <Route path="/dashboard" element={<DashboardPage userRole={currentUser?.role || "End User"} onNavigate={(page) => navigate(`/${page}`)} onViewTicket={(id) => navigate(`/tickets/${id}`)} />} />
                <Route path="/tickets" element={<TicketsPage />} />
                <Route path="/tickets/:id" element={<TicketDetailsPage ticketId={null} />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/users" element={<UsersPage userRole={currentUser?.role || "End User"} />} />
                <Route path="/roles" element={<RolesPage userRole={currentUser?.role || "End User"} />} />
                <Route path="/departments" element={<DepartmentsPage userRole={currentUser?.role || "End User"} />} />
                <Route path="/configuration" element={<ConfigurationPage userRole={currentUser?.role || "End User"} />} />
                <Route path="/settings" element={<SettingsPage userRole={currentUser?.role || "End User"} />} />
                <Route path="/sla" element={<SLAPage userRole={currentUser?.role || "End User"} />} />
                <Route path="/notifications" element={<NotificationsPage userRole={currentUser?.role || "End User"} />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Auth Pages Component
function AuthPages() {
  const navigate = useNavigate();
  const location = window.location.pathname;
  const { handleLogin, handleSignup, authError, authLoading } = useAppContext();

  if (location === '/signup') {
    return (
      <SignupForm
        onSignup={handleSignup}
        onBackToLogin={() => navigate('/login')}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  return (
    <LoginForm
      onLogin={handleLogin}
      onForgotPassword={() => {}}
      onSignup={() => navigate('/signup')}
      isLoading={authLoading}
      error={authError}
    />
  );
}

export default function App() {
  return (
    <Router>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </Router>
  );
}

