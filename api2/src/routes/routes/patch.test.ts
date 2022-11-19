import { crags, routes } from "../../services";
import { handler } from "./patch";
import { getUserSubFromAuthHeader } from "../../utils/auth";

jest.mock("../../utils/auth", () => ({
  getUserSubFromAuthHeader: jest.fn(() => "crag-maintainers-user-sub"),
}));

jest.mock("../../services", () => ({
  routes: {
    updateRoute: jest.fn(),
    getRouteBySlug: jest.fn(() =>
      Promise.resolve({
        slug: "route-slug",
        cragSlug: "crag-slug",
        areaSlug: "area-slug",
        topoSlug: "topo-slug",
      })
    ),
  },
  crags: {
    updateCrag: jest.fn(),
    getCragBySlug: jest.fn(() =>
      Promise.resolve({
        slug: "crag-slug",
        managedBy: {
          sub: "crag-maintainers-user-sub",
        },
      })
    ),
  },
}));

describe("Routes PATCH", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Passes update to routes.updateRoute", async () => {
    const request = {
      title: "example route title",
      description: "example route description",
    };

    // @ts-ignore expected 3 arguments, but got 1
    await handler({
      headers: {
        authorization: "bearer token.token",
      },
      pathParameters: {
        routeSlug: "route-slug",
      },
      body: JSON.stringify(request),
    });

    expect(routes.updateRoute).toHaveBeenCalledWith(
      "crag-slug",
      "area-slug",
      "topo-slug",
      "route-slug",
      request
    );
  });

  it("PATCH schema does not accept additional fields", async () => {
    const request = {
      title: "example route title",
      additionalField: "example additional field",
    };

    // @ts-ignore expected 3 arguments, but got 1
    const response = await handler({
      headers: {
        authorization: "bearer token.token",
      },
      pathParameters: {
        routeSlug: "route-slug",
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
    expect(routes.updateRoute).not.toHaveBeenCalled();
  });

  it("Retuns an error if the user does not have permssions to update the route", async () => {
    (getUserSubFromAuthHeader as jest.Mock).mockImplementationOnce(
      jest.fn(() => "not-crag-maintainers-user-sub")
    );

    const request = {
      title: "example area title",
      description: "example area description",
    };

    // @ts-ignore expected 3 arguments, but got 1
    const response = await handler({
      headers: {
        authorization: "bearer token.token",
      },
      pathParameters: {
        routeSlug: "route-slug",
      },
      body: JSON.stringify(request),
    });

    expect(response).toStrictEqual({
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message:
          "Permission Error: You Do Not Have Permission to Patch this Route",
      }),
    });
    expect(crags.updateCrag).not.toHaveBeenCalled();
  });
});
