import { FC } from 'react'
import styles from './ScoringTable.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { updateAuditionee } from '../../reducers/auditioneesReducer'
import { start } from 'repl'
import { bucketValues, getAllAuditioneesInRange, getScoreColor } from '../../utils'

interface ScoringTableProps {
	id: string
	tableID: string
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
				<Scorer key={i} role={role} id={props.id} tableID={props.tableID} />
			))}
		</div>
	)
}

interface ScorerProps extends ScoringTableProps {
	role: string
}
export const Scorer: FC<ScorerProps> = (props) => {
	const dispatch = useDispatch()
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)

	const auditionee = auditionees.find((auditionee) => auditionee.id === props.id)

	const scoreID = `${props.tableID} - ${props.role}`

	const scoreObject = auditionee?.scores?.[scoreID]
	const scoreValue = scoreObject?.value
	const scoreLocked = scoreObject?.locked

	const showInitialBuckets = !scoreObject
	const locked = scoreLocked || scoreValue !== undefined

	const scoring = !locked && !showInitialBuckets

	const lockScore = (score: number) => {
		if (!auditionee) return
		dispatch(
			updateAuditionee({
				...auditionee,
				scores: {
					...auditionee?.scores,
					[scoreID]: {
						value: score,
						locked: true,
					},
				},
			})
		)
	}

	const deleteScore = () => {
		if (!auditionee) return
		const scores = { ...auditionee?.scores }
		delete scores[scoreID]
		dispatch(
			updateAuditionee({
				...auditionee,
				scores,
			})
		)
	}

	const startUnlockedScore = (score: number) => {
		if (!auditionee) return
		dispatch(
			updateAuditionee({
				...auditionee,
				scores: {
					...auditionee?.scores,
					[scoreID]: {
						value: score,
						locked: false,
					},
				},
			})
		)
	}

	const startScoring = (bucket: 'good' | 'okay' | 'bad') => {
		if (!auditionee) return

		const { high, low } = bucketValues(bucket)
		const auditioneesInBucket = getAllAuditioneesInRange(auditionees, scoreID, high, low)

		if (auditioneesInBucket.length === 0) {
			lockScore(high)
			return
		}

		const sortedAuditionees = auditioneesInBucket.sort((a, b) => {
			const aScore = a.scores![scoreID]!.value
			const bScore = b.scores![scoreID]!.value

			return aScore - bScore
		})

		const middleIndex = Math.floor(sortedAuditionees.length / 2)
		const middleAuditionee = sortedAuditionees[middleIndex]
		const middleScore = middleAuditionee.scores![scoreID]!.value

		startUnlockedScore(middleScore)
	}

	return (
		<div
			className={styles.scorer_container}
			style={{
				backgroundColor: locked ? getScoreColor(scoreValue || -1) : 'white',
			}}
		>
			<h3>{props.role}</h3>
			{!showInitialBuckets && (
				<button title={'rerank'} className={styles.rerank_button} onClick={deleteScore}>
					<svg fill="#000000" viewBox="0 0 528.919 528.918">
						<path d="M70.846,324.059c3.21,3.926,8.409,3.926,11.619,0l69.162-84.621c3.21-3.926,1.698-7.108-3.372-7.108h-36.723    c-5.07,0-8.516-4.061-7.427-9.012c18.883-85.995,95.625-150.564,187.207-150.564c105.708,0,191.706,85.999,191.706,191.706    c0,105.709-85.998,191.707-191.706,191.707c-12.674,0-22.95,10.275-22.95,22.949s10.276,22.949,22.95,22.949    c131.018,0,237.606-106.588,237.606-237.605c0-131.017-106.589-237.605-237.606-237.605    c-116.961,0-214.395,84.967-233.961,196.409c-0.878,4.994-5.52,9.067-10.59,9.067H5.057c-5.071,0-6.579,3.182-3.373,7.108    L70.846,324.059z" />
					</svg>
				</button>
			)}

			{showInitialBuckets && (
				<ul className={styles.bucket_buttons}>
					<button onClick={() => startScoring('good')}>Good</button>
					<button onClick={() => startScoring('okay')}>Okay</button>
					<button onClick={() => startScoring('bad')}>Bad</button>
					<button
						onClick={() => {
							lockScore(-1)
						}}
					>
						N/A
					</button>
				</ul>
			)}

			{locked && (
				<div className={styles.locked_score}>
					<h4>{scoreValue === -1 ? 'N/A' : scoreValue}</h4>
				</div>
			)}

			{scoring && <div>Let's score</div>}
		</div>
	)
}
