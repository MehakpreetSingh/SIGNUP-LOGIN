const connectToMongo = require('./db') ;
const express = require('express') ;
var cors = require('cors') ;


connectToMongo() ;
const app = express() ;
const port = 5000 ;

//Available routes
app.use(cors()) ;
app.use(express.json()) ;

app.use('/api/auth' , require('./routes/auth'))


app.listen(port , () => {
    console.log(`The iNotebook backend application is listening at http://localhost:${port}`);
})