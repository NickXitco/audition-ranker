import { FC } from 'react'
import styles from './ScoringTable.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { updateAuditionee } from '../../reducers/auditioneesReducer'
import { bucketValues, getAllAuditioneesInRange, getScoreColor } from '../../utils'
import { ComposedAuditionee } from '../../../server/src/backend_types'

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

const EPSILON = 1 / 1024

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
	const locked = scoreLocked

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

		// push "wall" auditionee
		auditioneesInBucket.push({
			...auditionee,
			id: 'temp',
			scores: {
				[scoreID]: {
					value: low,
					locked: false,
				},
			},
		})

		const sortedAuditionees = auditioneesInBucket.sort((a, b) => {
			const aScore = a.scores![scoreID]!.value
			const bScore = b.scores![scoreID]!.value

			return aScore - bScore
		})

		// If there are an even number of auditionees, the middle score is the average of the two middle scores
		// If there are an odd number of auditionees, the middle score is the middle score

		const middleIndex = Math.floor(sortedAuditionees.length / 2)
		const middleScore =
			sortedAuditionees.length % 2 === 0
				? (sortedAuditionees[middleIndex].scores![scoreID]!.value +
						sortedAuditionees[middleIndex - 1].scores![scoreID]!.value) /
				  2
				: sortedAuditionees[middleIndex].scores![scoreID]!.value

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

			{scoring && (
				<div>
					<ScoreComparison auditionee={auditionee} scoreID={scoreID} />
				</div>
			)}
		</div>
	)
}

interface ScoreComparisonProps {
	auditionee: ComposedAuditionee
	scoreID: string
}

const getScore = (auditionee: ComposedAuditionee, scoreID: string) => {
	const score = auditionee?.scores?.[scoreID]
	if (!score) return -Infinity
	return score.value
}

const ScoreComparison: FC<ScoreComparisonProps> = (props) => {
	const dispatch = useDispatch()
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)

	const challengerScore = getScore(props.auditionee, props.scoreID)

	// find auditionee with the closest score
	const defender = auditionees.reduce((prev, curr) => {
		if (curr.id === props.auditionee.id) return prev

		const currScore = getScore(curr, props.scoreID)
		const prevScore = getScore(prev, props.scoreID)

		const currDiff = Math.abs(currScore - challengerScore)
		const prevDiff = Math.abs(prevScore - challengerScore)

		if (currDiff < prevDiff) return curr
		return prev
	})

	const defenderScore = getScore(defender, props.scoreID)

	const selectedPortrait = (choice: 'challenger' | 'defender') => {
		alert(choice)

		// TODO step 1:
		// If challenger, we get the bucket of all auditionees with a score between the top range of the bucket and the defender's score + EPSILON, since we know that the challenger's score is greater than the defender's score
		// If the bucket is empty, we set the challenger's score to the bucket high + epsilon and rescore the whole bucket for an even distribution

		// If defender, we do the same thing, but with the bottom range of the bucket and the defender's score - EPSILON, since we know that the challenger's score is less than the defender's score
		// If the bucket is empty, we set the challenger's score to the bucket low + epsilon and rescore the whole bucket for an even distribution

		// TODO step 2:

		// Similar to before, we take our bucket and add the bottom wall auditionee, then sort by score. The middle score is the new challenger's score

		// Repeat until the exit condition of step 1 is met
	}

	return (
		<div className={styles.duel_arena}>
			<Portrait
				score={challengerScore}
				auditionee={props.auditionee}
				onClick={() => {
					selectedPortrait('challenger')
				}}
			/>
			<p>vs.</p>
			<Portrait
				score={defenderScore}
				auditionee={defender}
				onClick={() => {
					selectedPortrait('defender')
				}}
			/>
		</div>
	)
}

const Portrait: FC<{ auditionee: ComposedAuditionee; score: number; onClick: () => void }> = (props) => {
	return (
		<button className={styles.portrait} onClick={props.onClick}>
			<img src={props.auditionee.photoLink} alt={props.auditionee.name} />
			<h2>
				{props.auditionee.name} -{' '}
				<span
					style={{
						color: getScoreColor(props.score),
					}}
				>
					{props.score}
				</span>
			</h2>
		</button>
	)
}
