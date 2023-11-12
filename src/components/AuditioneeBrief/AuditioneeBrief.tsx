import { ComposedAuditionee } from '../../../server/src/backend_types'
import { FC } from 'react'
import styles from './AuditioneeBrief.module.scss'
import { getRoleShortName, getScoreColor } from '../../utils'
import { Link } from 'react-router-dom'

interface AuditioneeBriefProps extends ComposedAuditionee {
	scoreID?: string
}
export const AuditioneeBrief: FC<AuditioneeBriefProps> = (props) => {
	const numConflicts = Object.values(props.conflictDates).reduce((a, b) => (a += b ? 1 : 0), 0)

	let score = props.scoreID ? props.scores![props.scoreID] : undefined
	if (score && score.value < 0) score = undefined

	return (
		<div className={styles.container}>
			{props.scoreID && score && (
				<p
					className={styles.score}
					style={{
						color: getScoreColor(props.scores![props.scoreID]!.value),
					}}
				>
					{props.scores![props.scoreID]!.value.toFixed(1)}
				</p>
			)}
			<img src={props.photoLink} alt={props.name} className={styles.headshot} />
			<div className={styles.content}>
				<div className={styles.top_line}>
					<Link to={`/auditionee/${props.id}`} className={styles.name_link}>
						<h2>{props.name}</h2>
					</Link>
					<p># conflicts: {numConflicts}</p>
				</div>

				<ul className={'tags'}>
					<li className={'gender'}>
						<Link className={'naked_link'} to={`/auditionees?gender=${props.gender}`}>
							{props.gender}
						</Link>
					</li>
					{props.roles.map((role) => (
						<li key={role} className={'role'}>
							<Link className={'naked_link'} to={`/auditionees?role=${role}`}>
								{getRoleShortName(role)}
							</Link>
						</li>
					))}

					{props.vocalPart.split(', ').map((voicePart) => (
						<li key={voicePart} className={'voice_part'}>
							<Link className={'naked_link'} to={`/auditionees?voice_part=${voicePart}`}>
								{voicePart}
							</Link>
						</li>
					))}
					<li className={'reading_proficiency'}>
						<Link className={'naked_link'} to={`/auditionees?music_reading=${props.musicReading}`}>
							{props.musicReading}{' '}
						</Link>
					</li>
				</ul>
			</div>
		</div>
	)
}
