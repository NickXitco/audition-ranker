import { FC } from 'react'
import styles from './BarChart.module.scss'
import seedColor from 'seed-color'
import { Link } from 'react-router-dom'

interface BarChartProps {
	param: string
	data: {
		label: string
		value: number
		color?: string
	}[]
}

export const BarChart: FC<BarChartProps> = (props) => {
	const total = props.data.reduce((acc, dataPoint) => acc + dataPoint.value, 0)
	const max = props.data.reduce((acc, dataPoint) => Math.max(acc, dataPoint.value), 0)

	return (
		<ul className={styles.container}>
			{props.data.map((dataPoint) => (
				<li key={dataPoint.label}>
					<Link to={`/auditionees?${props.param}=${dataPoint.label}`} className={'naked_link'}>
						<p className={styles.bar_label}>{dataPoint.label}</p>
						<div className={styles.bar_container}>
							<p className={styles.bar_value}>
								{dataPoint.value} ({((dataPoint.value / total) * 100).toFixed(1)}%)
							</p>
							<div
								style={{
									width: `${(dataPoint.value / max) * 100}%`,
									background: dataPoint.color || seedColor(dataPoint.label).toHex(),
								}}
								className={styles.bar}
							/>
						</div>
					</Link>
				</li>
			))}
		</ul>
	)
}
