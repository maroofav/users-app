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
 * Pagination parameters interface
 * @interface PaginationParams
 * @property {number} page - Current page number (1-based)
 * @property {number} limit - Number of items per page
 */
interface PaginationParams {
  page: number
  limit: number
}

/**
 * State interface for the users slice
 * @interface UsersState
 * @property {User[]} users - Array of users for current page
 * @property {boolean} loading - Whether a request is in progress
 * @property {string | null} error - Error message if a request fails
 * @property {number} currentPage - Current page number (1-based)
 * @property {number} totalPages - Total number of pages
 * @property {number} itemsPerPage - Number of items per page
 * @property {number} totalItems - Total number of items
 */
interface UsersState {
  users: User[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  itemsPerPage: number
  totalItems: number
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  itemsPerPage: 12,
  totalItems: 0,
}

// Async thunk for fetching users with pagination
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params: PaginationParams = { page: 1, limit: 12 }) => {
    const response = await axiosInstance.get(ENDPOINTS.USERS, {
      params: {
        page: params.page,
        limit: params.limit,
      },
    })

    const allUsers = response.data?.data?.users || []
    const totalItems = allUsers.length
    const totalPages = Math.ceil(totalItems / params.limit)
    const startIndex = (params.page - 1) * params.limit
    const endIndex = startIndex + params.limit
    const users = allUsers.slice(startIndex, endIndex)

    return {
      users,
      totalItems,
      totalPages,
      currentPage: params.page,
      itemsPerPage: params.limit,
    }
  },
)

/**
 * Redux slice containing reducers for user management
 *
 * Reducers:
 * - addUser: Adds a new user to the collection
 * - updateUser: Updates an existing user in the collection
 * - deleteUser: Removes a user from the collection
 * - setItemsPerPage: Updates the number of items per page
 * - setCurrentPage: Updates the current page number
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
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.itemsPerPage = action.payload
      state.currentPage = 1 // Reset to first page when changing items per page
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload
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
        state.users = action.payload.users
        state.totalItems = action.payload.totalItems
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
        state.itemsPerPage = action.payload.itemsPerPage
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

export const {
  addUser,
  updateUser,
  deleteUser,
  setItemsPerPage,
  setCurrentPage,
} = usersSlice.actions
export default usersSlice.reducer
