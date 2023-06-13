const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const url = 'mongodb+srv://aza:mongoodb@cluster0.afiwueu.mongodb.net/?retryWrites=true&w=majority';
const dbName = 'appointments';

// Read records
async function readRecords() {
  const collectionName = 'appointments';
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.find({}).toArray();
    return result;
  } catch (err) {
    console.error('Error displaying data:', err);
  } finally {
    client.close();
  }
}

async function searchRecord(query) {
  const collectionName = 'appointments';
  const client = new MongoClient(url);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.find({"name": { $eq: query.name }}).toArray();
    return result;
  } catch (err) {
    console.error('Error displaying data:', err);
    throw err;
  } finally {
    client.close();
  }
}

// route to GET visitlist
app.get('/visitlist', async (req, res) => {
  const result = await readRecords();
  res.json(result);
});

// route to POST searchlist
app.post('/searchlist', async (req, res) => {
  try {
    const result = await searchRecord(req.body);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function main() {
  const result = await readRecords();
  console.log('Server starting...');
  await app.listen(4000);
}

main().catch(console.error);
