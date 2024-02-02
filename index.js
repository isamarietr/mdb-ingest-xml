require('dotenv').config()

const fs = require('fs')
const xml2js = require('xml2js');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const xpath = require('xpath')
const dom = require('xmldom').DOMParser

const { MongoClient } = require('mongodb');

const START_INDEX = 11
const END_INDEX = 12

async function main() {

  const uri = process.env.MONGODB_URI
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db("sample_xml")
    const collection = db.collection("data")
    await collection.drop()

    // await processFiles_xml2js(collection);
    // await processFiles_fastxmlparser(collection);
    await processFiles_xpath(collection);
  } finally {
    await client.close();
  }
}

main().catch(console.error);

/**
 * Using fast-xml-parser
 * @param {*} collection 
 */
async function processFiles_fastxmlparser(collection) {
  const options = {
    ignoreAttributes: true,
    attributeNamePrefix: "@_",
    alwaysCreateTextNode: false,
    textNodeName: 'value',
    allowBooleanAttributes: true
  };
  const parser = new XMLParser(options);

  for (let i = START_INDEX; i <= END_INDEX; i++) {
    const file = `${__dirname}/files/${i}.xml`
    console.log(`processFiles_fastxmlparser - Processing ${file}`)

    // Read the XML file
    const xml = fs.readFileSync(file);

    // Parse
    let result = parser.parse(xml);

    // console.log(JSON.stringify(result));
    // Insert the JSON data into MongoDB
    await collection.insertOne(result, function (err, res) {
      if (err) throw err;
      console.log('Inserted JSON into MongoDB');
    });
  }
}

/**
 * Using xml2js
 * @param {*} collection 
 */
async function processFiles_xml2js(collection) {
  const parser = new xml2js.Parser();

  for (let i = START_INDEX; i <= END_INDEX; i++) {
    const file = `${__dirname}/files/${i}.xml`
    console.log(`processFiles_xml2js - Processing ${file}`)

    // Read the XML file
    const xml = fs.readFileSync(file, 'utf-8');

    // Parse
    const result = await parser.parseStringPromise(xml)

    // console.log(JSON.stringify(result));
    // Insert the JSON data into MongoDB
    await collection.insertOne(result, function (err, res) {
      if (err) throw err;
      console.log('Inserted JSON into MongoDB');
      client.close();
    });
  }
}

/**
 * Using xpath
 * @param {*} collection 
 */
async function processFiles_xpath(collection) {
  const options = {
    ignoreAttributes: true,
    attributeNamePrefix: "@_",
    alwaysCreateTextNode: false,
    textNodeName: 'value',
    allowBooleanAttributes: true
  };
  const parser = new XMLParser(options);

  const selectXpaths = ['/locationData/location', '/library/book']
  for (let i = START_INDEX; i <= END_INDEX; i++) {
    const file = `${__dirname}/files/${i}.xml`
    console.log(`processFiles_xpath - Processing ${file}`)

    // Read the XML file
    const xml = fs.readFileSync(file, 'utf8');
    const doc = new dom().parseFromString(xml)

    // console.log(xml);
    for (let selectXpath of selectXpaths) {
      console.log(`processFiles_xpath - Looking for ${selectXpath}`);
      const matchedNodes = xpath.select(selectXpath, doc)
      for (let matchedNode of matchedNodes) {
        const xmlData = matchedNode.toString()
        // Parse node
        let result = parser.parse(xmlData);
        // console.log(result)
        // Insert the JSON data into MongoDB
        await collection.insertOne(result, function (err, res) {
          if (err) throw err;
          console.log('Inserted JSON into MongoDB');
        });
      }
    }
  }
}
