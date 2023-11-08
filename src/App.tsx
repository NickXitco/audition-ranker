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
		component: <RankingsPage scoreID={'Day 1'} />,
	},
	{
		href: '/day2',
		title: 'Day 2 Ranks',
		component: <RankingsPage scoreID={'Day 2'} />,
	},
	{
		href: '/callbacks',
		title: 'Callbacks Ranks',
		component: <RankingsPage scoreID={'Callbacks'} />,
	},
]

export const App = () => {
	const dispatch = useDispatch()
	const auditionees = useSelector((state: RootState) => state.auditionees.auditionees)

	useEffect(() => {
		if (auditionees && auditionees.length > 0) return

		console.log('fetching auditionees')

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
