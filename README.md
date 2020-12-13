![Node.js CI](https://github.com/NoManColonies/innergy-m9/workflows/Node.js%20CI/badge.svg)
### Innergy M9 project

- Visit link below for further documentations.
```
https://docs.worawanbydiistudent.store/
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
