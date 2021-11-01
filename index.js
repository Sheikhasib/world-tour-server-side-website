const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fiz9x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try{
        await client.connect();
        // console.log('database connected');
        const database = client.db('tour_spot');
        const tourCollection = database.collection('spots');

        // GET spots API
        app.get('/spots', async(req, res) => {
            const cursor = tourCollection.find({});
            const spots = await cursor.toArray();
            res.send(spots);
        })

        // GET Single Spot
        app.get('/spots/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = {_id: ObjectId(id)};
            const spot = await tourCollection.findOne(query);
            res.json(spot);
        })

        // POST API
        app.post('/spots', async(req, res)=>{
            const service = req.body;
             console.log('hit the post api', service);
           
             const result = await tourCollection.insertOne(service);
             console.log(result);
            res.json(result)
         })

         // DELETE Specific API
        app.delete('/spots/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })


    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    console.log(req);
  res.send('Hello updated World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})