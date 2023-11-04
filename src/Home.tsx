import { useEffect, useState } from 'react'
import { ComposedAuditionee } from '../server/src/backend_types'
import { BarChart } from './components/BarChart'

export const Home = () => {
	const [auditionees, setAuditionees] = useState<ComposedAuditionee[]>([])

	useEffect(() => {
		fetch('api/audition_package')
			.then((response) => response.json())
			.then((data) => setAuditionees(data))
	}, [])

	const genderCounts: Record<string, number> = {}
	for (const auditionee of auditionees) {
		if (genderCounts[auditionee.gender]) {
			genderCounts[auditionee.gender]++
		} else {
			genderCounts[auditionee.gender] = 1
		}
	}

	const genderData = Object.entries(genderCounts).map(([label, value]) => ({
		label,
		value,
		color: getGenderBreakdownColor(label),
	}))

	return (
		<main>
			<div className={'stat_grid'}>
				<article>
					<h2>Gender Breakdown</h2>
					<BarChart data={genderData} />
				</article>
			</div>
		</main>
	)
}

const getGenderBreakdownColor = (label: string) => {
	switch (label) {
		case 'F':
			return 'linear-gradient(66deg, rgba(255,200,254,1) 6%, rgba(226,180,255,1) 100%)'
		case 'M':
			return 'linear-gradient(66deg, rgba(200,217,255,1) 6%, rgba(74,148,215,1) 100%)'
		default:
			return 'linear-gradient(66deg, rgba(200,255,209,1) 6%, rgba(74,215,83,1) 100%)'
	}
}
