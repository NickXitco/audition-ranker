import { ComposedAuditionee } from '../server/src/backend_types'

type Roles =
	| 'Ilona Ritter'
	| 'Amalia Balash'
	| 'Ensemble'
	| 'Ladislav Sipos'
	| 'Steven Kodaly'
	| 'Georg Nowack'
	| 'Mr. Maraczek'
	| 'Arpad Laszlo'

export const getRoleShortName = (role: string) => {
	switch (role) {
		case 'Ilona Ritter':
			return 'Ilona'
		case 'Amalia Balash':
			return 'Amalia'
		case 'Ensemble':
			return 'Ensemble'
		case 'Ladislav Sipos':
			return 'Sipos'
		case 'Steven Kodaly':
			return 'Kodaly'
		case 'Georg Nowack':
			return 'Georg'
		case 'Mr. Maraczek':
			return 'Maraczek'
		case 'Arpad Laszlo':
			return 'Arpad'
	}
}

export const bucketValues = (bucket: 'good' | 'okay' | 'bad') => {
	switch (bucket) {
		case 'good':
			return {
				high: 10,
				low: 6.7,
			}
		case 'okay':
			return {
				high: 6.6,
				low: 3.4,
			}
		case 'bad':
			return {
				high: 3.3,
				low: 0,
			}
	}
}

export const getAllAuditioneesInRange = (
	auditionees: ComposedAuditionee[],
	scoreID: string,
	high: number,
	low: number
) => {
	return auditionees.filter((auditionee) => {
		const scoreObject = auditionee.scores?.[scoreID]
		if (!scoreObject) return false
		if (!scoreObject.locked) return false
		const score = scoreObject.value
		if (!score) return false
		return score <= high && score >= low
	})
}

export const getScoreColor = (score: number) => {
	if (score >= bucketValues('good').low) return 'rgba(0, 255, 0, 0.5)'
	if (score >= bucketValues('okay').low) return 'rgba(255,255,0,0.5)'
	if (score >= bucketValues('bad').low) return 'rgba(255,0,0,0.5)'
	return 'rgba(110,110,110,0.5)'
}

export const saveToLocalStorage = (state: any) => {
	try {
		const serializedState = JSON.stringify(state)
		localStorage.setItem('state', serializedState)
	} catch (err) {
		console.log(err)
	}
}

export const loadFromLocalStorage = () => {
	try {
		const serializedState = localStorage.getItem('state')
		if (serializedState === null) return undefined
		return JSON.parse(serializedState)
	} catch (err) {
		console.log(err)
		return undefined
	}
}
