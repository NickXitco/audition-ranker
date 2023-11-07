import { ComposedAuditionee } from '../server/src/backend_types'
import { FC } from 'react'
import { AuditioneeFull } from './components/AuditioneeFull/AuditioneeFull'
import { useLocation, useParams } from 'react-router'
import { RootState } from './store'
import { useSelector } from 'react-redux'
import styles from './Auditionee.module.scss'

export const Auditionee = () => {
	const params = useParams()
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)

	const auditionee = auditionees.find((auditionee) => auditionee.id === params.id)

	if (!auditionee) {
		return (
			<div>
				<h2>Could not find auditionee with id {params.id}</h2>
			</div>
		)
	}

	return <AuditioneeFull {...auditionee} />
}
