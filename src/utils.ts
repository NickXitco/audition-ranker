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
