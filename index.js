const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const password = "xaF_Z.7uUC5aTHK"; 

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://ogranicUser:xaF_Z.7uUC5aTHK@cluster0.2l8hb.mongodb.net/organicdb?retryWrites=true&w=majority";

const uri = "mongodb+srv://organicUser:xaF_Z.7uUC5aTHK@cluster0.2l8hb.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
// app.use (bodyParser.urlencoded({extended: true}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use (bodyParser.json());

app.get('/', (req, res) => {
    // res.send('Hello I am working here')
    res.sendFile(__dirname + '/index.html');
})

client.connect(err => {
  const productCollection = client.db("organicdb").collection("products");

  // GET or READ
  app.get('/products', (req, res)=>{
    // productCollection.find({}).limit(4)
    productCollection.find({})
    .toArray((err, documents)=>{
      res.send(documents);
    })
  })

  app.get('/product/:id', (req, res) =>{
    productCollection.find({_id: ObjectId(req.params.id)})
    .toArray ((err, documents)=>{
      res.send(documents[0]);
    })
  })

    // const product = {name: "honey", price: 25, quantity: 20};
  //CREATE
    app.post("/addProduct", (req, res) =>{
      const product = req.body;
    //   console.log(product);
      productCollection.insertOne(product)
      .then(result=>{
          console.log('product added successfully');
          res.redirect('/');
      })
  })

  //PATCH or UPDATE
  app.patch('/update/:id', (req,res) =>{
    productCollection.updateOne({_id:ObjectId(req.params.id)},
    {
      $set: {price: req.body.price, quantity: req.body.quantity}
    })
    .then(result =>{
      console.log(result)
    })
  })


// DELETE
app.delete('/delete/:id', (req, res)=>{
  // console.log(req.params.id);
  productCollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(( result)=>{
    res.send(result.deletedCount > 0);
  })
})


});
app.listen(3000);