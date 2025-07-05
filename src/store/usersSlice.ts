import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User } from '@ts/user.types'
import { axiosInstance } from '@utils/axiosInstance'
import ENDPOINTS from '@utils/apiEndpoints'

/**
 * Redux slice for managing users in the application.
 *
 * This slice handles the state management for collections of users,
 * including operations like creating, updating, and deleting users.
 */

/**
 * State interface for the users slice
 * @interface UsersState
 * @property {User[]} users - Array of all users
 * @property {boolean} loading - Whether a request is in progress
 * @property {string | null} error - Error message if a request fails
 */
interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
}

// Async thunk for fetching users
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axiosInstance.get(ENDPOINTS.USERS)
  return response.data?.data?.users || []
})

/**
 * Redux slice containing reducers for user management
 *
 * Reducers:
 * - addUser: Adds a new user to the collection
 * - updateUser: Updates an existing user in the collection
 * - deleteUser: Removes a user from the collection
 */
const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.users.push(action.payload)
    },
    updateUser: (state, action: PayloadAction<User>) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id,
      )
      if (index !== -1) {
        state.users[index] = action.payload
      }
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.users = state.users.filter((user) => user.id !== action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

export const { addUser, updateUser, deleteUser } = usersSlice.actions
export default usersSlice.reducer
