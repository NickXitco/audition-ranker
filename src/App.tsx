import React, { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './Home'
import { Navbar } from './Navbar'
import { Auditionees } from './Auditionees'
import { setAuditionees } from './reducers/auditioneesReducer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from './store'
import { Auditionee } from './Audtionee'
import { RankingsPage } from './RankingsPage'
import { loadFromLocalStorage } from './utils'

export const staticPaths = [
	{
		href: '/',
		title: 'Home',
		component: <Home />,
	},
	{
		href: '/auditionees',
		title: 'Auditionees',
		component: <Auditionees />,
	},
	{
		href: '/day1',
		title: 'Day 1 Ranks',
		component: <RankingsPage scoreIDFragment={'Day 1'} />,
	},
	{
		href: '/day2',
		title: 'Day 2 Ranks',
		component: <RankingsPage scoreIDFragment={'Day 2'} />,
	},
	{
		href: '/callbacks',
		title: 'Callbacks Ranks',
		component: <RankingsPage scoreIDFragment={'Callbacks'} />,
	},
]

export const App = () => {
	const dispatch = useDispatch()
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)

	useEffect(() => {
		if (auditionees && auditionees.length > 0) return

		const savedState = loadFromLocalStorage()

		if (savedState && savedState.auditionees) {
			const auditioneesList = savedState.auditionees.auditionees
			if (auditioneesList && auditioneesList.length > 0) {
				dispatch(setAuditionees(auditioneesList))
				return
			}
		}

		fetch('api/audition_package')
			.then((response) => response.json())
			.then((data) => {
				return dispatch(setAuditionees(data))
			})
	}, [])

	return (
		<BrowserRouter>
			<Navbar />
			<Routes>
				{staticPaths.map((path) => (
					<Route path={path.href} element={path.component} key={path.href} />
				))}
				<Route path={'/auditionee/:id'} element={<Auditionee />} />
			</Routes>
		</BrowserRouter>
	)
}
