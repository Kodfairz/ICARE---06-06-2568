import { Elysia } from 'elysia'
import { node } from '@elysiajs/node'
import cors from '@elysiajs/cors'

// Routes
import { userRoutes } from './routes/users.route.js'
import { categoryRoutes } from './routes/category.route.js'
import { postRoutes } from './routes/posts.route.js'
import { commentRoutes } from './routes/comments.route.js'
import { videoRoutes } from './routes/video.route.js'
import { MedicationsRoutes } from './routes/medication.route.js'
import { TreatmentsRoutes } from './routes/treatment.route.js'
import { ImageRoutes } from './routes/image-library.route.js'
import { VideoRoutes } from './routes/video-library.route.js'

const app = new Elysia({ adapter: node() })
	.use(cors())
	.get('/', () => 'Hello Elysia')

	.use(userRoutes)
	.use(categoryRoutes)
	.use(postRoutes)
	.use(commentRoutes)
	.use(videoRoutes)
	.use(MedicationsRoutes)
	.use(TreatmentsRoutes)
	.use(ImageRoutes)
	.use(VideoRoutes)

	.listen(4000, ({ hostname, port }) => {
		console.log(
			`🦊 Elysia is running at ${hostname}:${port}`
		)
	})