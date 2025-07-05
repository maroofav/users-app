import { memo } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { axiosInstance } from '@utils/axiosInstance'
import ENDPOINTS from '@utils/apiEndpoints'
import { User } from '@ts/user.types'
import UserCard from '@components/Users/UserCard'

const Users = memo(() => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosInstance.get(ENDPOINTS.USERS)
      return response.data?.data?.users || []
    },
  })

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Users
          </Typography>
          <Typography variant="body2">
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred'}
          </Typography>
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
        <Typography variant="h3" sx={{ opacity: 0.9 }} fontWeight="normal">
          Manage and view user information across your organization
        </Typography>
      </Paper>

      {/* Loading State */}
      {isLoading && (
        <Grid container spacing={3}>
          {[...Array(6)].map((_, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
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
      {!isLoading && (
        <Fade in={!isLoading} timeout={600}>
          <Box>
            {!data || data.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: 'center',
                  borderRadius: 2,
                  bgcolor: 'grey.50',
                }}
                className="shadow-md"
              >
                <People sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No users found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No users available at the moment
                </Typography>
              </Paper>
            ) : (
              <>
                <Typography
                  variant="h3"
                  gutterBottom
                  sx={{ mb: 3 }}
                  className="text-gray-700"
                >
                  {data.length} user{data.length !== 1 ? 's' : ''} found
                </Typography>
                <Grid container spacing={3}>
                  {data.map((user: User) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
                      <UserCard user={user} />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}
          </Box>
        </Fade>
      )}
    </Container>
  )
})

export default Users
