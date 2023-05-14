require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const PORT = process.env.PORT || 3500
const { logger } = require('./middleware/logEvents')
const { errorHandler } = require('./middleware/errorHandler')
const cors = require('cors')
const { corsOptions } = require('./config/configOptions')
const subdir = require('./routes/subdir')
const mongoose = require('mongoose')
const connectDB = require('./config/dbConn')

const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')

//connect to mongo db - don't listen to other connections if the db is not connected

connectDB()


app.use(cors(corsOptions))

// 
app.use(logger)
// app.use(credentials)

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cookieParser())

//serve static files
app.use(express.static(path.join(__dirname, '/public')))
app.use('/subdir', express.static(path.join(__dirname, '/public')))
// app.use('/root', express.static(path.join(__dirname, '/public')))

//routes
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))
app.use('/employees', require('./routes/api/employees'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/auth'))
app.use('/', require('./routes/root'))
app.use('/subdir', subdir)
app.use('employees', require('./routes/api/employees'))
app.use(verifyJWT)




app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ error: '404 not found' })
    } else {
        res.type('txt').send('404 Not founds')
    }
})



app.use(errorHandler)
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
