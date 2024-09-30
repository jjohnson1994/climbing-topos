import { unmarshall } from "@aws-sdk/util-dynamodb";


export function normalizeRow<T>(image: { [key: string]: any }): T {
  return unmarshall(image) as T
}
