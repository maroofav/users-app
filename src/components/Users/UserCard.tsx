import { memo, useState } from 'react'
import {
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  CardActions,
} from '@mui/material'
import { Person } from '@mui/icons-material'
import { User } from '@ts/user.types'
import UserModal from './UserModal'
import { getAvatar } from './UserUtils'
import { GradientBox } from '@themes/default/styledComponents'

interface UserCardProps {
  user: User
}

const UserCard = memo(({ user }: UserCardProps) => {
  const [modalOpen, setModalOpen] = useState(false)

  const handleViewMore = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <Card
        data-testid="user-card"
        className="user-card bg-white hover:shadow-xl transition-all duration-300"
      >
        {/* Top section with gradient background and avatar */}
        <GradientBox>
          <Avatar
            data-testid="user-avatar"
            src={getAvatar(user.avatar, '200')}
            alt={user.username}
            className="user-card-avatar"
          >
            <Person sx={{ fontSize: 40 }} />
          </Avatar>
        </GradientBox>

        {/* Content section */}
        <CardContent sx={{ flexGrow: 1, textAlign: 'center', py: 3, px: 2 }}>
          {/* User Name */}
          <Typography
            data-testid="user-name"
            variant="h6"
            component="h2"
            fontWeight="600"
            gutterBottom
            sx={{
              color: 'text.primary',
              mb: 1.5,
              fontSize: '1.2rem',
            }}
          >
            {user.firstname} {user.lastname}
          </Typography>

          {/* Description */}
          <Typography
            data-testid="user-description"
            variant="body2"
            component="p"
            fontWeight="500"
            color="text.secondary"
            sx={{
              lineHeight: 1.5,
              paddingLeft: '1px',
              marginBottom: '0px',
              fontSize: '0.9rem',
              opacity: 0.8,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {user.description || 'No description available'}
          </Typography>
        </CardContent>

        {/* Action section */}
        <CardActions sx={{ justifyContent: 'center', pb: 3, pt: 0 }}>
          <Button
            data-testid="view-more-button"
            variant="contained"
            onClick={handleViewMore}
            className="gradient-btn transition-all duration-200"
          >
            View More
          </Button>
        </CardActions>
      </Card>

      <UserModal user={user} open={modalOpen} onClose={handleCloseModal} />
    </>
  )
})

export default UserCard
