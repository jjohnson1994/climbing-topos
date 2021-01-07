import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Log, LogRequest } from "../../core/types";

export async function createRouteLog(logRequest: LogRequest, user) {
  const date = DateTime.utc().toString();
  const cragLogSlug = nanoid();
  const userLogSlug = nanoid();

  const cragLogParams = {
    TableName: String(process.env.DB),
    Item: {
      hk: logRequest.cragSlug,
      sk: `log#area#${logRequest.areaSlug}#topo#${logRequest.topoSlug}#route#${logRequest.routeSlug}#${cragLogSlug}`,
      model: "log",
      areaSlug: logRequest.areaSlug,
      attempts: logRequest.attempts,
      comment: logRequest.comment,
      cragSlug: logRequest.cragSlug,
      dateSent: logRequest.dateSent,
      grade: logRequest.grade,
      gradeTaken: logRequest.gradeTaken,
      gradingSystem: logRequest.gradingSystem,
      routeSlug: logRequest.routeSlug,
      routeType: logRequest.routeType,
      slug: cragLogSlug,
      stars: logRequest.stars,
      tags: logRequest.tags,
      title: logRequest.routeTitle,
      createdAt: date,
      updatedAt: date
    }
  }

  const userLogParams = {
    TableName: String(process.env.DB),
    Item: {
      hk: `user#${user.sub}`,
      sk: `log#crag#${logRequest.cragSlug}#area#${logRequest.areaSlug}#topo#${logRequest.topoSlug}#route#${logRequest.routeSlug}#${userLogSlug}`,
      model: "log",
      areaSlug: logRequest.areaSlug,
      attempts: logRequest.attempts,
      comment: logRequest.comment,
      cragSlug: logRequest.cragSlug,
      dateSent: logRequest.dateSent,
      grade: logRequest.grade,
      gradeTaken: logRequest.gradeTaken,
      gradingSystem: logRequest.gradingSystem,
      routeSlug: logRequest.routeSlug,
      routeType: logRequest.routeType,
      slug: userLogSlug,
      stars: logRequest.stars,
      tags: logRequest.tags,
      title: logRequest.routeTitle,
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

export async function getLogsForUser(userSub: string, cragSlug?: string, areaSlug?: string, topoSlug?: string, routeSlug?: string): Promise<Log[]> {
  console.log({ userSub, cragSlug, areaSlug, topoSlug, routeSlug });
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

  console.log({ queryString });

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
