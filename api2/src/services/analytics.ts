import {globals} from "../models"

export const incrementGlobalCragCount = (count = 1) => {
  return globals.update({
    UpdateExpression: "add #cragCount :inc",
    ExpressionAttributeNames: { 
      "#cragCount": "cragCount",
    },
    ExpressionAttributeValues: {
      ":inc": count
    },
  })
}

export const incrementGlobalRouteCount = (count = 1) => {
  return globals.update({
    UpdateExpression: "add #routeCount :inc",
    ExpressionAttributeNames: { 
      "#routeCount": "routeCount",
    },
    ExpressionAttributeValues: {
      ":inc": count
    },
  })
}

export const incrementGlobalLogCount = (count = 1) => {
  return globals.update({
    UpdateExpression: "add #logCount :inc",
    ExpressionAttributeNames: { 
      "#logCount": "logCount",
    },
    ExpressionAttributeValues: {
      ":inc": count
    },
  })
}
