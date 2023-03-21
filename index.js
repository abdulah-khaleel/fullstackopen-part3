const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person')

const morgan = require('morgan')

morgan.token('rqBody', function (req, res) {
  const reqBody = JSON.stringify(req.body)
  if (reqBody !== '{}') {
    return `${reqBody}`
  }
  return ' '
})
app.use(morgan(':method :url :status - :response-time ms  :rqBody'))
app.use(express.json())
app.use(cors())
app.use(express.static('build'))

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

let persons = []

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

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(person)
  })
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
  Person.find({}).then((persons) => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then((person) => {
      response.json(person)
    })
    .catch(() => {
      response.status(404).end()
    })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter((p) => p.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
