import { algoliaAppId, algoliaIndex, algoliaAdminKey } from './secrets'
import { table } from './dynamo'

const topicAreaOnInsert = new sst.aws.SnsTopic("areaOnInsert");
topicAreaOnInsert.subscribe({
  handler: 'packages/api/events/area/areaOnInsert.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicAreaOnModify = new sst.aws.SnsTopic("areaOnModify");
topicAreaOnModify.subscribe({
  handler: 'packages/api/events/area/areaOnModify.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicAreaOnRemove = new sst.aws.SnsTopic("areaOnRemove");
topicAreaOnRemove.subscribe({
  handler: 'packages/api/events/area/areaOnRemove.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicCragOnInsert = new sst.aws.SnsTopic("cragOnInsert");
topicCragOnInsert.subscribe({
  handler: 'packages/api/events/crag/cragOnInsert.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicCragOnModify = new sst.aws.SnsTopic("cragOnModify");
topicCragOnModify.subscribe({
  handler: 'packages/api/events/crag/cragOnModify.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicCragOnRemove = new sst.aws.SnsTopic("cragOnRemove");
topicCragOnRemove.subscribe({
  handler: 'packages/api/events/crag/cragOnRemove.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicLogOnInsert = new sst.aws.SnsTopic("logOnInsert");
topicLogOnInsert.subscribe({
  handler: 'packages/api/events/log/logOnInsert.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicLogOnModify = new sst.aws.SnsTopic("logOnModify");
topicLogOnModify.subscribe({
  handler: 'packages/api/events/log/logOnModify.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicLogOnRemove = new sst.aws.SnsTopic("logOnRemove");
topicLogOnRemove.subscribe({
  handler: 'packages/api/events/log/logOnRemove.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicRouteOnInsert = new sst.aws.SnsTopic("routeOnInsert");
topicRouteOnInsert.subscribe({
  handler: 'packages/api/events/routes/routeOnInsert.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicRouteOnModify = new sst.aws.SnsTopic("routeOnModify");
topicRouteOnModify.subscribe({
  handler: 'packages/api/events/route/routeOnModify.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicRouteOnRemove = new sst.aws.SnsTopic("routeOnRemove");
topicRouteOnRemove.subscribe({
  handler: 'packages/api/events/route/routeOnRemove.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicTopoOnInsert = new sst.aws.SnsTopic("topoOnInsert");
topicTopoOnInsert.subscribe({
  handler: 'packages/api/events/topo/topoOnInsert.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicTopoOnModify = new sst.aws.SnsTopic("topoOnModify");
topicTopoOnModify.subscribe({
  handler: 'packages/api/events/topo/topoOnModify.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

const topicTopoOnRemove = new sst.aws.SnsTopic("topoOnRemove");
topicTopoOnRemove.subscribe({
  handler: 'packages/api/events/topo/topoOnRemove.handler',
  link: [
    algoliaAdminKey,
    algoliaAppId,
    algoliaIndex,
    table
  ]
})

table.subscribe({
  handler: 'packages/api/events/dynamodb/stream.handler',
  environment: { 
    TOPIC_ARN_AREA_INSERT: topicAreaOnInsert.arn,
    TOPIC_ARN_AREA_MODIFY: topicAreaOnModify.arn,
    TOPIC_ARN_AREA_REMOVE: topicAreaOnRemove.arn,
    TOPIC_ARN_CRAG_INSERT: topicCragOnInsert.arn,
    TOPIC_ARN_CRAG_MODIFY: topicCragOnModify.arn,
    TOPIC_ARN_CRAG_REMOVE: topicCragOnRemove.arn,
    TOPIC_ARN_LOG_INSERT: topicLogOnInsert.arn,
    TOPIC_ARN_LOG_REMOVE: topicLogOnRemove.arn,
    TOPIC_ARN_ROUTE_INSERT: topicRouteOnInsert.arn,
    TOPIC_ARN_ROUTE_MODIFY: topicRouteOnModify.arn,
    TOPIC_ARN_ROUTE_REMOVE: topicRouteOnRemove.arn,
    TOPIC_ARN_TOPO_INSERT: topicTopoOnInsert.arn,
    TOPIC_ARN_TOPO_MODIFY: topicTopoOnModify.arn,
    TOPIC_ARN_TOPO_REMOVE: topicTopoOnRemove.arn,
  },
  permissions: [
    {
      actions: ['SNS:Publish'],
      resources: ['*']
    }
  ]
})

