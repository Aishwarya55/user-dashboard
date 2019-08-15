import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

 let Schema = mongoose.Schema;

 const userSchema = new Schema({
    name: String,
    password: String,
    email: String,
    settings:{
        theme:{
            type: String,
            required: true,
            default:'light'
        }
    }, 
 },
 {timestamps: true}
)

userSchema.pre('save', function(next){
    if(!this.isModified('password')){
        return next()
    }
    console.log("pass", this.password)


      bcrypt.genSalt(8, (err, salt) => {
        if (err) {
          return next(err)
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) {
            return next(err)
          }
          this.password = hash
          next()
        });
    });

})


userSchema.methods.checkPassword = function(password) {
    const passwordHash = this.password
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, passwordHash, (err, same) => {
        if (err) {
          return reject(err)
        }
        resolve(same)
      })
    })
  }

export const User = mongoose.model('user', userSchema)