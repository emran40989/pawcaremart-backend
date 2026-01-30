const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = 3000;

const app = express();
app.use(cors());
app.use(express.json());

const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.oh3nqax.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("pet_service");
    const petService = database.collection("services");
    const ordersCollection = database.collection("orders");

    app.post("/services", async (req, res) => {
      const data = req.body;
      const date = new Date();
      data.createdAt = date;
      console.log(data);
      const result = await petService.insertOne(data);
      res.send(result);
    });

    app.get("/services", async (req, res) => {
      const {category} = req.query;
      const query = {};
      if(category){
        query.category = category;
      }
      const result = await petService.find(query).toArray();
      res.send(result);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const result = await petService.findOne(query);
      res.send(result);
    });

    app.get("/my-services", async (req, res) => {
      const { email } = req.query;
      const query = { 
        email: email
      };

      const result = await petService.find(query).toArray();
      res.send(result);
    });

    app.put("/update/:id", async (req, res) => {
      const data = req.body;
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };

      const updateService = {
        $set: data,
      };

      const result = await petService.updateOne(query, updateService);
      res.send(result);
    });


    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await petService.deleteOne(query);
      res.status(201).send(result);
    })


    app.post('/orders', async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await ordersCollection.insertOne(data);
      res.status(201).send(result);
    });

    app.get('/orders', async (req, res) => {
      const result = await ordersCollection.find().toArray();
      res.send(result);
    });

    app.get('/my-orders', async (req, res) => {
      const { email } = req.query;
      const query = {
        buyerEmail: email
      };
      const result = await ordersCollection.find(query).toArray();
      res.send(result);
    });

    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!",
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Developers!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
