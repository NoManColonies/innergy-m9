module.exports = ({ RawModel, DeviceModel }) => {
  const withReferences = references => {
    const Raw = RawModel.query()

    if (references) {
      const extractedReferences = references.split(',')

      extractedReferences.forEach(reference => Raw.with(reference))
    }

    return Raw
  }

  return {
    feedNewData: ({ data, device, timestamp_date, u_id, units, uuidv4 }) => data.map(async d => {
      const { value, type } = d

      const sensor = await device
        .sensors()
        .where({ ref_u_id: u_id, type, timestamp_date })
        .first()

      if (sensor) {
        return sensor.valueProperties().create({ value })
      }

      return device
        .sensors()
        .create({ s_id: uuidv4(), type, unit: units[type], timestamp_date })
        .then(newSensor => newSensor.valueProperties().create({ value }))
    }),
    queryWithTimestampConditions: (
      { timestamp, type, u_id, role, dev_id, currentDate },
      typeCondition = false
    ) => {
      if (timestamp.toLowerCase() === 'latest') {
        return DeviceModel.where(
          role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
        )
          .with('sensors', builder => builder
            .where(
              typeCondition
                ? { timestamp_date: currentDate, type }
                : { timestamp_date: currentDate }
            )
            .setHidden(['s_id', '_id', 'ref_u_id'])
            .with('valueProperties', subBuilder => subBuilder.sort('-timestamp').setHidden(['_id', 'ref_s_id'])))
          .sort('-timestamp_date')
          .first()
          .then(query => query.getRelated('sensors').toJSON())
          .then(sensors => sensors.map(sensor => {
            const [valueProperties] = sensor.valueProperties
            sensor.valueProperties = valueProperties
            return sensor
          }))
      }
      if (timestamp.indexOf('~') === -1) {
        const filter = new Date(timestamp)

        const timestamp_date = new Date(filter.setHours(7))

        return DeviceModel.where(
          role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
        )
          .with('sensors', builder => builder
            .where(
              typeCondition ? { timestamp_date, type } : { timestamp_date }
            )
            .setHidden(['_id', 's_id', 'ref_u_id'])
            .with('valueProperties', subBuilder => subBuilder.sort('-timestamp').setHidden(['_id', 'ref_s_id'])))
          .sort('-timestamp_date')
          .first()
          .then(query => query.getRelated('sensors'))
      }
      const timestamps = timestamp.split('~')
      const filters = [new Date(timestamps[0]), new Date(timestamps[1])]
      const timestamp_dates = [
        new Date(
          `${filters[0].getFullYear()}-${
            filters[0].getUTCMonth() + 1
          }-${filters[0].getDate()}`
        ),
        new Date(
          `${filters[1].getFullYear()}-${
            filters[1].getUTCMonth() + 1
          }-${filters[1].getDate()}`
        )
      ]

      return DeviceModel.where(
        role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
      )
        .with('sensors', builder => builder
          .where(
            typeCondition
              ? {
                timestamp_date: {
                  $gte: timestamp_dates[0],
                  $lte: timestamp_dates[1]
                },
                type
              }
              : {
                timestamp_date: {
                  $gte: timestamp_dates[0],
                  $lte: timestamp_dates[1]
                }
              }
          )
          .with('valueProperties', subBuilder => subBuilder
            .where({ timestamp: { $gte: timestamps[0], $lte: timestamps[1] } })
            .sort('-timestamp')
            .setHidden(['_id', 'ref_s_id']))
          .sort('-timestamp_date')
          .setHidden(['_id', 's_id', 'ref_u_id']))
        .first()
        .then(query => query.getRelated('sensors'))
    },
    queryWithType: ({ role, u_id, dev_id, type }) => DeviceModel.where(
      role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
    )
      .with('sensors', builder => builder
        .where({ type })
        .setHidden(['_id', 's_id', 'ref_u_id'])
        .with('valueProperties', subBuilder => subBuilder.sort('-timestamp').setHidden(['_id', 'ref_s_id'])))
      .sort('-timestamp_date')
      .first()
      .then(query => query.getRelated('sensors')),
    queryLatest: ({ role, u_id, currentDate }) => DeviceModel.where(
      role === 'admin' ? { role: 'device' } : { role: 'device', owner: u_id }
    )
      .setHidden(['role', 'auth_id', 'owner', '_id', 'updated_at'])
      .with('sensors', builder => builder
        .where({ timestamp_date: currentDate })
        .setHidden(['_id', 's_id', 'ref_u_id'])
        .sort('-timestamp_date')
        .with('valueProperties', subBuilder => subBuilder.sort('-timestamp').setHidden(['_id', 'ref_s_id'])))
      .fetch()
      .then(query => query.toJSON())
      .then(devicesQuery => devicesQuery.map(device => {
        device.sensors = device.sensors.map(sensor => {
          const [valueProperties] = sensor.valueProperties
          sensor.valueProperties = valueProperties
          return sensor
        })

        return device
      })),
    getAll: ({ role, dev_id, u_id, currentDate }) => DeviceModel.where(
      role === 'admin' ? { u_id: dev_id } : { u_id: dev_id, owner: u_id }
    )
      .with('sensors', builder => builder
        .where({ timestamp_date: { $gte: currentDate } })
        .with('valueProperties', subBuilder => subBuilder.sort('-timestamp').setHidden(['_id', 'ref_s_id']))
        .setHidden(['_id', 's_id', 'ref_u_id']))
      .sort('-timestamp_date')
      .first()
      .then(query => query.getRelated('sensors')),
    getDevices: ({ role, u_id }) => DeviceModel.where(
      role === 'admin' ? { role: 'device' } : { role: 'device', owner: u_id }
    )
      .setHidden(['role', 'auth_id', 'owner', '_id', 'updated_at'])
      .with('sensors', builder => builder
        .setHidden(['_id', 's_id', 'ref_u_id'])
        .limit(5)
        .sort('-timestamp_date'))
      .fetch()
  }
}
