import { FC } from 'react'
import { RootState } from './store'
import { useSelector } from 'react-redux'
import { AuditioneeBrief } from './components/AuditioneeBrief/AuditioneeBrief'

export const RankingsPage: FC<{ scoreIDFragment: string }> = (props) => {
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)

	const scoreIDsMatchingFragment: string[] = []
	for (const auditionee of auditionees) {
		if (!auditionee.scores) continue
		const auditioneeScores = Object.keys(auditionee.scores)
		for (const scoreID of auditioneeScores) {
			if (scoreID.includes(props.scoreIDFragment) && !scoreIDsMatchingFragment.includes(scoreID)) {
				scoreIDsMatchingFragment.push(scoreID)
			}
		}
	}

	if (scoreIDsMatchingFragment.length === 0) {
		return (
			<main>
				<div className={'stat_grid'}>No scores found for {props.scoreIDFragment}</div>
			</main>
		)
	}

	return (
		<main>
			<div className={'stat_grid'}>
				{scoreIDsMatchingFragment.map((scoreID, i) => {
					const auditioneesWithScore = auditionees.filter((auditionee) => {
						if (!auditionee.scores) return false
						return !!auditionee.scores[scoreID]
					})

					const sortedAuditionees = auditioneesWithScore.sort((a, b) => {
						const aScore = a.scores![scoreID]!.value
						const bScore = b.scores![scoreID]!.value

						return bScore - aScore
					})

					return (
						<article key={scoreID} className={'list_article'}>
							<h2 className={'ranked_list_title'}>{scoreID.split(' - ')[1].replace(/_/g, ' ')}</h2>
							<ol className={'ranked_list'}>
								{sortedAuditionees.map((auditionee, index) => {
									const score = auditionee.scores![scoreID]!
									return (
										<li key={auditionee.id}>
											<h3>{score.value < 0 ? 'N/A' : index + 1}</h3>
											<div
												style={{
													opacity: !score.locked || score.value < 0 ? 0.5 : 1,
													filter: score.value < 0 ? 'grayscale(1)' : 'none',
												}}
											>
												<AuditioneeBrief {...auditionee} scoreID={scoreID} />
											</div>
										</li>
									)
								})}
							</ol>
						</article>
					)
				})}
			</div>
		</main>
	)
}
