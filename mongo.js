const mongoose = require('mongoose')

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://fullstack:${password}@cluster0.dfxovj7.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.connect(url)

if (process.argv.length < 3) {
  console.log(
    'give password as argument. add name and number for saving person.'
  )
  process.exit(1)
} else if (process.argv.length === 3) {
  run('list')
} else {
  run('add')
}

async function run(action) {
  const db = mongoose.connection
  db.on('error', console.error.bind(console, 'connection error:'))

  db.once('open', function () {
    // console.log('Connection Successful!')
    const personSchema = new mongoose.Schema({
      name: String,
      number: String,
    })

    const Person = mongoose.model('Person', personSchema)

    if (action === 'list') {
      console.log('phonebook')
      Person.find({}).then((result) => {
        result.forEach((p) => {
          console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
      })
    } else if (action === 'add') {
      const person = new Person({
        name: name,
        number: number,
      })
      person.save().then((result) => {
        console.log('person saved!')
        mongoose.connection.close()
      })
    }
  })
}
