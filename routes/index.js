var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

// GET página de Creditos
router.get('/author', function(req, res) {
  res.render('author');
});

router.get("/quizes/",						quizController.index);
router.get("/quizes/:quizId", 		quizController.show);
router.get("/quizes/:quizId/answer", 	quizController.answer);

module.exports = router;

