const express = require("express");
const {MongoClient} = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

require("dotenv").config();
const cors = require("cors");
const res = require("express/lib/response");
const {query} = require("express");

const app = express();
const port = 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@mydb1.yooxs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    // console.log("db connected");
    const database = client.db("carMechanics");
    const servicesCollection = database.collection("services");
    // get api or get all data from db to ui
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });
    // GET SINGLE SERVICE
    app.get("services/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting single id", id);
      const query = {_id: ObjectId(id)};
      const service = await servicesCollection.findOne(query);
      res.json(service);
    });

    // post api

    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api", service);

      // const service = {
      //   name: "ENGINE DIAGNOSTIC",
      //   price: "300",
      //   description:
      //     "Lorem ipsum dolor sit amet, consectetu radipisi cing elitBeatae autem aperiam nequ quaera molestias voluptatibus harum ametipsa.",
      //   img: "https://i.ibb.co/dGDkr4v/1.jpg",
      // };

      const result = await servicesCollection.insertOne(service);
      console.log(result);

      res.json(result);
    });

    // Delete api
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await servicesCollection.deleteOne(query);
      res.json(result);
    });
  } finally {
    // await clien.close();
  }
}
run().catch(console.dir);
app.get("/", (req, res) => {
  res.send("Running genius3 server");
});

app.listen(port, () => {
  console.log("running genius server5 on port", port);
});
