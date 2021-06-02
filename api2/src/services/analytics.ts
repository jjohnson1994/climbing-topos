import {globals} from "../models"

export const incrementGlobalCragCount = () => {
  return globals.update({
    UpdateExpression: "add #cragCount :inc",
    ExpressionAttributeNames: { 
      "#cragCount": "cragCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  })
}

export const incrementGlobalRouteCount = () => {
  return globals.update({
    UpdateExpression: "add #routeCount :inc",
    ExpressionAttributeNames: { 
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  })
}

export const incrementGlobalLogCount = () => {
  return globals.update({
    UpdateExpression: "add #logCount :inc",
    ExpressionAttributeNames: { 
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": 1
    },
  })
}
