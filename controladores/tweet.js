const Tweet = require('../modelos/Tweet')

exports.postTweet = (req, res) => {
  const texto = req.body.texto
  
  if (!texto) {
    req.flash('errores', {mensaje: 'Debes Escribir algo en el tweet'})
    return res.redirect('/')
  }

  const tweet = new Tweet({
    texto,
    usuario: req.user._id
  })

  tweet.save()
    .then(() => {
      res.redirect('/')
    })
}

exports.getTweetsUsuarios = (arrayUsuarioIds) => {
  return Tweet.find({usuario: {$in: arrayUsuarioIds}}).sort({createdAt: -1}).populate('usuario')
}







