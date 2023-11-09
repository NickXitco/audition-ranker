import express from 'express'
import userRoutes from './routes/users'
import auditionPackageRoutes from './routes/auditionPackage'

const app = express()
const port = process.env.PORT || 5001

app.use('/api/users', userRoutes)
app.use('/api/audition_package', auditionPackageRoutes)

app.get('/', (req, res) => {
	res.send('Hello from the server!')
})

app.listen(port, () => {
	console.log(`Server running on port ${port}`)
})
