import { ComposedAuditionee } from '../../server/src/backend_types'

enum AuditioneeActionType {
	SET_AUDITIONEES = 'SET_AUDITIONEES',
	ADD_AUDITIONEE = 'ADD_AUDITIONEE',
	REMOVE_AUDITIONEE = 'REMOVE_AUDITIONEE',
	UPDATE_AUDITIONEE = 'UPDATE_AUDITIONEE',
	UPDATE_MULTIPLE_AUDITIONEES = 'UPDATE_MULTIPLE_AUDITIONEES',
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

export const updateMultipleAuditionees = (auditionees: ComposedAuditionee[]) => ({
	type: AuditioneeActionType.UPDATE_MULTIPLE_AUDITIONEES,
	payload: auditionees,
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
				auditionees: state.auditionees.filter((auditionee) => auditionee.id !== action.payload.id),
			}
		case 'UPDATE_AUDITIONEE':
			return {
				...state,
				auditionees: state.auditionees.map((auditionee) => {
					if (auditionee.id === action.payload.id) {
						return action.payload
					}
					return auditionee
				}),
			}
		case 'UPDATE_MULTIPLE_AUDITIONEES':
			return {
				...state,
				auditionees: state.auditionees.map((auditionee) => {
					const updatedAuditionee = action.payload.find(
						(newAuditionee: ComposedAuditionee) => newAuditionee.id === auditionee.id
					)
					if (updatedAuditionee) {
						return updatedAuditionee
					}
					return auditionee
				}),
			}
		default:
			return state
	}
}
