import 'dotenv/config'
// dotenv.config({ path: '/full/custom/path/to/your/env/vars' });
// dotenv.config({ path: './../..' })
import express from 'express'
import ExampleConsumer from './lib/consumer'
import Redis from './lib/redis'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('howdy there!')
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/consumer', async (req, res): Promise<void> => {
  const url = process.env.REDIS_URL ?? ''
  const username = process.env.REDIS_USERNAME ?? ''
  const password = process.env.REDIS_PASSWORD ?? ''
  const redis = new Redis(url, password, username)
  const consumer = new ExampleConsumer(redis, 'my-kafka', ['kafka:9092'], 'my-group')
  await consumer.startConsumer(['dbserver1.public.demo'])
  res.status(200).send({ message: 'Consumer created!' })
})

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running')
})
