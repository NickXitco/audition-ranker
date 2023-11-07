export type Header = 'Sign Up Date' | 'Time Slot' | 'Name' | 'Gender' | 'Photo Link' | 'Resume Link' | 'Id'

export interface ComposedAuditionee {
	name: string
	id: string
	resumeLink: string
	photoLink: string
	signUpDate: string
	appointment: string
	roles: string[]
	email: string
	address: {
		line1: string
		line2: string
		city: string
		state: string
		zip: string
	}
	phone: string
	gender: string
	pronouns: string
	overEighteen: boolean
	musicReading: string
	vocalPart: string
	danceExperience: {
		jazz: string
		tap: string
		ballet: string
		ballroom: string
		tumbling: string
	}
	performanceConflicts: string
	rolesQ: string
	understudy: string
	intimacy: string
	appearance: string
	conflictDates: Record<string, boolean>
	conflictNotes: string
}
