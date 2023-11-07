import { ComposedAuditionee } from '../../server/src/backend_types'

enum AuditioneeActionType {
	SET_AUDITIONEES = 'SET_AUDITIONEES',
	ADD_AUDITIONEE = 'ADD_AUDITIONEE',
	REMOVE_AUDITIONEE = 'REMOVE_AUDITIONEE',
	UPDATE_AUDITIONEE = 'UPDATE_AUDITIONEE',
}

export const setAuditionees = (auditionees: ComposedAuditionee[]) => ({
	type: AuditioneeActionType.SET_AUDITIONEES,
	payload: auditionees,
})

export const addAuditionee = (auditionee: ComposedAuditionee) => ({
	type: AuditioneeActionType.ADD_AUDITIONEE,
	payload: auditionee,
})

export const removeAuditionee = (auditionee: ComposedAuditionee) => ({
	type: AuditioneeActionType.REMOVE_AUDITIONEE,
	payload: auditionee,
})

export const updateAuditionee = (auditionee: ComposedAuditionee) => ({
	type: AuditioneeActionType.UPDATE_AUDITIONEE,
	payload: auditionee,
})

interface AuditioneeAction {
	type: AuditioneeActionType
	payload: any
}

export interface AuditioneeState {
	auditionees: ComposedAuditionee[]
}

const initialState: AuditioneeState = {
	auditionees: [],
}
export const auditioneesReducer = (state = initialState, action: AuditioneeAction): AuditioneeState => {
	switch (action.type) {
		case 'SET_AUDITIONEES':
			return {
				...state,
				auditionees: action.payload,
			}
		case 'ADD_AUDITIONEE':
			return {
				...state,
				auditionees: [...state.auditionees, action.payload],
			}
		case 'REMOVE_AUDITIONEE':
			return {
				...state,
				auditionees: state.auditionees.filter((auditionee) => auditionee.email !== action.payload.email),
			}
		case 'UPDATE_AUDITIONEE':
			return {
				...state,
				auditionees: state.auditionees.map((auditionee) => {
					if (auditionee.email === action.payload.email) {
						return action.payload
					}
					return auditionee
				}),
			}
		default:
			return state
	}
}
