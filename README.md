### Innergy M9 project

- Visit link below for further documentations.
```
http://34.126.117.33/
```

### Collection

 - units
```
db.createCollection("units",
{
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: [
        "name",
        "unit"
      ],
         properties: {
            name: {
               bsonType: "string"
        },
            unit: {
               bsonType: "string"
        }
      }
    }
  }
})
```

 - raws
```
db.createCollection("raws",
{
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: [
        "value",
        "timestamp"
      ]
    }
  }
})
```

 - sensors
```
db.createCollection("sensors",
{
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: [
        "type",
        "unit"
      ],
         properties: {
            type: {
               bsonType: "string"
        },
            unit: {
               bsonType: "string"
        },
      }
    }
  }
})
```

 - user
```
db.createCollection("users",
{
   validator: {
      $jsonSchema: {
         bsonType: "object",
         required: [
        "role",
        "u_id"
      ],
         properties: {
            role: {
               enum: [
            "user",
            "admin",
            "device"
          ]
        },
            u_id: {
               bsonType: "string"
        },
      }
    }
  }
})
```
