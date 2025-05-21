// promises methods 
const asyncHandler = (requestHandler) => {
    return (req,res,next) =>{
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
    }
}

// export {asynHandler}


// try catch method 
// const asyncHandler = (fun) => async(req,res,next) =>{
//     try {
//         await fun(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({ // sent when there is an error in the code
//             success : false,
//             message : error.message
//         })
//     }
// } // higher order functions 

export { asyncHandler };