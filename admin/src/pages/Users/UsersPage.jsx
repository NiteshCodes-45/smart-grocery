import { Alert, Box, Chip, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Search } from 'lucide-react';
import { useMemo } from 'react';

import { setUserSearchTerm } from '@/features/users/userSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { formatDate } from '@/utils/date';

const statusColor = {
  active: 'success',
  disabled: 'default',
  pending: 'warning',
};

const columns = [
  { field: 'name', flex: 1, headerName: 'Name', minWidth: 180 },
  { field: 'email', flex: 1.2, headerName: 'Email', minWidth: 220 },
  {
    field: 'createdDate',
    flex: 0.8,
    headerName: 'Created Date',
    minWidth: 150,
    renderCell: (params) => formatDate(params.value ?? ''),
  },
  {
    field: 'status',
    headerName: 'Status',
    minWidth: 130,
    renderCell: (params) => (
      <Chip color={statusColor[params.value ?? 'disabled']} label={params.value} size="small" variant="outlined" />
    ),
  },
];

export function UsersPage() {
  const dispatch = useAppDispatch();
  const { error, searchTerm, status, users } = useAppSelector((state) => state.users);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return users;
    }

    return users.filter((user) =>
      [user.name, user.email, user.status].some((value) => value.toLowerCase().includes(term)),
    );
  }, [searchTerm, users]);

  return (
    <Stack spacing={3}>
      <Stack
        alignItems={{ xs: 'stretch', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4">Users</Typography>
          <Typography color="text.secondary" mt={0.75} variant="body2">
            Search and review customer accounts.
          </Typography>
        </Box>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} />
              </InputAdornment>
            ),
          }}
          onChange={(event) => dispatch(setUserSearchTerm(event.target.value))}
          placeholder="Search users"
          size="small"
          sx={{ maxWidth: { sm: 320 }, width: '100%' }}
          value={searchTerm}
        />
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <Box
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          height: 520,
          overflow: 'hidden',
        }}
      >
        <DataGrid
          columns={columns}
          disableRowSelectionOnClick
          getRowId={(row) => row.id}
          loading={status === 'loading'}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 25]}
          rows={filteredUsers}
        />
      </Box>
    </Stack>
  );
}
