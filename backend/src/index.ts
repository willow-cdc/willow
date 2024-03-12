import 'dotenv/config'
import express from 'express'

const app = express()
app.use(express.json())

app.get('/', (req, res) => {
  res.send('howdy there!')
})

app.listen(process.env.PORT ?? 3000, () => {
  console.log('Server Running')
})
