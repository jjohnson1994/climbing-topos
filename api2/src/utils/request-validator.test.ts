import { APIGatewayProxyEventV2 } from "aws-lambda"
import { RequestValidator, validateRequest } from "./request-validator"

const getMockEvent = (body: {}): APIGatewayProxyEventV2 => ({
  body: JSON.stringify(body),
  headers: {},
  isBase64Encoded: false,
  rawPath: 'src/',
  rawQueryString: '',
  requestContext: {
    accountId: 'abc',
    apiId: 'abc',
    domainName: 'abc',
    domainPrefix: 'abc',
    http: {
      method: 'GET',
      path: '',
      protocol: '',
      sourceIp: '',
      userAgent: '',
    },
    requestId: '',
    routeKey: '',
    stage: '',
    time: '',
    timeEpoch: 1,
  },
  routeKey: 'abc',
  version: '0.0.1',
})

const bodyIsValid: RequestValidator = async (event: APIGatewayProxyEventV2) => {
  if (!event.body) {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message: "Invalid Request: No Body"
      })
    }
  }

  const { valid } = JSON.parse(event.body);

  if (valid === true) {
    return true;
  } else {
    return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message: 'Invalid Request'
      })
    };
  }
}

describe('RequestValidator', () => {
  test('Invoke on success function if request is valid', async () => {
    const event: APIGatewayProxyEventV2 = getMockEvent({
      valid: true,
    })

    const validatorResponse = await validateRequest(
      [ bodyIsValid ],
      event,
    )

    expect(validatorResponse).toBe(true);
  })

  test('Return error if request is invalid', async () => {
    const event: APIGatewayProxyEventV2 = getMockEvent({
      valid: false,
    })

    const validatorResponse = await validateRequest(
      [ bodyIsValid ],
      event,
    )

    expect(validatorResponse).toStrictEqual({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message: 'Invalid Request'
      })
    });
  })
})
