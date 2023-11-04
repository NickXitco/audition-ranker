import { FC } from 'react'
import styles from './BarChart.module.scss'

interface BarChartProps {
	data: {
		label: string
		value: number
		color: string
	}[]
}

export const BarChart: FC<BarChartProps> = (props) => {
	const total = props.data.reduce((acc, dataPoint) => acc + dataPoint.value, 0)
	const max = props.data.reduce((acc, dataPoint) => Math.max(acc, dataPoint.value), 0)

	return (
		<ul className={styles.container}>
			{props.data.map((dataPoint) => (
				<li
					key={dataPoint.label}
					style={{
						width: `${(dataPoint.value / max) * 100}%`,
						background: dataPoint.color,
					}}
					className={styles.bar}
				>
					<span>{dataPoint.label}</span>
					<span>{dataPoint.value}</span>
				</li>
			))}
		</ul>
	)
}
