import { nanoid } from "nanoid";
import { DateTime } from "luxon";

import { dynamodb } from '../db';
import { Log, LogRequest } from "../../core/types";

export async function createRouteLog(logRequest: LogRequest) {
  const date = DateTime.utc().toString();
  const slug = nanoid();

  // Save Log to Crag
  const cragLogParams = {
    TableName: String(process.env.DB),
    Item: {
      hk: logRequest.cragSlug,
      sk: `log#${logRequest.areaSlug}#${logRequest.routeSlug}#${slug}`,
      model: "log",
      attempts: logRequest.attempts,
      comment: logRequest.comment,
      dateSend: logRequest.dateSent,
      grade: logRequest.grade,
      gradeTaken: logRequest.gradeTaken,
      gradingSystem: logRequest.gradingSystem,
      routeType: logRequest.routeType,
      slug,
      stars: logRequest.stars,
      tags: logRequest.tags,
      title: logRequest.routeTitle,
      createdAt: date,
      updatedAt: date
    }
  }

  // Save Log to User
  const userLogParams = {
    TableName: String(process.env.DB),
    Item: {
      hk: logRequest.cragSlug,
      sk: `log#${logRequest.areaSlug}#${logRequest.routeSlug}#${slug}`,
      model: "log",
      attempts: logRequest.attempts,
      comment: logRequest.comment,
      dateSend: logRequest.dateSent,
      grade: logRequest.grade,
      gradeTaken: logRequest.gradeTaken,
      gradingSystem: logRequest.gradingSystem,
      routeType: logRequest.routeType,
      slug,
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
