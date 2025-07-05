import { memo } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Avatar,
  Grid2 as Grid,
  Divider,
  Stack,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Close,
  Person,
  Email,
  AccountCircle,
  Assignment,
  CalendarToday,
} from '@mui/icons-material'
import { User } from '@ts/user.types'
import { getAvatar } from './UserUtils'

interface UserModalProps {
  user: User
  open: boolean
  onClose: () => void
}

const UserModal = memo(({ user, open, onClose }: UserModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '500px',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h2" component="h2" fontWeight="bold">
            User Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Profile Section */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              textAlign="center"
            >
              <Avatar
                data-testid="modal-avatar"
                src={getAvatar(user.avatar, '200')}
                alt={user.username}
                className="large-avatar"
              >
                <Person sx={{ fontSize: 60 }} />
              </Avatar>
              <Typography
                variant="h2"
                fontWeight="bold"
                gutterBottom
                marginBottom={1.5}
              >
                {user.firstname} {user.lastname}
              </Typography>
              <Chip
                label={user.role}
                color="primary"
                variant="outlined"
                size="medium"
                sx={{ mb: 2 }}
              />
            </Box>
          </Grid>

          {/* Details Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Box>
                <Typography
                  variant="h3"
                  gutterBottom
                  marginBottom={1}
                  color="primary"
                >
                  Personal Information
                </Typography>
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <AccountCircle color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Username
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.username}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Email color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <Assignment color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Role
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.role}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    <CalendarToday color="action" />
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Join Date
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {user.join_date}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>

              <Divider />

              <Box paddingRight={3} className="text-justify">
                <Typography variant="h3" gutterBottom color="primary">
                  Description
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                  {user.description || 'No description available'}
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ mt: 2, px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="contained" className="gradient-btn">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
})

export default UserModal
