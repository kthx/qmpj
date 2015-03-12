var express = require('express');
var router = express.Router();

router.get('/:name/:id?', function (req, res) {
  var name = req.params.name;
  res.render('partials/' + name );
});

module.exports = router;