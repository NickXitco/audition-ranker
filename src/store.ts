import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { auditioneesReducer, AuditioneeState } from './reducers/auditioneesReducer'
import { ComposedAuditionee } from '../server/src/backend_types'

export interface RootState {
	auditionees: AuditioneeState
}

const rootReducer = combineReducers({
	auditionees: auditioneesReducer,
})

export const store = configureStore({
	reducer: rootReducer,
})
