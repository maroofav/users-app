import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import ruleSetsReducer from './ruleSetsSlice'

const persistConfig = {
  key: 'users-app',
  storage,
}

const persistedReducer = persistReducer(persistConfig, ruleSetsReducer)

export const store = configureStore({
  reducer: {
    ruleSets: persistedReducer,
  },
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
