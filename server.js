const express = require('express');
const mongoose = require('mongoose');

//mongoose connection
mongoose.connect("mongodb://localhost:27017/testFilter", {useUnifiedTopology:true, useNewUrlParser: true}, function (err, r) {
    if(!err)
        console.log('connected');
});

const app = express();

app.use(express.static(__dirname+"/public"));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));

app.use('/customer/contacts', require('./routes/contacts'));

//allowing download of demo.xls file
app.get('/files/xls/:demo', (req, res)=>{
    console.log('entered');
    res.download(__dirname+'/public/files/xls/demo.zip', 'batch-demo.zip', function (err) {
        if(err) console.log(err);
    });
});

app.listen(5000, function () {
console.log('Server running at port: 5000')
})