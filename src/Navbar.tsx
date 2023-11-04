import { useLocation } from 'react-router'
import { staticPaths } from './App'

export const Navbar = () => {
	const location = useLocation()

	return (
		<div className="header">
			<h1>She Loves Me</h1>
			<nav>
				{staticPaths.map((path) => (
					<a
						className={path.href === location.pathname ? 'selected_link' : ''}
						href={path.href}
						key={path.href}
					>
						{path.title}
					</a>
				))}
			</nav>
		</div>
	)
}
