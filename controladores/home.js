const ControladorTweets = require('./tweet')

exports.getHome = (req, res) => {
  if (req.user) {
    ControladorTweets.getTweetsUsuarios(req.user.siguiendo)
    .then((tweets) => {
      res.render('home', {tweets})
    })
  } else {
    res.render('home')
  }
}