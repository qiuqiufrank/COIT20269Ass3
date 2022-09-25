 
const fs = require('fs')
exports.tryRemoveFile= function tryRemoveFile(name){
  try{
      let filePath="./uploads/"+name
      console.log(filePath)
      if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath)
      }
  }
  catch(e){
    console.log(e)
  }
}