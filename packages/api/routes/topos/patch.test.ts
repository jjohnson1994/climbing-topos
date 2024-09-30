import { topos } from "../../services";
import { handler } from "./patch";
import { getUserSubFromAuthHeader } from "../../utils/auth";

jest.mock("../../utils/auth", () => ({
  getUserSubFromAuthHeader: jest.fn(() =>  "user-sub"),
}));

jest.mock("../../services", () => ({
  topos: {
    updateTopo: jest.fn(),
    getTopoBySlug: jest.fn(() =>
      Promise.resolve({
        slug: "topo-slug",
        cragSlug: "crag-slug",
        areaSlug: "area-slug",
      })
    ),
  },
  crags: {
    updateCrag: jest.fn(),
    getCragBySlug: jest.fn(() =>
      Promise.resolve({
        slug: "crag-slug",
        managedBy: {
          sub: "user-sub",
        },
      })
    ),
  },
}));

describe("Topos PATCH", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Passes update to topos.updateTopo", async () => {
    const request = {
      orientation: "example orientation",
    };

    // @ts-ignore expected 3 arguments, but got 1
    await handler({
      headers: {
        authorization: 'bearer token.token',
      },
      pathParameters: {
        topoSlug: "topo-slug",
      },
      body: JSON.stringify(request),
    });

    expect(topos.updateTopo).toHaveBeenCalledWith(
      "crag-slug",
      "area-slug",
      "topo-slug",
      request
    );
  });

  it("PATCH schema does not accept additional fields", async () => {
    const request = {
      orientation: "example orientation",
      additionalField: "example additional field",
    };

    // @ts-ignore expected 3 arguments, but got 1
    const response = await handler({
      headers: {
        authorization: 'bearer token.token',
      },
      pathParameters: {
        topoSlug: "topo-slug",
      },
      body: JSON.stringify(request),
    });

    expect(response).toStrictEqual({
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message: "Invalid Request: Body Does Not Match Schema",
      }),
    });
    expect(topos.updateTopo).not.toHaveBeenCalled();
  });

  it("Retuns an error if the user does not have permssions to update the topo", async () => {
    (getUserSubFromAuthHeader as jest.Mock).mockImplementationOnce(
      jest.fn(() => "not-crag-maintainers-user-sub")
    );

    const request = {
      orientation: "example orientation",
    };

    // @ts-ignore expected 3 arguments, but got 1
    const response = await handler({
      headers: {
        authorization: 'bearer token.token',
      },
      pathParameters: {
        topoSlug: "topo-slug",
      },
      body: JSON.stringify(request),
    });

    expect(response).toStrictEqual({
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message:
          "Permission Error: You Do Not Have Permission to Patch this Topo",
      }),
    });
    expect(topos.updateTopo).not.toHaveBeenCalled();
  });
});
