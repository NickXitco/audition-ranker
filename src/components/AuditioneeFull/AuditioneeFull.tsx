import styles from './AuditioneeFull.module.scss'
import { FC } from 'react'
import { ComposedAuditionee } from '../../../server/src/backend_types'
import { Link } from 'react-router-dom'
import { ScoringTable } from '../ScoringTable/ScoringTable'

export const AuditioneeFull: FC<ComposedAuditionee> = (props) => {
	return (
		<div className={styles.container}>
			<Link
				to={`https://www.theaterforms.com/audition/georgetownpalace/SheLovesMe/auditioner/${props.id}`}
				target={'_blank'}
				className={styles.link_out}
			>
				<LinkIcon />
			</Link>

			<section className={styles.main_info}>
				<img src={props.photoLink} alt={props.name} className={styles.headshot} />
				<div className={styles.content}>
					<h2>{props.name}</h2>

					<ul className={styles.info_grid}>
						<li>
							<h3>Pronouns</h3>
							<p>{props.pronouns}</p>
						</li>
						<li>
							<h3>Roles</h3>
							<ul className={'tags'}>
								{props.roles.map((role) => (
									<li key={role} className={'role'}>
										{role}
									</li>
								))}
							</ul>
						</li>
						<li>
							<h3>Music Reading</h3>
							<ul className={'tags'}>
								<li className={'reading_proficiency'}>{props.musicReading}</li>
							</ul>
						</li>
						<li>
							<h3>Vocal Part</h3>
							<ul className={'tags'}>
								{props.vocalPart.split(', ').map((role) => (
									<li key={role} className={'voice_part'}>
										{role}
									</li>
								))}
							</ul>
						</li>
						<li>
							<h3>Dance</h3>
							<ul className={'tags'}>
								{Object.entries(props.danceExperience).map((dance) => (
									<li key={dance[0]} className={'dance'}>
										{dance[0]}: {dance[1]}
									</li>
								))}
							</ul>
						</li>
						<li>
							<h3>Other Questions</h3>
							<ul className={'tags'}>
								<li className={'other'}>Performance Conflicts: {props.performanceConflicts}</li>
								<li className={'other'}>Roles: {props.rolesQ}</li>
								<li className={'other'}>Understudy: {props.understudy}</li>
								<li className={'other'}>Intimacy: {props.intimacy}</li>
								<li className={'other'}>Appearance: {props.appearance}</li>
							</ul>
						</li>
					</ul>

					<div>
						<h3>Conflicts</h3>
						<ul className={styles.conflicts}>
							{Object.entries(props.conflictDates).map((conflict) => (
								<li
									key={conflict[0]}
									className={styles.conflict_container}
									style={{
										background: conflict[1] ? 'rgba(255, 0, 0, 0.1)' : 'rgba(2,232,82,0.4)',
									}}
								>
									<p>{conflict[0]}</p>
								</li>
							))}
						</ul>
						<p>{props.conflictNotes}</p>
					</div>
				</div>
			</section>

			<div className={styles.divider} />

			<section>
				<h2>Day 1 - Vocal Notes</h2>
				<ul className={styles.small_inputs}>
					{['Song', 'Quality', 'Musicality', 'Diction', 'Range', 'Acting', 'Vibes'].map((label) => (
						<li key={label}>
							<h3>{label}</h3>
							<input type={'text'} className={styles.small_text_input} />
						</li>
					))}
				</ul>

				<h3>Notes</h3>
				<textarea className={styles.full_text_input} />
			</section>

			<div className={styles.divider} />

			<section>
				<h2>Day 1 - Scoring</h2>
				<ScoringTable id={props.id} />
			</section>
		</div>
	)
}

const LinkIcon = () => (
	<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
		<path
			fill={'purple'}
			d="M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z"
		/>
	</svg>
)
