 
const fs = require('fs')
/**
 * try to remove file by name
 * @param {*} name 
 */
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