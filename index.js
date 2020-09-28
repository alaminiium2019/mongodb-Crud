const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;

const password="XFvLkIczqTTqgIfJ";

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://realUser:XFvLkIczqTTqgIfJ@cluster0.hkci2.mongodb.net/realFoodDb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

app.get('/',(req,res) =>{
    res.sendFile(__dirname + "/index.html");
    //res.send("Hello world");
})



client.connect(err => {
  const ProductCollection = client.db("realFoodDb").collection("products");
 
  //get data 

 app.get('/products',(req, res) => {
     ProductCollection.find({})
     .toArray((err,documents) => {
         res.send(documents);
     })

 })
 
 
  //post data to server
  app.post("/addProduct", (req,res) => {
      const product = req.body;
      ProductCollection.insertOne(product)
      .then(result => {
          console.log('data added successfully');
          res.redirect('/');
      })

  })

//update

app.get('/product/:id', (req,res) => {
    ProductCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err,documents) => {
        res.send(documents[0]);
    })
})
//update
app.patch('/update/:id',(req,res) => {
    console.log(req.body.price);
    ProductCollection.updateOne({_id: ObjectId(req.params.id)},
    {
        $set : {price: req.body.price, qty: req.body.qty}
    })
    .then(result => {
        res.send(result.modifiedCount>0)
    })
})

  //Delete
  app.delete('/delete/:id', (req,res) => {
      ProductCollection.deleteOne({_id: ObjectId(req.params.id)})
      .then( result => {
        res.send(result.deletedCount > 0);

      })
      
  })

  console.log("database connected")
});



app.listen(3500);