import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Auth0User, Log, LogRequest } from "../../core/types";

export async function createRouteLog(logRequest: LogRequest, user: Auth0User) {
  const date = DateTime.utc().toString();
  const cragLogSlug = nanoid();
  const userLogSlug = nanoid();

  const logData: LogRequest = {
    areaSlug: logRequest.areaSlug,
    areaTitle: logRequest.areaTitle,
    attempts: logRequest.attempts,
    comment: logRequest.comment,
    country: logRequest.country,
    countryCode: logRequest.countryCode,
    county: logRequest.county,
    cragSlug: logRequest.cragSlug,
    cragTitle: logRequest.cragTitle,
    dateSent: logRequest.dateSent,
    grade: logRequest.grade,
    gradeModal: logRequest.gradeModal,
    gradeTaken: logRequest.gradeTaken,
    gradingSystem: logRequest.gradingSystem,
    rating: logRequest.rating,
    region: logRequest.region,
    rockType: logRequest.rockType,
    routeSlug: logRequest.routeSlug,
    routeTitle: logRequest.routeTitle,
    routeType: logRequest.routeType,
    state: logRequest.state,
    tags: logRequest.tags,
    topoSlug: logRequest.topoSlug,
  };

  const cragLogParams = {
    TableName: String(process.env.DB),
    Item: {
      hk: logRequest.cragSlug,
      sk: `log#area#${logRequest.areaSlug}#topo#${logRequest.topoSlug}#route#${logRequest.routeSlug}#${cragLogSlug}`,
      ...logData,
      model: "log",
      slug: userLogSlug,
      user: {
        nickname: user.nickname,
        sub: user.sub,
        picture: user.picture,
      },
      createdAt: date,
      updatedAt: date
    }
  }

  const userLogParams = {
    TableName: String(process.env.DB),
    Item: {
      hk: `user#${user.sub}`,
      sk: `log#crag#${logRequest.cragSlug}#area#${logRequest.areaSlug}#topo#${logRequest.topoSlug}#route#${logRequest.routeSlug}#${userLogSlug}`,
      ...logData,
      model: "log",
      slug: userLogSlug,
      user: {
        nickname: user.nickname,
        sub: user.sub,
        picture: user.picture,
      },
      createdAt: date,
      updatedAt: date
    }
  }

  await Promise.all([
    dynamodb.put(cragLogParams).promise(),
    dynamodb.put(userLogParams).promise()
  ]);
}

export async function getLogsByCragSlug(cragSlug: string): Promise<Log[]> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames:{
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": cragSlug,
      ":sk": `log`
    }
  }

  const response = await dynamodb.query(params).promise()
  return response?.Items as Log[];
}

export async function getLogsByRoute(
  cragSlug: string,
  areaSlug: string,
  topoSlug: string,
  routeSlug: string
): Promise<Log[]> {
  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: '#hk = :hk AND begins_with(#sk, :sk)',
    ExpressionAttributeNames: {
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      "#hk": `${cragSlug}`,
      ":sk": `log#area#${areaSlug}#topo#${topoSlug}#route#${routeSlug}`
    }
  };

  const response = await dynamodb.query(params).promise();
  return response?.Items as Log[];
}

export async function getLogsForUser(userSub: string, cragSlug?: string, areaSlug?: string, topoSlug?: string, routeSlug?: string): Promise<Log[]> {
  let queryString = `log#`;

  if (cragSlug) {
    queryString += `crag#${cragSlug}#`;
  }

  if (cragSlug && areaSlug) {
    queryString += `area#${areaSlug}#`;
  }

  if (cragSlug && areaSlug && topoSlug) {
    queryString += `topo#${topoSlug}#`;
  }

  if (cragSlug && areaSlug && topoSlug && routeSlug) {
    queryString += `route#${routeSlug}#`;
  }

  const params = {
    TableName: String(process.env.DB),
    KeyConditionExpression: "#hk = :hk AND begins_with(#sk, :sk)",
    ExpressionAttributeNames:{
      "#hk": "hk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":hk": `user#${userSub}`,
      ":sk": queryString
    }
  }

  const response = await dynamodb.query(params).promise()
  return response?.Items as Log[];
}
