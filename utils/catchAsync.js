module.exports = func =>{
    return(req, res, next) =>{
        func(req, res, next).catch(next)
    }
}


// This is what the above function looks like in full form

// function catchAsync(func){
//     return function(req, res, next){
//         func(req, res, next).catch(next)
//     }
// }