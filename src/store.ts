import { combineReducers } from 'redux'
import { configureStore } from '@reduxjs/toolkit'
import { auditioneesReducer, AuditioneeState } from './reducers/auditioneesReducer'
import { ComposedAuditionee } from '../server/src/backend_types'
import { saveToLocalStorage } from './utils'
import throttle from 'lodash/throttle'

export interface RootState {
	auditionees: AuditioneeState
}

const rootReducer = combineReducers({
	auditionees: auditioneesReducer,
})

export const store = configureStore({
	reducer: rootReducer,
})

store.subscribe(
	throttle(() => {
		saveToLocalStorage(store.getState())
	}, 1000)
)
