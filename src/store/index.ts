import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import usersReducer from './usersSlice'

const persistConfig = {
  key: 'users-app',
  storage,
}

const persistedReducer = persistReducer(persistConfig, usersReducer)

export const store = configureStore({
  reducer: {
    users: persistedReducer,
  },
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
