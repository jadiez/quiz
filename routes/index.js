var express = require('express');
var router  = express.Router();

var quizController    = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var staticsController = require('../controllers/estadisticas_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index',{errors:[]});
});

//Autoload de comandos con :quizId o :commentId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);

//Definición de rutas de sesion
router.get ("/login"	, sessionController.new);
router.post("/login"	, sessionController.create);
router.get ("/logout"	, sessionController.destroy);

// GET página de Creditos
router.get('/author', function(req, res) {
  res.render('author',{errors:[]});
});
router.get("/quizes"					 ,quizController.index);
router.get("/quizes/estadisticas"		 ,staticsController.calculos, staticsController.show);
router.get("/quizes/:quizId(\\d+)"		 ,quizController.show);
router.get("/quizes/:quizId(\\d+)/answer",quizController.answer);
router.get("/quizes/new"				 ,sessionController.loginRequired, quizController.new);
router.post("/quizes/create"			 ,sessionController.loginRequired, quizController.create);
router.get("/quizes/:quizId(\\d+)/editar",sessionController.loginRequired, quizController.editar);
router.put("/quizes/:quizId(\\d+)"		 ,sessionController.loginRequired, quizController.update);
router.delete("/quizes/:quizId(\\d+)"	 ,sessionController.loginRequired, quizController.borrar);

router.get ("/quizes/:quizId(\\d+)/comments/new" ,commentController.new);
router.post("/quizes/:quizId(\\d+)/comments"     ,commentController.create);
router.get ("/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish",sessionController.loginRequired, commentController.publish);

module.exports = router;

