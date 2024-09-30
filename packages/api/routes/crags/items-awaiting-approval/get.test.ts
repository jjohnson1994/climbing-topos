import fetch from "node-fetch";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { handler } from "./get";
import { Crag } from "../../../../../core/types";
import { getUserSubFromAuthHeader } from "../../../utils/auth";

jest.mock("node-fetch");
jest.mock("../../../services", () => ({
  crags: {
    getCragBySlug: (): Pick<Crag, "managedBy"> => ({
      managedBy: {
        nickname: '',
        picture: '',
        sub: "crag-manager-mock-sub",
      },
    }),
    getCragItemsAwaitingAproval: () => [
      { model: "route" },
      { model: "area" },
      { model: "topo" },
    ],
  },
}));
jest.mock("../../../utils/auth", () => ({
  getUserSubFromAuthHeader: jest.fn(),
}));

const fetchMock = fetch as unknown as jest.Mock;
const getUserSubFromAuthHeaderMock =
  getUserSubFromAuthHeader as unknown as jest.Mock;

describe("Get Crag Items Awaiting Approval", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("Returns 401 if the User is Not Signed In", async () => {
    // @ts-ignore
    const event: APIGatewayProxyEventV2 = {
      headers: {
        authorization: "bearer token.token",
      },
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
    getUserSubFromAuthHeaderMock.mockImplementationOnce(
      () => "not-crag-manager-mock-sub"
    );

    // @ts-ignore
    const event: APIGatewayProxyEventV2 = {
      headers: {
        authorization: "bearer token.token",
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
    getUserSubFromAuthHeaderMock.mockImplementationOnce(
      () => "crag-manager-mock-sub"
    );

    // @ts-ignore
    const event: APIGatewayProxyEventV2 = {
      headers: {
        authorization: "bearer token.token",
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
