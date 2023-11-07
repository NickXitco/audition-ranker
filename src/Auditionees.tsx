import { useSelector } from 'react-redux'
import { AuditioneeBrief } from './components/AuditioneeBrief/AuditioneeBrief'
import { RootState } from './store'
import { useLocation } from 'react-router'

export const Auditionees = () => {
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)
	const location = useLocation()
	const searchParams = new URLSearchParams(location.search)

	const filteredAuditionees = auditionees.filter((auditionee) => {
		let allowed = true

		if (searchParams.has('voice_part')) {
			allowed = auditionee.vocalPart.includes(searchParams.get('voice_part')!)
		}

		if (searchParams.has('gender')) {
			allowed = auditionee.gender === searchParams.get('gender')
		}

		if (searchParams.has('role')) {
			allowed = auditionee.roles.includes(searchParams.get('role')!)
		}

		if (searchParams.has('music_reading')) {
			allowed = auditionee.musicReading === searchParams.get('music_reading')
		}

		return allowed
	})

	return (
		<section>
			<h2>
				{filteredAuditionees.length} auditionees {location.search && `with ${location.search.replace('?', '')}`}
			</h2>
			<ul className={'auditionees_list'}>
				{filteredAuditionees.map((auditionee, i) => (
					<li key={auditionee.email}>
						<AuditioneeBrief {...auditionee} />
					</li>
				))}
			</ul>
		</section>
	)
}
