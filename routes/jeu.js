var express = require('express');
var router = express.Router();

/* GET page (with the right number) page. */
// see @exempleExpress on Moodle
router.get('/page/:numero', function(req, res, next) {
  // We get the parameter "numero" from our request
  var numeroPage = req.params.numero

  // We reach to the "right" page with the value
  var page = "./pages/" + numeroPage + ".jade"

  // The page is converted to HTML and then put in the page.jade
  res.render(page, function(err, html) {
      res.render('page', { title: numeroPage, htmlPage: html })
  });
});

module.exports = router;
