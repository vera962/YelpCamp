//reminder: We return a function that accepts a function and then it executes that function
//but it catches any errors and passes it to next if there is an error. So we can now use this 
//to wrap our asynchronous functions
module.exports = func => {
    return (req,res,next) =>{
        func(req,res,next).catch(next)
    }
}

