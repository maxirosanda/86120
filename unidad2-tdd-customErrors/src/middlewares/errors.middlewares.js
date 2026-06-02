import { EErrors } from "../utils/createError.util.js";

export const errorHandler = (error,req,res,next) =>{
    switch(error.code){
        case EErrors.INVALID_TYPES_ERROR:
             res.json({status:"error",error:error.name})
             break
        case EErrors.DATABASE_ERROR:
             console.log(error.message)
             res.json({status:"error",error:error.name})
             break
        default:
              res.json({status:"error",error:"generic error"})

    }
}