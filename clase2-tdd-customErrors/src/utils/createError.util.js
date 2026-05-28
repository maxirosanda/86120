export const EErrors =  {
    ROUTING_ERROR:1,
    INVALID_TYPES_ERROR:2,
    DATABASE_ERROR:3
}


export const createError = ({name="Error",cause,message,code=1}) => {
    const error = new Error(message,{cause})
    error.name = name
    error.code = code
    throw error
}

export const generateUserErrorCause = ({firstName="none",lastName="none",email="none"}) => {
    return `
        One or more properties were incomplete or not valid.
        List of required properties:
        * first_name : needs to be a String, received ${firstName}
        * last_name  : needs to be a String, received ${lastName}
        * email      : needs to be a String, received ${email}
    `
}

export const generateProductErrorCause = (product) => {
    return `
        One or more properties were incomplete or not valid.
            List of required properties:
            * name        : needs to be a String, received ${product.name}
            * description : needs to be a String, received ${product.description}
            * price       : needs to be a Number, received ${product.price}
            * category    : needs to be a String, received ${product.category}
    `

} 
