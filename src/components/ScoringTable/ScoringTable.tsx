import { FC } from 'react'
import styles from './ScoringTable.module.scss'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { updateAuditionee, updateMultipleAuditionees } from '../../reducers/auditioneesReducer'
import { getBucketValues, getAllAuditioneesInRange, getBucketFromScore, getScoreColor } from '../../utils'
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

function getMiddleScore(
	auditioneesInBucket: ComposedAuditionee[],
	auditionee: ComposedAuditionee,
	scoreID: string,
	bucket: { high: number; low: number }
) {
	if (auditioneesInBucket.length === 0) return bucket.high

	// push "wall" auditionee
	auditioneesInBucket.push({
		...auditionee,
		id: 'temp',
		scores: {
			[scoreID]: {
				value: bucket.low,
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
	const scoreAtMiddleIndex = sortedAuditionees[middleIndex].scores![scoreID]!.value
	const scoreBelowMiddleIndex = sortedAuditionees[middleIndex - 1].scores![scoreID]!.value
	if (sortedAuditionees.length % 2 === 0) {
		return (scoreAtMiddleIndex + scoreBelowMiddleIndex) / 2
	} else {
		return scoreAtMiddleIndex
	}
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

	const startUnlockedScore = (score: number, range: { high: number; low: number }) => {
		if (!auditionee) return
		dispatch(
			updateAuditionee({
				...auditionee,
				scores: {
					...auditionee?.scores,
					[scoreID]: {
						value: score,
						locked: false,
						range,
					},
				},
			})
		)
	}

	const startScoring = (bucket: 'good' | 'okay' | 'bad') => {
		if (!auditionee) return

		const bucketValues = getBucketValues(bucket)
		const auditioneesInBucket = getAllAuditioneesInRange(auditionees, scoreID, bucketValues)

		if (auditioneesInBucket.length === 0) {
			lockScore(bucketValues.high)
			return
		}

		const middleScore = getMiddleScore(auditioneesInBucket, auditionee, scoreID, bucketValues)

		startUnlockedScore(middleScore, bucketValues)
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
					<h4>{scoreValue === -1 ? 'N/A' : scoreValue?.toFixed(1)}</h4>
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

const getScore = (auditionee: ComposedAuditionee, scoreID: string) => {
	const score = auditionee?.scores?.[scoreID]
	if (!score) return -Infinity
	return score.value
}

const getRange = (auditionee: ComposedAuditionee, scoreID: string) => {
	const score = auditionee?.scores?.[scoreID]
	if (!score) return { high: Infinity, low: -Infinity }
	return score.range!
}

interface ScoreComparisonProps {
	auditionee: ComposedAuditionee
	scoreID: string
}

const ScoreComparison: FC<ScoreComparisonProps> = (props) => {
	const dispatch = useDispatch()
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)

	const challengerScore = getScore(props.auditionee, props.scoreID)
	const challengerRange = getRange(props.auditionee, props.scoreID)

	// find auditionee with the closest score
	let defender
	let closestDistance = Infinity
	for (const auditionee of auditionees) {
		if (auditionee.id === props.auditionee.id) continue
		const auditioneeScore = getScore(auditionee, props.scoreID)
		const distance = Math.abs(auditioneeScore - challengerScore)
		if (distance < closestDistance) {
			closestDistance = distance
			defender = auditionee
		}
	}

	if (!defender) return <div>no defender found</div>

	const defenderScore = getScore(defender, props.scoreID)

	const rescoreRange = (newChallengerScore: number) => {
		const bucketValues = getBucketValues(getBucketFromScore(challengerScore))
		const auditioneesInBucket = getAllAuditioneesInRange(auditionees, props.scoreID, bucketValues)
		const wall = {
			...props.auditionee,
			id: 'temp',
			scores: {
				[props.scoreID]: {
					value: bucketValues.low,
					locked: true,
				},
			},
		}

		const newChallenger = {
			...props.auditionee,
			scores: {
				...props.auditionee?.scores,
				[props.scoreID]: {
					value: newChallengerScore,
					locked: false,
				},
			},
		}
		auditioneesInBucket.push(wall)
		auditioneesInBucket.push(newChallenger)

		const sortedAuditionees = auditioneesInBucket.sort((a, b) => {
			const aScore = a.scores![props.scoreID]!.value
			const bScore = b.scores![props.scoreID]!.value

			return aScore - bScore
		})

		//evenly distribute scores from bucket low to bucket high
		const bucketSize = sortedAuditionees.length
		const bucketRange = bucketValues.high - bucketValues.low
		const bucketIncrement = bucketRange / (bucketSize - 1)
		let currentScore = bucketValues.low
		const newScores = sortedAuditionees.map((auditionee) => {
			const newScore = {
				...auditionee,
				scores: {
					...auditionee.scores,
					[props.scoreID]: {
						value: currentScore,
						locked: true,
					},
				},
			}
			currentScore += bucketIncrement
			return newScore as ComposedAuditionee
		})

		// ensure top and bottom scores are bucket high and low
		newScores[0].scores![props.scoreID]!.value = bucketValues.low
		newScores[newScores.length - 1].scores![props.scoreID]!.value = bucketValues.high

		// update and lock all scores except wall
		const filteredScores = newScores.filter((auditionee) => auditionee.id !== 'temp')
		dispatch(updateMultipleAuditionees(filteredScores))
	}

	const selectedPortrait = (choice: 'challenger' | 'defender') => {
		const high = choice === 'challenger' ? challengerRange.high : defenderScore - EPSILON
		const low = choice === 'challenger' ? defenderScore + EPSILON : challengerRange.low
		const nextRange = getAllAuditioneesInRange(auditionees, props.scoreID, { high, low })

		if (low > high) {
			const newChallengerScore = high + EPSILON
			rescoreRange(newChallengerScore)
			return
		}

		if (nextRange.length === 0) {
			const middleScore = (high + low) / 2
			rescoreRange(middleScore)
			return
		}

		// step 2:
		// Similar to before, we take our bucket and add the bottom wall auditionee, then sort by score. The middle score is the new challenger's score
		// Repeat until the exit condition of step 1 is met
		const middleScore = getMiddleScore(nextRange, props.auditionee, props.scoreID, { high, low })

		dispatch(
			updateAuditionee({
				...props.auditionee,
				scores: {
					...props.auditionee?.scores,
					[props.scoreID]: {
						value: middleScore,
						locked: false,
						range: { high, low },
					},
				},
			})
		)
	}

	return (
		<div className={styles.duel_arena}>
			<Portrait
				// score={challengerScore}
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

const Portrait: FC<{ auditionee: ComposedAuditionee; score?: number; onClick: () => void }> = (props) => {
	return (
		<button className={styles.portrait} onClick={props.onClick}>
			<img src={props.auditionee.photoLink} alt={props.auditionee.name} />
			<h2>
				{props.auditionee.name}
				{props.score && (
					<>
						{' '}
						-{' '}
						<span
							style={{
								color: getScoreColor(props.score),
							}}
						>
							{props.score.toFixed(1)}
						</span>{' '}
					</>
				)}
			</h2>
		</button>
	)
}
