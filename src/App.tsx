import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home } from './Home'
import { Navbar } from './Navbar'

export const staticPaths = [
	{
		href: '/',
		title: 'Home',
		component: <Home />,
	},
]

export const App = () => (
	<BrowserRouter>
		<Navbar />
		<Routes>
			{staticPaths.map((path) => (
				<Route path={path.href} element={path.component} />
			))}
		</Routes>
	</BrowserRouter>
)
