import { ComposedAuditionee } from '../server/src/backend_types'
import { BarChart } from './components/BarChart/BarChart'
import { useSelector } from 'react-redux'
import { RootState } from './store'

export const Home = () => {
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)

	return (
		<main>
			{auditionees && auditionees.length > 0 && (
				<div className={'stat_grid'}>
					<article>
						<h2>Gender Breakdown</h2>
						<BarChart data={getGenderData(auditionees)} param={'gender'} />
					</article>
					<article>
						<h2>Interested Breakdown</h2>
						<BarChart data={getInterestedRoleData(auditionees)} param={'role'} />
					</article>
					<article>
						<h2>Vocal Part Breakdown</h2>
						<BarChart data={getVocalPartData(auditionees)} param={'voice_part'} />
					</article>
				</div>
			)}
		</main>
	)
}

function getGenderData(auditionees: ComposedAuditionee[]) {
	const genderCounts: Record<string, number> = {}
	for (const auditionee of auditionees) {
		if (genderCounts[auditionee.gender]) {
			genderCounts[auditionee.gender]++
		} else {
			genderCounts[auditionee.gender] = 1
		}
	}

	return Object.entries(genderCounts).map(([label, value]) => ({
		label,
		value,
		color: getGenderBreakdownColor(label),
	}))
}

function getInterestedRoleData(auditionees: ComposedAuditionee[]) {
	const interestedCounts: Record<string, number> = {}
	for (const auditionee of auditionees) {
		for (const role of auditionee.roles) {
			if (interestedCounts[role]) {
				interestedCounts[role]++
			} else {
				interestedCounts[role] = 1
			}
		}
	}

	return Object.entries(interestedCounts)
		.map(([label, value]) => ({
			label,
			value,
		}))
		.sort((a, b) => b.value - a.value)
}
function getVocalPartData(auditionees: ComposedAuditionee[]) {
	const vocalPart: Record<string, number> = {}
	for (const auditionee of auditionees) {
		for (const part of auditionee.vocalPart.split(', ')) {
			if (vocalPart[part]) {
				vocalPart[part]++
			} else {
				vocalPart[part] = 1
			}
		}
	}

	return Object.entries(vocalPart)
		.map(([label, value]) => ({
			label,
			value,
		}))
		.sort((a, b) => b.value - a.value)
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
