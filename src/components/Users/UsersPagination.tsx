import { memo } from 'react'
import {
  Box,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Stack,
  IconButton,
  SelectChangeEvent,
} from '@mui/material'
import {
  FirstPage,
  LastPage,
  NavigateBefore,
  NavigateNext,
} from '@mui/icons-material'

interface UsersPaginationProps {
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (itemsPerPage: number) => void
  loading?: boolean
}

const UsersPagination = memo(
  ({
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
    loading = false,
  }: UsersPaginationProps) => {
    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
      onPageChange(page)
    }

    const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
      onItemsPerPageChange(Number(event.target.value))
    }

    const handleFirstPage = () => {
      onPageChange(1)
    }

    const handleLastPage = () => {
      onPageChange(totalPages)
    }

    const handlePreviousPage = () => {
      if (currentPage > 1) {
        onPageChange(currentPage - 1)
      }
    }

    const handleNextPage = () => {
      if (currentPage < totalPages) {
        onPageChange(currentPage + 1)
      }
    }

    // Calculate the range of items being displayed
    const startItem =
      totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    if (totalItems === 0) {
      return null
    }

    return (
      <Box
        data-testid="users-pagination"
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          mt: 4,
          p: 2,
          borderRadius: 2,
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        {/* Items per page selector */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel data-testid="items-per-page-label">
              Items per page
            </InputLabel>
            <Select
              data-testid="items-per-page-select"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              label="Items per page"
              disabled={loading}
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={18}>18</MenuItem>
              <MenuItem value={24}>24</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </FormControl>

          <Typography
            data-testid="pagination-info"
            variant="body2"
            color="text.secondary"
            sx={{ whiteSpace: 'nowrap' }}
          >
            Showing {startItem}-{endItem} of {totalItems} items
          </Typography>
        </Stack>

        {/* Pagination controls */}
        <Stack direction="row" alignItems="center" spacing={1}>
          {/* First page button */}
          <IconButton
            data-testid="first-page-button"
            onClick={handleFirstPage}
            disabled={currentPage === 1 || loading}
            size="small"
            sx={{ bgcolor: 'action.hover' }}
          >
            <FirstPage />
          </IconButton>

          {/* Previous page button */}
          <IconButton
            data-testid="previous-page-button"
            onClick={handlePreviousPage}
            disabled={currentPage === 1 || loading}
            size="small"
            sx={{ bgcolor: 'action.hover' }}
          >
            <NavigateBefore />
          </IconButton>

          {/* Page numbers */}
          <Pagination
            data-testid="page-numbers"
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            disabled={loading}
            color="primary"
            shape="rounded"
            showFirstButton={false}
            showLastButton={false}
            siblingCount={1}
            boundaryCount={1}
          />

          {/* Next page button */}
          <IconButton
            data-testid="next-page-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
            size="small"
            sx={{ bgcolor: 'action.hover' }}
          >
            <NavigateNext />
          </IconButton>

          {/* Last page button */}
          <IconButton
            data-testid="last-page-button"
            onClick={handleLastPage}
            disabled={currentPage === totalPages || loading}
            size="small"
            sx={{ bgcolor: 'action.hover' }}
          >
            <LastPage />
          </IconButton>
        </Stack>

        {/* Page info */}
        <Typography
          data-testid="page-info"
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Page {currentPage} of {totalPages}
        </Typography>
      </Box>
    )
  },
)

export default UsersPagination
