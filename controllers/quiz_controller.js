// Controlador

exports.question = function(req,res){
  res.render("quizes/question",{pregunta: "¿Capital de Italia? "});
};

exports.answer =function (req, res) {
  if (req.query.respuesta.toUpperCase()  === "ROMA" ){
    res.render("quizes/answer",{Respuesta: "Correcto", color: "green"});
  } else{
    res.render("quizes/answer",{Respuesta: "Incorrecto", color: "red"});
  }
};
