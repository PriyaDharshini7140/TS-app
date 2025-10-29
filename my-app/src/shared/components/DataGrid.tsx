import { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  InputAdornment,
  IconButton,
  Chip,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  TableSortLabel,
  Toolbar,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Search,
  Refresh,
  MoreVert,
  FilterList,
  ViewColumn,
  FileDownload,
} from '@mui/icons-material';

export interface Column<T = any> {
  field: string;
  headerName: string;
  width?: number;
  minWidth?: number;
  flex?: number;
  sortable?: boolean;
  filterable?: boolean;
  align?: 'left' | 'center' | 'right';
  renderCell?: (params: { value: any; row: T }) => React.ReactNode;
  valueFormatter?: (value: any) => string;
}

interface DataGridProps<T = any> {
  rows: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string | null;
  onRefresh?: () => void;
  searchPlaceholder?: string;
  enableSearch?: boolean;
  enableToolbar?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  checkboxSelection?: boolean;
  onRowSelectionChange?: (selectedIds: string[]) => void;
  height?: number | string;
  autoHeight?: boolean;
  getRowId?: (row: T) => string;
}

type Order = 'asc' | 'desc';

export function DataGrid<T extends { id: string }>({
  rows,
  columns,
  loading = false,
  error = null,
  onRefresh,
  searchPlaceholder = 'Search...',
  enableSearch = true,
  enableToolbar = true,
  pageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  checkboxSelection = false,
  onRowSelectionChange,
  height = 600,
  autoHeight = false,
  getRowId = (row) => row.id,
}: DataGridProps<T>) {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const [orderBy, setOrderBy] = useState<string>('');
  const [order, setOrder] = useState<Order>('asc');
  const [selected, setSelected] = useState<string[]>([]);
  const [toolbarMenuAnchor, setToolbarMenuAnchor] = useState<null | HTMLElement>(null);

  // Filter rows based on search text
  const filteredRows = useMemo(() => {
    if (!searchText) return rows;
    
    const searchLower = searchText.toLowerCase();
    return rows.filter((row) => {
      return Object.values(row).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      );
    });
  }, [rows, searchText]);

  // Sort rows
  const sortedRows = useMemo(() => {
    if (!orderBy) return filteredRows;

    const sorted = [...filteredRows].sort((a, b) => {
      const aValue = (a as any)[orderBy];
      const bValue = (b as any)[orderBy];

      if (aValue === bValue) return 0;
      
      if (order === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sorted;
  }, [filteredRows, orderBy, order]);

  // Paginate rows
  const paginatedRows = useMemo(() => {
    return sortedRows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [sortedRows, page, rowsPerPage]);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = paginatedRows.map((row) => getRowId(row));
      setSelected(newSelected);
      onRowSelectionChange?.(newSelected);
      return;
    }
    setSelected([]);
    onRowSelectionChange?.([]);
  };

  const handleClick = (id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    onRowSelectionChange?.(newSelected);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;

  const getCellValue = (row: T, column: Column<T>) => {
    const value = (row as any)[column.field];
    
    if (column.renderCell) {
      return column.renderCell({ value, row });
    }
    
    if (column.valueFormatter) {
      return column.valueFormatter(value);
    }
    
    return value;
  };

  const getColumnWidth = (column: Column<T>) => {
    if (column.flex) {
      return undefined; // Let flexbox handle it
    }
    return column.width || column.minWidth || 150;
  };

  return (
    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      {enableToolbar && (
        <Toolbar sx={{ borderBottom: 1, borderColor: 'divider', gap: 1 }}>
          <Tooltip title="More options">
            <IconButton onClick={(e) => setToolbarMenuAnchor(e.currentTarget)}>
              <MoreVert />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={toolbarMenuAnchor}
            open={Boolean(toolbarMenuAnchor)}
            onClose={() => setToolbarMenuAnchor(null)}
          >
            <MenuItem onClick={() => setToolbarMenuAnchor(null)}>
              <ListItemIcon>
                <ViewColumn fontSize="small" />
              </ListItemIcon>
              <ListItemText>Columns</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setToolbarMenuAnchor(null)}>
              <ListItemIcon>
                <FilterList fontSize="small" />
              </ListItemIcon>
              <ListItemText>Filters</ListItemText>
            </MenuItem>
            <MenuItem onClick={() => setToolbarMenuAnchor(null)}>
              <ListItemIcon>
                <FileDownload fontSize="small" />
              </ListItemIcon>
              <ListItemText>Export</ListItemText>
            </MenuItem>
          </Menu>
          <Box sx={{ flex: 1 }} />
          {onRefresh && (
            <Tooltip title="Refresh">
              <IconButton onClick={onRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>
          )}
        </Toolbar>
      )}

      {/* Search Bar */}
      {enableSearch && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            size="small"
            placeholder={searchPlaceholder}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setPage(0); // Reset to first page on search
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      {/* Error Display */}
      {error && (
        <Box sx={{ p: 2, bgcolor: 'error.lighter' }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </Box>
      )}

      {/* Loading Progress */}
      {loading && <LinearProgress />}

      {/* Table */}
      <TableContainer
        sx={{
          height: autoHeight
            ? 'auto'
            : typeof height === 'number'
            ? height - 200
            : `calc(${height} - 200px)`,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {checkboxSelection && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selected.length > 0 && selected.length < paginatedRows.length}
                    checked={paginatedRows.length > 0 && selected.length === paginatedRows.length}
                    onChange={handleSelectAllClick}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || 'left'}
                  sx={{
                    width: getColumnWidth(column),
                    minWidth: column.minWidth,
                    bgcolor: 'action.hover',
                    fontWeight: 600,
                  }}
                >
                  {column.sortable !== false ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : 'asc'}
                      onClick={() => handleRequestSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row) => {
              const rowId = getRowId(row);
              const isItemSelected = isSelected(rowId);

              return (
                <TableRow
                  hover
                  key={rowId}
                  selected={isItemSelected}
                  sx={{
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  {checkboxSelection && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={() => handleClick(rowId)}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell
                      key={column.field}
                      align={column.align || 'left'}
                      sx={{
                        width: getColumnWidth(column),
                        minWidth: column.minWidth,
                      }}
                    >
                      {getCellValue(row, column)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={pageSizeOptions}
        component="div"
        count={sortedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ borderTop: 1, borderColor: 'divider' }}
      />
    </Paper>
  );
}

// Export helper functions for common column configurations
export const createActionColumn = <T,>(
  renderCell: (params: { value: any; row: T }) => React.ReactNode
): Column<T> => ({
  field: 'actions',
  headerName: 'Actions',
  width: 150,
  sortable: false,
  filterable: false,
  align: 'center',
  renderCell,
});

export const createStatusColumn = <T,>(
  field: string = 'status',
  headerName: string = 'Status'
): Column<T> => ({
  field,
  headerName,
  width: 130,
  renderCell: (params) => {
    const status = params.value as string;
    const colorMap: Record<string, any> = {
      open: 'info',
      'in progress': 'warning',
      'in-progress': 'warning',
      resolved: 'success',
      closed: 'default',
      active: 'success',
      inactive: 'default',
      pending: 'warning',
      completed: 'success',
      cancelled: 'error',
      waiting: 'warning',
      met: 'success',
      'at-risk': 'warning',
      breached: 'error',
    };
    
    return (
      <Chip
        label={status}
        color={colorMap[status.toLowerCase()] || 'default'}
        size="small"
      />
    );
  },
});

export const createPriorityColumn = <T,>(
  field: string = 'priority',
  headerName: string = 'Priority'
): Column<T> => ({
  field,
  headerName,
  width: 120,
  renderCell: (params) => {
    const priority = params.value as string;
    const colorMap: Record<string, any> = {
      critical: 'error',
      high: 'warning',
      medium: 'info',
      low: 'default',
    };
    
    return (
      <Chip
        label={priority}
        color={colorMap[priority.toLowerCase()] || 'default'}
        size="small"
      />
    );
  },
});

export const createDateColumn = <T,>(
  field: string,
  headerName: string,
  width: number = 180
): Column<T> => ({
  field,
  headerName,
  width,
  valueFormatter: (value) => {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },
});
