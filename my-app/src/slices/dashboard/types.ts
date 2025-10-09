export interface DashboardStats {
  totalTickets: number;
  openTickets: number;
  inProgressTickets: number;
  resolvedTickets: number;
  closedTickets: number;
  highPriorityTickets: number;
  overdueTickets: number;
  avgResolutionTime: number;
  myTickets: number;
  myOpenTickets: number;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: React.ComponentType;
  color: 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';
  onClick: () => void;
}

export interface RecentActivity {
  id: string;
  type: 'ticket_created' | 'ticket_updated' | 'ticket_assigned' | 'ticket_resolved' | 'comment_added';
  title: string;
  description: string;
  timestamp: string;
  user: string;
  ticketId?: string;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TicketTrend {
  date: string;
  created: number;
  resolved: number;
  open: number;
}

export interface DepartmentMetrics {
  department: string;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  satisfaction: number;
}

export interface DashboardFilters {
  dateRange: {
    start: string;
    end: string;
  };
  departments: string[];
  priorities: string[];
}