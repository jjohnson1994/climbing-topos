import AWS from "aws-sdk";
import { Client } from "pg";

const IS_OFFLINE = process.env.IS_OFFLINE;

const escapeSingleQuotes = (stringValue: string): string => {
  // TS does not support replaceAll
  return `${stringValue}`.replace(/'/g, "''");
}

const populateQueryParams = (
  sql: AWS.RDSDataService.Types.SqlStatement,
  parameters: AWS.RDSDataService.Types.SqlParametersList
) => {
  const populatedQuery = parameters.reduce((acc, cur) => {
    if (typeof cur.value?.stringValue !== "undefined") {
      return (acc as any).replaceAll(`:${cur.name}`, `'${escapeSingleQuotes(Object.values(cur.value)[0])}'`);
    } else if (typeof cur.value?.blobValue !== "undefined") {
      return (acc as any).replaceAll(`:${cur.name}`, Object.values(cur.value)[0]);
    } else if (typeof cur.value?.arrayValue !== "undefined") {
      return (acc as any).replaceAll(`:${cur.name}`, Object.values(cur.value)[0]);
    } else if (typeof cur.value?.isNull !== "undefined") {
      return (acc as any).replaceAll(`:${cur.name}`, Object.values(cur.value)[0]);
    } else if (typeof cur.value?.longValue !== "undefined") {
      return (acc as any).replaceAll(`:${cur.name}`, Object.values(cur.value)[0]);
    } else if (typeof cur.value?.doubleValue !== "undefined") {
      return (acc as any).replaceAll(`:${cur.name}`, Object.values(cur.value)[0]);
    } else if (typeof cur.value?.booleanValue !== "undefined") {
      return (acc as any).replaceAll(`:${cur.name}`, Object.values(cur.value)[0]);
    } else {
      throw new Error("Value type does not exist");
    }
  }, sql);

  return populatedQuery;
}

const rdsPgNodeWrapper = {
  executeStatement: (
    params: AWS.RDSDataService.Types.ExecuteStatementRequest
  ) => {
    const exec = async () => {
      const client = new Client()
      await client.connect()

      const query = params.parameters
        ? populateQueryParams(params.sql, params.parameters)
        : params.sql; 

      const res = await client.query(query)
      await client.end()

      return {
        records: res.rows,
      }
    };

    return { promise: exec };
  }
}

const rdsDataService = {
  executeStatement: (
    params: AWS.RDSDataService.Types.ExecuteStatementRequest
  ) => {
    const exec = async () => {
      console.log("real exec");
      const rows: {[key: string]: string}[] = [];
      const cols: string[] = [];
      const client = new AWS.RDSDataService();
      const { records = [], columnMetadata = [] } = await client.executeStatement(params).promise();

      console.log("raw records", records);

      columnMetadata.map(col => {
        cols.push(`${col.name}`)
      });

      records.map((record) => {
        const row: {[key: string]: any} = {};
        record.map((value, i) => {
          row[cols[i]] = value.stringValue 
            ?? value.blobValue
            ?? value.doubleValue
            ?? value.longValue
            ?? value.booleanValue
            ?? null;
        })
        rows.push(row)
      })

      console.log("cleaned records", records);

      return records;
    }

    return { promise: exec };
  }
}

export default (
  IS_OFFLINE
    ? rdsPgNodeWrapper
    : rdsDataService
) as AWS.RDSDataService;
