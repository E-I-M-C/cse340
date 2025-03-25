const errorController = {}

errorController.runError = async function(req, res){
  throw new Error("Ah! It's an ERROR!")
}

module.exports = errorController