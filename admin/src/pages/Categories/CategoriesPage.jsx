import { zodResolver } from '@hookform/resolvers/zod';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { Edit, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { saveCategory } from '@/features/categories/categorySlice';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { formatDate } from '@/utils/date';

const categorySchema = z.object({
  name: z.string().trim().min(2, 'Category name must be at least 2 characters.'),
  icon: z.string().trim().min(1, 'Add an icon.').max(8, 'Use a short icon or emoji.'),
  active: z.boolean(),
});

function CategoryDialog({ category, open, onClose, onSubmit, saving }) {
  const defaultValues = useMemo(
    () => ({
      active: category?.active ?? true,
      icon: category?.icon ?? '',
      name: category?.name ?? '',
    }),
    [category],
  );

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm({
    defaultValues,
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const submitForm = async (values) => {
    await onSubmit(values);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <Box component="form" noValidate onSubmit={handleSubmit(submitForm)}>
        <DialogTitle>{category ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <Stack pt={1} spacing={2.25}>
            <TextField
              autoFocus
              error={Boolean(errors.name)}
              fullWidth
              helperText={errors.name?.message}
              label="Name"
              {...register('name')}
            />
            <TextField
              error={Boolean(errors.icon)}
              fullWidth
              helperText={errors.icon?.message}
              label="Icon"
              {...register('icon')}
            />
            <Controller
              control={control}
              name="active"
              render={({ field }) => (
                <FormControlLabel
                  control={<Switch checked={field.value} onBlur={field.onBlur} onChange={field.onChange} />}
                  label="Active"
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button color="inherit" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={isSubmitting || saving} type="submit" variant="contained">
            {category ? 'Save Changes' : 'Add Category'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export function CategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, error, saving, status } = useAppSelector((state) => state.categories);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleOpenCreate = () => {
    setSelectedCategory(null);
    setDialogOpen(true);
  };

  const handleSubmit = async (values) => {
    await dispatch(saveCategory({ id: selectedCategory?.id, values })).unwrap();
  };

  return (
    <Stack spacing={3}>
      <Stack
        alignItems={{ xs: 'stretch', sm: 'center' }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4">Categories</Typography>
          <Typography color="text.secondary" mt={0.75} variant="body2">
            Maintain the grocery category catalog.
          </Typography>
        </Box>
        <Button onClick={handleOpenCreate} startIcon={<Plus size={18} />} variant="contained">
          Add Category
        </Button>
      </Stack>

      {error ? <Alert severity="error">{error}</Alert> : null}

      <TableContainer
        sx={{
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Icon</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Created Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === 'loading' ? (
              <TableRow>
                <TableCell align="center" colSpan={5} sx={{ py: 6 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : null}
            {categories.map((category) => (
              <TableRow hover key={category.id}>
                <TableCell sx={{ fontSize: 24, width: 84 }}>{category.icon}</TableCell>
                <TableCell>{category.name}</TableCell>
                <TableCell>{formatDate(category.createdDate)}</TableCell>
                <TableCell>
                  <Chip
                    color={category.active ? 'success' : 'default'}
                    label={category.active ? 'Active' : 'Inactive'}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit category">
                    <IconButton
                      aria-label={`Edit ${category.name}`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit size={18} />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryDialog
        category={selectedCategory}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        open={dialogOpen}
        saving={saving}
      />
    </Stack>
  );
}
