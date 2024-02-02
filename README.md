
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

## Working with files in S3


## Using SQL in Atlas

## Using Full-text Search in Atlas

## Moving coordinates to array
```
[
  {
    $match:
      /**
       * query: The query in MQL.
       */
      {
        "location.coordinates": {
          $exists: true,
        },
      },
  },
  {
    $project:
      /**
       * specifications: The fields to
       *   include or exclude.
       */
      {
        name: "$location.name",
        location: {
          type: "Point",
         coordinates: [
           "$location.coordinates.longitude",
          "$location.coordinates.latitude"
        ]
        },
      },
  },
  {
    $merge:
      /**
       * into: The target collection.
       * on: Fields to  identify.
       * let: Defined variables.
       * whenMatched: Action for matching docs.
       * whenNotMatched: Action for non-matching docs.
       */
      {
        into: "data-coords",
        on: "_id",
        whenMatched: "replace",
      },
  },
]
```
