import { useLocation } from 'react-router'
import { staticPaths } from './App'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store'
import { useEffect } from 'react'
import { setAuditionees } from './reducers/auditioneesReducer'
import { Link } from 'react-router-dom'

export const Navbar = () => {
	const location = useLocation()

	return (
		<div className="header">
			<h1>She Loves Me</h1>
			<nav>
				{staticPaths.map((path) => (
					<Link
						className={path.href === location.pathname ? 'selected_link' : 'nav_link'}
						to={path.href}
						key={path.href}
					>
						{path.title}
					</Link>
				))}
			</nav>
		</div>
	)
}
