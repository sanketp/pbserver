const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body))


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/info', (request, response) => {
    response.send('Phonebook has info for ' + persons.length + " people <br /><br />" + Date())
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(per => per.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.put('/api/persons/:id', (request, response) => {
    const body = request.body
    const myid = body.id
    persons = persons.filter(per => per.id !== myid)
    
    const person = {
        id: myid,
        name: body.name,        
        number: body.number.toString()
    }
    persons = persons.concat(person)
    response.json(persons)
    response.status(200).end()
})


app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(per => per.id !== id)

    response.status(204).end()
})

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

app.post('/api/persons', morgan(':body'), (request,response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if(!body.number) {
        return response.status(400).json({error: 'name missing'})
    }

    if(persons.find(per => per.name === body.name)) {
        return response.status(400).json({error: 'name must be unique'})

    }

    const person = {
        id: getRandomInt(100000000),
        name: body.name,        
        number: body.number.toString()
    }

    persons = persons.concat(person)
    response.json(person)
    response.status(201).end()
    
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})