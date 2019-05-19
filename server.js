//#region modulos npm y requires

const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const path = require('path')
const flash = require('express-flash')
const passportConfig = require('./config/passport')
const controladorUsuario = require('./controladores/usuario')
const controladorTweets = require('./controladores/tweet')
const controladorPerfil = require('./controladores/perfil')
const controladorHome = require('./controladores/home')
const controladorExplorar = require('./controladores/explorar')

//#endregion modulos npm y requires

//#region constantes de datos

const app = express()
const MONGO_URL = 'mongodb://rodolfokenlly:2812NaHv#L@ds149056.mlab.com:49056/heroku_h1502k7q'

//#endregion constantes de datos

//#region configuracion del mongo

mongoose.Promise = global.Promise
mongoose.connect(MONGO_URL)
mongoose.connection.on('error', (err) => {
  throw err
  process.exit(1)
})

app.use(session({
  secret: 'this is secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    url: MONGO_URL,
    autoReconnect: true
  })
}))

//#endregion configuracion del mongo

//#region middlewares de express

app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(flash())

app.set('views', path.join(__dirname, 'vistas'))
app.set('view engine', 'pug')

app.use('/css', express.static(path.join(__dirname, 'node_modules', 'bootstrap3', 'dist', 'css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'bootstrap3', 'dist', 'js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules', 'jquery', 'dist')))

app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

//#endregion middlewares de express

//#region express rutas

app.get('/', controladorHome.getHome)

app.get('/login', controladorUsuario.getLogin)
app.get('/signup', controladorUsuario.getSignup)
app.get('/logout', passportConfig.estaAutenticado, controladorUsuario.logout)
app.get('/explorar', controladorExplorar.getExplorar)

app.get('/mi/perfil', passportConfig.estaAutenticado, controladorPerfil.getMiPerfil)
app.get('/perfil/:id', controladorPerfil.getPerfil)
app.get('/seguir/:id', passportConfig.estaAutenticado, controladorPerfil.seguir)
app.get('/unseguir/:id', passportConfig.estaAutenticado, controladorPerfil.unseguir)

app.post('/tweet', passportConfig.estaAutenticado, controladorTweets.postTweet)
app.post('/login', controladorUsuario.postLogin)
app.post('/signup', controladorUsuario.postSignup)
app.post('/explorar', controladorExplorar.postExplorar)

//#endregion express rutas

//#region inicalizacion de App

app.listen(3000, () => {
  console.log('Iniciando por el puerto 3000')
})

//#endregion inicalizacion de App