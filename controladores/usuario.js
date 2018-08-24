const passport = require('passport')
const Usuario = require('../modelos/Usuarios')

exports.getLogin = (req, res, next) => {
  res.render('login')
}

exports.getSignup = (req, res, next) => {
  res.render('signup')
}

exports.postSignup = (req, res, next) => {
  if (!req.body.email || !req.body.nombre || !req.body.password || !req.body.biografia) {
    req.flash('errores', {mensaje: 'Debes llenar todos los campos'})
    return res.redirect('/signup')
  }

  const nuevoUsuario = new Usuario({
    email: req.body.email,
    nombre: req.body.nombre,
    password: req.body.password,
    biografia: req.body.biografia
  })

  Usuario.findOne({email: req.body.email}, (err, usuarioExistente) => {
    if (usuarioExistente) {
      req.flash('errores', {mensaje: 'Ya ese email esta registrado'})
      return res.redirect('/signup')
    }
    nuevoUsuario.save((err) => {
      if (err) {
        next(err)
      }
      req.logIn(nuevoUsuario, (err) => { //#¿passport o mongoose? agregó este metodo
        if (err) {
          next(err)
        }
        return res.redirect('/mi/perfil')
      })
    })
  })
}

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, usuario, info) => {
    if (err) {
      next(err)
    }
    if (!usuario) {
      req.flash('errores', {mensaje: 'Email o contraseña no válidos'})
      return res.redirect('/login')
    }
    req.logIn(usuario, (err) => {
      if (err) {
        next(err)
      }
      return res.redirect('/')
    })
  })(req, res, next)
}

exports.logout = (req, res) => {
  req.logout()//#passport agrega este metodo al req
  return res.redirect('/')
}