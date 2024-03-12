import 'dotenv/config'
import express from 'express'
import ExampleConsumer from './lib/consumer'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('howdy there!')
})

// eslint-disable-next-line @typescript-eslint/no-misused-promises
app.post('/consumer', async (req, res): Promise<void> => {
  const consumer = new ExampleConsumer('my-kafka', ['kafka:9092'], 'my-group')
  await consumer.startConsumer(['dbserver1.public.demo'])
  res.status(200).send({ message: 'Consumer created!' })
})

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running')
})
