const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.bnkizsw.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

run()
async function run() {
  const db = mongoose.connection

  db.on('error', console.error.bind(console, 'connection error:'))

  db.once('open', function () {
    console.log('Connection Successful!')

    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    const person = new Person({
      name: name,
      number: number,
    })
    person.save().then((result) => {
      console.log('person saved!')
      mongoose.connection.close()
    })
  })
}
