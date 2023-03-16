const express = require('express')

const morgan = require('morgan')
const app = express()

app.use(express.json())

app.use(morgan('tiny'))

app.get('/', function (req, res) {
  console.log(res)
  res.send('hello, world!')
})

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
]

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing',
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing',
    })
  }
  if (persons.map((p) => p.name).includes(body.name)) {
    return response.status(400).json({
      error: 'name must be unique',
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.floor(Math.random() * 99000 + 1),
  }

  persons = persons.concat(person)
  response.json(person)
})

app.get('/', (request, response) => {
  response.send('<h1>Welcome to the phonebook app</h1>')
})

app.get('/info', (request, response) => {
  let infoPage = `<p>Phonebook has info for ${
    Object.keys(persons).length
  } people</p>
    <p>${new Date().toUTCString()}</p> 
  `
  response.send(infoPage)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find((p) => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
