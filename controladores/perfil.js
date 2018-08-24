const Usuario = require('../modelos/Usuarios')
const ControladorTweet = require('./tweet')

exports.getMiPerfil = (req, res) => {
  getInformacionPerfil(req.user._id)
  .then(([usuario, tweets]) => {
    res.render('perfil', {
      usuario,
      tweets,
      estaSiendoSeguido: false,
      esconderBotones: true
    })
  })
}

exports.getPerfil = (req, res) => {
  const usuarioId = req.params.id //viene del url
  const estaSiendoSeguido = req.user ? req.user.siguiendo.indexOf(usuarioId) > -1 : false
  const esconderBotones = req.user ? false : true

  if (req.user && req.user._id.equals(usuarioId)) { // si quiere ver su propio perfil
    return res.redirect('/mi/perfil')
  }

  getInformacionPerfil(usuarioId)
  .then(([usuario, tweets]) => {
    res.render('perfil', {
      usuario,
      tweets,
      estaSiendoSeguido,
      esconderBotones
    })
  })
}

exports.seguir = (req, res) => {
  const usuarioLogueado = req.user._id
  const usuarioId = req.params.id

  Promise.all([
    agregarSiguiendo(usuarioLogueado, usuarioId),
    agregarSeguidor(usuarioId, usuarioLogueado)
  ]).then(() => {
    res.redirect(`/perfil/${usuarioId}`)
  })
}

exports.unseguir = (req, res) => {
  const usuarioLogueado = req.user._id
  const usuarioId = req.params.id

  Promise.all([
    eliminarSiguiendo(usuarioLogueado, usuarioId),
    eliminarSeguidor(usuarioId, usuarioLogueado)
  ]).then(() => {
    res.redirect(`/perfil/${usuarioId}`)
  })
}

const getInformacionPerfil = (usuarioId) => {
  return Promise.all([
    Usuario.findOne({_id: usuarioId}),
    ControladorTweet.getTweetsUsuarios([usuarioId])
  ])
}

const agregarSiguiendo = (usuarioLogueadoId, usuarioId) => {
  return Usuario.findOneAndUpdate(
    {_id: usuarioLogueadoId},
    {$push: {siguiendo: usuarioId}}
  )
}

const agregarSeguidor = (usuarioId, usuarioLogueadoId) => {
  return Usuario.findOneAndUpdate(
    {_id: usuarioId},
    {$push: {seguidores: usuarioLogueadoId}} 
  )
}

const eliminarSiguiendo = (usuarioLogueadoId, usuarioId) => {
  return Usuario.findOneAndUpdate(
    {_id: usuarioLogueadoId},
    {$pull: {siguiendo: usuarioId}}
  )
}

const eliminarSeguidor = (usuarioId, usuarioLogueadoId) => {
  return Usuario.findOneAndUpdate(
    {_id: usuarioId},
    {$pull: {seguidores: usuarioLogueadoId}}
  )
}