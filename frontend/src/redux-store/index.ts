// Copyright © 2023 Navarrotech

import type { PayloadAction } from '@reduxjs/toolkit'

// Store
import { configureStore } from '@reduxjs/toolkit'

// Core
import game from './game'
import { NODE_ENV } from '../env'
import {
  TypedUseSelectorHook,
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector
} from 'react-redux'

const store = configureStore({
  reducer: {
    game: game.reducer,
  },
  middleware: getDefaultMiddleware =>
  getDefaultMiddleware({
    thunk: true
  }),
  devTools: NODE_ENV === 'development'
})

export const dispatch = store.dispatch;
export const getState = store.getState;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type CreateAction<T> = (payload: T) => PayloadAction<T>
// Inferred dispatch with everything we need!
export type AppDispatch = typeof store.dispatch

type DispatchFunc = () => AppDispatch
export const useDispatch: DispatchFunc = useDefaultDispatch
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector

export default store;