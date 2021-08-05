require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Entry = require('./models/entry')
const mongoose = require('mongoose')

app.use(express.json())
app.use(express.static('build'))
app.use(morgan('tiny'))
app.use(cors())

morgan.token('body', (req) => JSON.stringify(req.body))

app.get('/api/persons', (request, response) => {
    Entry.find({}).then(entries => {
        response.json(entries)
    })
})

app.get('/api/info', (request, response) => {
    Entry.count().then((count) => {
        response.send('Phonebook has info for ' + count + " people <br /><br />" + Date())
    })
    // response.send('Phonebook has info for ' + persons.length + " people <br /><br />" + Date())
})

app.get('/api/persons/:id', (request, response, next) => {
    Entry.findById(request.params.id)
    .then(entry => {
        if (entry) {
            response.json(entry)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => { next(error)
        // console.log(error)
        // response.status(400).send({error:'malformatted id'})
    })
    // const id = Number(request.params.id)
    // const person = persons.find(per => per.id === id)

    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
})

app.put('/api/persons/:id', morgan(':body'), (request, response) => {
    const body = request.body
    const ent = {
        name: body.name,
        number: body.number
    }
    Entry.findByIdAndUpdate(request.params.id, ent, {new:true}, (error,data) =>{
        if(error){
            console.log('lol')
            throw error
        } 
        else {
            console.log('succes!!')
        }
    })
    
    Entry.find({}).then(entries => {
        response.json(entries)
    })
})


app.delete('/api/persons/:id', (request, response) => {
    Entry.findByIdAndRemove(request.params.id)
        .then(results => {
            Entry.find({}).then(entries => {
                response.json(entries)
            })
        })
        .catch(error => next(error))
        
        // (error,data) =>{
        // if(error){
        //     console.log('lol')
        //     throw error
        // } 
        // else {
        //     console.log('succes!!')
        // }
    // })

    // Entry.find({}).then(entries => {
    //     response.json(entries)
    // })
    // response.status(204).end()
})

// app.post('/api/persons', morgan(':body'), (request,response) => {
//     const body = request.body

//     if(!body.name) {
//         return response.status(400).json({error: 'name missing'})
//     }

//     if(!body.number) {
//         return response.status(400).json({error: 'name missing'})
//     }

//     if(persons.find(per => per.name === body.name)) {
//         return response.status(400).json({error: 'name must be unique'})

//     }

//     const person = {
//         id: getRandomInt(100000000),
//         name: body.name,        
//         number: body.number.toString()
//     }

//     persons = persons.concat(person)
//     response.json(person)
//     response.status(201).end()
    
// })

app.post('/api/persons', morgan(':body'), (request,response) => {
    const body = request.body

    if(!body.name) {
        return response.status(400).json({error: 'name missing'})
    }

    if(!body.number) {
        return response.status(400).json({error: 'number missing'})
    }

    const person = new Entry({
        name: body.name,        
        number: body.number.toString()
    })

    person
        .save()
        .then(savedPerson => savedPerson.toJSON())
        .then(finalPerson => {
            response.json(finalPerson)
    })
    .catch(error => next(error))
   
})

const unknownEndpoint = (request,response) => {
    response.status(404).send({error:'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }
    next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})