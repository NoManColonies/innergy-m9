# url: url/api/{dev_id}/{timestamp}/{type}

## header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _KEY_"
}
```

## response
```json
{
  "status": "true|false",
  "dev_id": "dev_id",
  "data": {
    "type": "type",
    "valueProperties": {
      "value": "value",
      "timestamp": "timestamp"
    },
    "unit": "unit"
  }
}
```

### example call

 - url
```
openapi.modulars.io/api/v1/IMEU001/2020-12-04T13:42:00Z/temp
```

 - header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _SOME_RANDOM_TOKEN_"
}
```

 - response
```json
{
  "status": true,
  "dev_id": "IMEU001",
  "data": {
    "type": "temp",
    "valueProperties": {
      "value": 35,
      "timestamp": "2020-12-04T13:42:00Z"
    },
    "unit": "Celcius"
  }
}
```

# url: url/api/{dev_id}/{timestamp}

## header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _KEY_"
}
```

## response
```json
{
  "status": "true|false",
  "dev_id": "dev_id",
  "data": [{
    "type": "type",
    "valueProperties": {
      "value": "value",
      "timestamp": "timestamp"
    },
    "unit": "unit"
  }]
}
```

### example call

 - url
```
openapi.modulars.io/api/v1/IMEU001/2020-12-04T13:42:00Z
#   or
openapi.modulars.io/api/v1/IMEU001/latest
```

 - header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _SOME_RANDOM_TOKEN_"
}
```

 - response
```json
{
  "status": true,
  "dev_id": "IMEU001",
  "data": [
    {
      "type": "temp",
      "valueProperties": {
        "value": 35,
        "timestamp": "2020-12-04T13:42:00Z"
      },
      "unit": "Celcius"
    },
    {
      "type": "moist",
      "valueProperties": {
        "value": 70,
        "timestamp": "2020-12-04T13:42:00Z"
      },
      "unit": "Percentage"
    }
  ]
}
```

# url: url/api/{dev_id}/{type}

## header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _KEY_"
}
```

## response
```json
{
  "status": "true|false",
  "dev_id": "dev_id",
  "data": {
    "type": "type",
    "valueProperties": [{
      "value": "value",
      "timestamp": "timestamp"
    }],
    "unit": "unit"
  }
}
```

### example call

 - url
```
openapi.modulars.io/api/v1/IMEU001/temp
```

 - header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _SOME_RANDOM_TOKEN_"
}
```

 - response
```json
{
  "status": "true|false",
  "dev_id": "IMEU001",
  "data": {
    "type": "temp",
    "valueProperties": [
    {
      "value": 35,
      "timestamp": "2020-12-05T13:42:00Z"
    },
    {
      "value": 35.5,
      "timestamp": "2020-12-05T13:43:00Z"
    },
    {
      "value": 35.2,
      "timestamp": "2020-12-05T13:44:00Z"
    }
    ],
    "unit": "Celcius"
  }
}
```

# url: url/api/{dev_id}

## header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _KEY_"
}
```

## response
```json
{
  "status": "true|false",
  "dev_id": "dev_id",
  "data": [{
    "type": "type",
    "valueProperties": [{
      "value": "value",
      "timestamp": "timestamp"
    }],
    "unit": "unit"
  }]
}
```

### example call

 - url
```
openapi.modulars.io/api/v1/IMEU001
```

 - header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _SOME_RANDOM_TOKEN_"
}
```

 - response

```json
{
  "status": true,
  "dev_id": "IMEU001",
  "data": [
  {
    "type": "temp",
    "valueProperties": [
    {
      "value": 35,
      "timestamp": "2020-12-05T13:42:00Z"
    },
    {
      "value": 35.5,
      "timestamp": "2020-12-05T13:43:00Z"
    },
    {
      "value": 35.2,
      "timestamp": "2020-12-05T13:44:00Z"
    }
    ],
    "unit": "Celcius"
  },
  {
    "type": "moist",
    "valueProperties": [
    {
      "value": 70,
      "timestamp": "2020-12-04T13:42:00Z"
    },
    {
      "value": 72,
      "timestamp": "2020-12-04T13:43:00Z"
    },
    {
      "value": 71,
      "timestamp": "2020-12-04T13:44:00Z"
    }
    ],
    "unit": "Percentage"
  }
  ]
}
```

# url: url/api

## header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _KEY_"
}
```

## response
```json
{
  "dev_ids": [{
    "dev_id": "dev_id",
    "status": "status"
  }]
}
```

### example call

 - url
```
openapi.modulars.io/api/v1
```

 - header
```json
{
  "Content-Type": "application/json",
  "Authentication": "Bearer _SOME_RANDOM_TOKEN_"
}
```

 - response
```json
{
  "dev_ids": [
  {
    "dev_id": "IMEU001",
    "status": true
  },
  {
    "dev_id": "IMEU002",
    "status": false
  }
  ]
}
```

### Collection

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
