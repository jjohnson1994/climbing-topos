import fetch from "node-fetch";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "./get";
import { Crag } from "../../../../../core/types";

jest.mock("node-fetch");
jest.mock("../../../services", () => ({
  crags: {
    getCragBySlug: (): Pick<Crag, "managedBy"> => ({
      managedBy: {
        sub: "crag-manager-mock-sub",
        picture: "picture-url",
        nickname: "nickname-sub",
      },
    }),
    getCragItemsAwaitingAproval: () => [
      { model: "route" },
      { model: "area" },
      { model: "topo" },
    ],
  },
}));

const fetchMock = fetch as unknown as jest.Mock;

describe("Get Crag Items Awaiting Approval", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Returns 401 if the User is Not Signed In", async () => {
    // @ts-ignore
    const event: APIGatewayProxyEventV2 = {
      headers: {},
      pathParameters: {
        slug: "stub-crag-slug",
      },
    };

    // @ts-ignore
    const response = await handler(event);

    expect(response).toMatchObject({
      statusCode: 401,
    });
  });

  it("Returns 403 if the User Does Not Manage the Crag", async () => {
    fetchMock.mockImplementationOnce(() => ({
      status: 200,
      json: () => ({
        sub: "not-crag-manager-mock-sub",
      }),
    }));

    // @ts-ignore
    const event: APIGatewayProxyEventV2 = {
      headers: {
        authorization: "stub-auth-token",
      },
      queryStringParameters: {},
      pathParameters: {
        slug: "stub-crag-slug",
      },
    };

    // @ts-ignore
    const response = await handler(event);

    expect(response).toMatchObject({
      statusCode: 403,
    });
  });

  it("Returns a List of Items Awaiting Approval if the User Has Acccess", async () => {
    fetchMock.mockImplementationOnce(() => ({
      status: 200,
      json: () => ({
        sub: "crag-manager-mock-sub",
      }),
    }));

    // @ts-ignore
    const event: APIGatewayProxyEventV2 = {
      headers: {
        authorization: "stub-auth-token",
      },
      queryStringParameters: {},
      pathParameters: {
        slug: "stub-crag-slug",
      },
    };

    // @ts-ignore
    const response = await handler(event);

    expect(response).toMatchObject({
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([
        { model: "route" },
        { model: "area" },
        { model: "topo" },
      ]),
    });
  });
});
