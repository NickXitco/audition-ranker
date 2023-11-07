import { Router } from 'express'
import { parse } from 'node-html-parser'
import { ComposedAuditionee, Header } from '../backend_types'
import Papa from 'papaparse'

const router = Router()

const session_id = process.env.SESSIONID || 'hzbcwnyq71p2y0v2q01l4iqaacij7cg6'
const csrf_token = process.env.CSRFTOKEN || 'FRzjIB8sS8xt1c745lCLIagT8yAhs1CmAQl6Xth2ayOMYY9G11xp42IO7lzNIFGZ'

router.get('/', async (req, res) => {
	const csv: any[] = await getCSV()
	const tableData = await getPhotosAndIds()

	if (!csv || !tableData) {
		return res.status(500).send('Error retrieving data')
	}

	const reducedData = reduceData(csv, tableData)

	res.json(reducedData)
})

const reduceData = (csv: any[], tableData: Record<Header, string>[]) => {
	if (csv.length !== tableData.length) {
		console.error('Lengths do not match', csv.length, tableData.length)
		return
	}

	const rows = []

	for (let i = 0; i < csv.length; i++) {
		const csvRow = csv[i]
		const tableRow = tableData[i]

		const name = `${csvRow['First']} ${csvRow['Last']}`
		const tableName = tableRow.Name

		if (name !== tableName) {
			console.error('Names do not match', name, tableName)
			return
		}

		const conflictDatesHeaders = Object.keys(csvRow).filter((key) => key.match(/[0-9]{1,2}\/[0-9]{1,2}/))

		const conflictDates: Record<string, boolean> = {}
		for (const header of conflictDatesHeaders) {
			conflictDates[header] = csvRow[header] === 'X'
		}

		const composedObject: ComposedAuditionee = {
			name: tableName,
			id: tableRow['Id'],
			resumeLink: tableRow['Resume Link'],
			photoLink: tableRow['Photo Link'],
			signUpDate: tableRow['Sign Up Date'],
			appointment: tableRow['Time Slot'],
			roles: csvRow['Consider for'].split(', '),
			email: csvRow['Email'],
			address: {
				line1: csvRow['Address line 1'],
				line2: csvRow['Address line 2'],
				city: csvRow['City'],
				state: csvRow['State'],
				zip: csvRow['ZIP'],
			},
			phone: (csvRow['Cell phone'] || csvRow['Home phone']).replace(/[^0-9]/g, ''),
			gender: tableRow.Gender,
			pronouns: csvRow['Pronouns'],
			overEighteen: csvRow['Over 18'] === 'Yes',
			musicReading: csvRow['read music'],
			vocalPart: csvRow['Vocal Part'],
			danceExperience: {
				jazz: csvRow['Jazz'],
				tap: csvRow['Tap'],
				ballet: csvRow['Ballet'],
				ballroom: csvRow['Ballroom'],
				tumbling: csvRow['tumbling/gymnastics'],
			},
			performanceConflicts: csvRow['performance conflict'],
			rolesQ: csvRow['Roles'],
			understudy: csvRow['understudy role'],
			intimacy: csvRow['Intimacy'],
			appearance: csvRow['Appearance'],
			conflictDates: conflictDates,
			conflictNotes: csvRow['Conflict notes'],
		}

		rows.push(composedObject)
	}

	return rows
}

const getRequestOptions = (): RequestInit => {
	const myHeaders = new Headers()
	myHeaders.append('Cookie', `csrftoken=${csrf_token}; sessionid=${session_id}`)

	return {
		method: 'GET',
		headers: myHeaders,
	}
}

const getCSV = async () => {
	let csvData = ''
	await fetch('https://www.theaterforms.com/audition/getcsv/georgetownpalace/SheLovesMe/all/', getRequestOptions())
		.then((response) => response.text())
		.then((result) => (csvData = result))
		.catch((error) => console.log('error', error))

	const csvObject = Papa.parse(csvData, { header: true })

	if (!csvObject || !csvObject.data) {
		return []
	}

	const numFields = csvObject.meta.fields?.length || 0

	// Return rows that contain the correct number of fields
	csvObject.data = csvObject.data.filter((row: any) => Object.keys(row).length === numFields)

	return csvObject.data
}

const cleanHeader = (header: string): string => {
	let cleanedHeader = header.trim()
	cleanedHeader = cleanedHeader.replace('•', '')

	if (cleanedHeader === 'Signed up') {
		return 'Sign Up Date'
	}

	if (cleanedHeader === 'Time slot') {
		return 'Time Slot'
	}

	if (cleanedHeader === 'Name (first last)') {
		return 'Name'
	}

	if (cleanedHeader === 'Gdr') {
		return 'Gender'
	}

	return cleanedHeader
}

const getPhotosAndIds = async () => {
	let table = ''
	await fetch('https://www.theaterforms.com/audition/signups/georgetownpalace/SheLovesMe/', getRequestOptions())
		.then((response) => response.text())
		.then((result) => (table = result))
		.catch((error) => console.log('error', error))

	if (!table) {
		return null
	}

	const root = parse(table)

	const tableRows = root.querySelectorAll('table.infotable tr')

	if (tableRows.length === 0) {
		console.error('No table rows found')
		return
	}

	const tableHeaders = tableRows[0].querySelectorAll('th')
	const headers: Header[] = []

	let id = ''

	for (let i = 0; i < tableHeaders.length; i++) {
		let headerText = cleanHeader(tableHeaders[i].textContent)

		if (headerText === 'Actions') {
			continue
		}

		if (headerText === 'Information') {
			headers.push('Photo Link', 'Resume Link')
			continue
		}

		headers.push(headerText as Header)
	}

	const remainingRows = tableRows.slice(1)
	const tableData = []
	for (const row of remainingRows) {
		const rowData = row.querySelectorAll('td')
		const rowObject: Record<string, string> = {}

		for (let i = 0; i < rowData.length; i++) {
			const cell = rowData[i]
			const header = headers[i]

			if (!header) {
				continue
			}

			const link = cell.querySelector('a')?.getAttribute('href') || ''

			if (header === 'Photo Link' || header === 'Resume Link') {
				rowObject[header] = link ? `https://www.theaterforms.com${link}` : ``
			} else {
				rowObject[header] = cell.textContent.trim() || ''

				if (link.includes('auditioner')) {
					id = link.split('/')[5]
					rowObject['Id'] = id
				}
			}
		}
		tableData.push(rowObject)
	}

	return tableData
}

export default router
