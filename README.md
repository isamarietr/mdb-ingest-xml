
## Ingesting XML Files

1. From command line using `mongoimport`
```
cat files/12.xml | xml2js | mongoimport --uri "mongodb+srv://isa_torres:isa_torres@demo-six.gvsa9.mongodb.net/sample_xml" --collection data --drop --numInsertionWorkers=10
```

```
fxparser files/12.xml | mongoimport --uri "mongodb+srv://isa_torres:isa_torres@demo-six.gvsa9.mongodb.net/sample_xml" --collection data --drop --numInsertionWorkers=10
```

2. From app using MongoDB Driver
```
node index.js
 ```
