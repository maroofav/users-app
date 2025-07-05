import { memo, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Alert,
  Container,
  Paper,
  Skeleton,
  Fade,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { People } from '@mui/icons-material'
import { RootState, AppDispatch } from '@store/index'
import { fetchUsers, setItemsPerPage, setCurrentPage } from '@store/usersSlice'
import { User } from '@ts/user.types'
import UserCard from '@components/Users/UserCard'
import UsersPagination from '@components/Users/UsersPagination'

const Users = memo(() => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    users,
    loading,
    error,
    currentPage,
    totalPages,
    itemsPerPage,
    totalItems,
  } = useSelector((state: RootState) => state.users)

  // Fetch users when component mounts or when pagination changes
  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, limit: itemsPerPage }))
  }, [dispatch, currentPage, itemsPerPage])

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      dispatch(setCurrentPage(page))
    },
    [dispatch],
  )

  // Handle items per page change
  const handleItemsPerPageChange = useCallback(
    (newItemsPerPage: number) => {
      dispatch(setItemsPerPage(newItemsPerPage))
    },
    [dispatch],
  )

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert
          data-testid="error-alert"
          severity="error"
          sx={{ borderRadius: 2 }}
        >
          <Typography variant="h6" gutterBottom>
            Error Loading Users
          </Typography>
          <Typography variant="body2">{error}</Typography>
        </Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }} className="min-h-screen">
      {/* Header */}
      <Paper
        elevation={0}
        sx={{
          p: 4,
          mb: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 3,
        }}
        className="shadow-lg"
      >
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <People sx={{ fontSize: 40 }} />
          <Typography variant="h2" component="h1" fontWeight="bold">
            Users
          </Typography>
        </Box>
        <Typography variant="h3" sx={{ opacity: 0.9 }}>
          Manage and view user information across your organization
        </Typography>
      </Paper>

      {/* Loading State */}
      {loading && (
        <Grid container spacing={3}>
          {[...Array(itemsPerPage)].map((_, index) => (
            <Grid
              size={{ xs: 12, sm: 6, md: 4 }}
              key={index}
              data-testid="loading-skeleton"
            >
              <Paper sx={{ p: 2, borderRadius: 2 }} className="shadow-md">
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Skeleton
                    variant="circular"
                    width={80}
                    height={80}
                    sx={{ mb: 2 }}
                  />
                  <Skeleton
                    variant="text"
                    width="80%"
                    height={32}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="60%"
                    height={24}
                    sx={{ mb: 1 }}
                  />
                  <Skeleton
                    variant="text"
                    width="70%"
                    height={24}
                    sx={{ mb: 2 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    width={100}
                    height={36}
                    sx={{ borderRadius: 1 }}
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Users Grid */}
      {!loading && (
        <Fade in={!loading} timeout={600}>
          <Box>
            {!users || users.length === 0 ? (
              <Paper
                data-testid="no-users-found"
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
                className="shadow-md"
              >
                <People sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h3" color="text.secondary" gutterBottom>
                  No users found
                </Typography>
                <Typography variant="h4" color="text.secondary">
                  No users available at the moment
                </Typography>
              </Paper>
            ) : (
              <>
                <Typography
                  data-testid="users-count"
                  variant="h3"
                  gutterBottom
                  sx={{ mb: 3 }}
                  className="text-gray-700"
                >
                  {totalItems} user{totalItems !== 1 ? 's' : ''} found
                </Typography>

                <Grid container spacing={3}>
                  {users.map((user: User) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
                      <UserCard user={user} />
                    </Grid>
                  ))}
                </Grid>

                {/* Pagination Controls */}
                <UsersPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalItems}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  loading={loading}
                />
              </>
            )}
          </Box>
        </Fade>
      )}
    </Container>
  )
})

export default Users
