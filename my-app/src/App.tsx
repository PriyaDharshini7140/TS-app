import { useState } from "react";
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
import { DepartmentsPage } from "./slices/departments/components/DepartmentsPage";
import { SettingsPage } from "./slices/settings/components/SettingsPage";
import type { User } from "./shared/types";

export type Page =
  | "login"
  | "signup"
  | "dashboard"
  | "tickets"
  | "ticket-details"
  | "reports"
  | "users"
  | "departments"
  | "settings";
type AuthPage = "login" | "signup" | "forgot-password";

// Create MUI theme with soft pastel colors
const createAppTheme = (isDarkMode: boolean) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: isDarkMode ? "#A78BFA" : "#8B5CF6", // Soft purple
        light: isDarkMode ? "#C4B5FD" : "#A78BFA",
        dark: isDarkMode ? "#8B5CF6" : "#7C3AED",
        contrastText: isDarkMode ? "#1F2937" : "#ffffff",
      },
      secondary: {
        main: isDarkMode ? "#86EFAC" : "#34D399", // Soft green
        light: isDarkMode ? "#A7F3D0" : "#6EE7B7",
        dark: isDarkMode ? "#34D399" : "#10B981",
        contrastText: isDarkMode ? "#1F2937" : "#ffffff",
      },
      background: {
        default: isDarkMode ? "#1A1B2E" : "#FEFEFF", // Very light lavender for light mode, dark blue for dark
        paper: isDarkMode ? "#252641" : "#FDFDFF", // Slightly darker for cards
      },
      text: {
        primary: isDarkMode ? "#F8FAFC" : "#2D3748",
        secondary: isDarkMode ? "#CBD5E0" : "#4A5568",
      },
      error: {
        main: isDarkMode ? "#FDA4AF" : "#FB7185", // Soft pink
        light: isDarkMode ? "#FECACA" : "#FDA4AF",
        dark: isDarkMode ? "#FB7185" : "#E11D48",
      },
      success: {
        main: isDarkMode ? "#86EFAC" : "#22C55E", // Soft green
        light: isDarkMode ? "#A7F3D0" : "#86EFAC",
        dark: isDarkMode ? "#22C55E" : "#15803D",
      },
      warning: {
        main: isDarkMode ? "#FDE68A" : "#FBBF24", // Soft yellow
        light: isDarkMode ? "#FEF3C7" : "#FDE68A",
        dark: isDarkMode ? "#FBBF24" : "#D97706",
        contrastText: isDarkMode ? "#1F2937" : "#1F2937",
      },
      info: {
        main: isDarkMode ? "#93C5FD" : "#3B82F6", // Soft blue
        light: isDarkMode ? "#BFDBFE" : "#93C5FD",
        dark: isDarkMode ? "#3B82F6" : "#1D4ED8",
      },
    },
    typography: {
      fontFamily: "inherit",
      h1: {
        fontSize: "1.5rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h2: {
        fontSize: "1.25rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      h3: {
        fontSize: "1.125rem",
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: "1rem",
        fontWeight: 400,
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
            borderRadius: "12px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            },
          },
          contained: {
            background: isDarkMode
              ? "linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)"
              : "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)",
            "&:hover": {
              background: isDarkMode
                ? "linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)"
                : "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)",
            },
          },
          outlined: {
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            boxShadow: isDarkMode
              ? "0 4px 20px rgba(167, 139, 250, 0.1)"
              : "0 4px 20px rgba(139, 92, 246, 0.1)",
            border: isDarkMode
              ? "1px solid rgba(167, 139, 250, 0.2)"
              : "1px solid rgba(139, 92, 246, 0.1)",
            "&:hover": {
              boxShadow: isDarkMode
                ? "0 8px 30px rgba(167, 139, 250, 0.15)"
                : "0 8px 30px rgba(139, 92, 246, 0.15)",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: "20px",
            fontWeight: 500,
          },
          colorPrimary: {
            background: isDarkMode
              ? "rgba(167, 139, 250, 0.2)"
              : "rgba(139, 92, 246, 0.1)",
            color: isDarkMode ? "#C4B5FD" : "#7C3AED",
          },
          colorSecondary: {
            background: isDarkMode
              ? "rgba(134, 239, 172, 0.2)"
              : "rgba(52, 211, 153, 0.1)",
            color: isDarkMode ? "#86EFAC" : "#059669",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: "16px",
            backgroundImage: "none",
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: "12px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: isDarkMode ? "#A78BFA" : "#8B5CF6",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                {
                  borderColor: isDarkMode
                    ? "#A78BFA"
                    : "#8B5CF6",
                  borderWidth: 2,
                },
            },
          },
        },
      },
    },
  });

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [selectedTicketId, setSelectedTicketId] = useState<
    string | null
  >(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] =
    useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(
    null,
  );
  const [authError, setAuthError] = useState<string | null>(
    null,
  );
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
      setCurrentPage("dashboard");
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
      setCurrentPage("dashboard");
    } catch (error) {
      setAuthError("Registration failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage("login");
    setAuthPage("login");
    setAuthError(null);
  };

  const navigateToPage = (page: Page) => {
    setCurrentPage(page);
  };

  const viewTicketDetails = (ticketId: string) => {
    setSelectedTicketId(ticketId);
    setCurrentPage("ticket-details");
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {authPage === "login" && (
          <LoginForm
            onLogin={handleLogin}
            onForgotPassword={() =>
              setAuthPage("forgot-password")
            }
            onSignup={() => setAuthPage("signup")}
            isLoading={authLoading}
            error={authError}
          />
        )}
        {authPage === "signup" && (
          <SignupForm
            onSignup={handleSignup}
            onBackToLogin={() => setAuthPage("login")}
            isLoading={authLoading}
            error={authError}
          />
        )}
      </ThemeProvider>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <DashboardPage
            userRole={currentUser?.role || "End User"}
            onNavigate={navigateToPage}
            onViewTicket={viewTicketDetails}
          />
        );
      case "tickets":
        return <TicketsPage onViewTicket={viewTicketDetails} />;
      case "ticket-details":
        return (
          <TicketDetailsPage ticketId={selectedTicketId} />
        );
      case "reports":
        return <ReportsPage />;
      case "users":
        return (
          <UsersPage
            userRole={currentUser?.role || "End User"}
          />
        );
      case "departments":
        return (
          <DepartmentsPage
            userRole={currentUser?.role || "End User"}
          />
        );
      case "settings":
        return (
          <SettingsPage
            userRole={currentUser?.role || "End User"}
          />
        );
      default:
        return (
          <DashboardPage
            userRole={currentUser?.role || "End User"}
            onNavigate={navigateToPage}
            onViewTicket={viewTicketDetails}
          />
        );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout
        currentPage={currentPage}
        user={currentUser!}
        isSidebarCollapsed={isSidebarCollapsed}
        isDarkMode={isDarkMode}
        onNavigate={navigateToPage}
        onToggleSidebar={toggleSidebar}
        onToggleTheme={toggleTheme}
        onLogout={handleLogout}
      >
        {renderPage()}
      </Layout>
    </ThemeProvider>
  );
}