import { FC } from 'react'
import styles from './ScoringTable.module.scss'

interface ScoringTableProps {
	id: string
}

const roles = [
	'Ilona Ritter',
	'Amalia Balash',
	'Ensemble',
	'Ladislav Sipos',
	'Steven Kodaly',
	'Georg Nowack',
	'Mr. Maraczek',
	'Arpad Laszlo',
]

export const ScoringTable: FC<ScoringTableProps> = (props) => {
	return (
		<div className={styles.container}>
			{roles.map((role, i) => (
				<Scorer key={i} role={role} id={props.id} />
			))}
		</div>
	)
}

export const Scorer: FC<{ role: string; id: string }> = (props) => {
	return <div className={styles.scorer_container}>{props.role}</div>
}
