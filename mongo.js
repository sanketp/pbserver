const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

  
const password = process.argv[2]

const url =
`mongodb+srv://fullstack:${password}@cluster0.7a5m6.mongodb.net/phonebook-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length == 3) {
    Entry.find({}).then(result => {
        console.log('phonebook')
        result.forEach(entry => {
            console.log(`${entry.name} ${entry.number}`)
    })
    mongoose.connection.close()
    })
}

else {
    const entry = new Entry({
        name: process.argv[3],
        number: process.argv[4]
    })

    entry.save().then(result => {
        console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
        mongoose.connection.close()
    })
}

//   const noteSchema = new mongoose.Schema({
//     content: String,
//     date: Date,
//     important: Boolean,
//   })
  
//   const Note = mongoose.model('Note', noteSchema)
  
//   const note = new Note({
//     content: 'HTML is Easy',
//     date: new Date(),
//     important: true,
//   })
  
//   note.save().then(result => {
//     console.log('note saved!')
//     mongoose.connection.close()
//   })

// Note.find({}).then(result => {
//     result.forEach(note => {
//       console.log(note)
//     })
//     mongoose.connection.close()
//   })