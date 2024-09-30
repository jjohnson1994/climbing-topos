import { areas } from "@/services";
import { handler } from "./patch";
import { getUserSubFromAuthHeader } from "@/utils/auth";

jest.mock("@/utils/auth", () => ({
  getUserSubFromAuthHeader: jest.fn(() => "user-sub"),
}));

jest.mock("../../services", () => ({
  areas: {
    updateArea: jest.fn(),
    getAreaBySlug: jest.fn(() => ({
      cragSlug: "crag-slug",
    })),
  },
  crags: {
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

describe("Areas PATCH", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Passes update to areas.updateArea", async () => {
    const request = {
      title: "example area title",
      description: "example area description",
    };

    // @ts-ignore expected 3 arguments, but got 1
    await handler({
      headers: {
        authorization: "bearer token.token",
      },
      pathParameters: {
        areaSlug: "area-slug",
      },
      body: JSON.stringify(request),
    });

    expect(areas.updateArea).toHaveBeenCalledWith(
      "crag-slug",
      "area-slug",
      request
    );
  });

  it("PATCH schema does not accept additional fields", async () => {
    const request = {
      title: "example area title",
      additionalField: "example additional field",
    };

    // @ts-ignore expected 3 arguments, but got 1
    const response = await handler({
      headers: {
        authorization: "bearer token.token",
      },
      pathParameters: {
        areaSlug: "area-slug",
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
    expect(areas.updateArea).not.toHaveBeenCalled();
  });

  it("Retuns an error if the user does not have permssions to update the area", async () => {
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
        areaSlug: "area-slug",
      },
      body: JSON.stringify(request),
    });

    expect(response).toStrictEqual({
      statusCode: 403,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: true,
        message:
          "Permission Error: You Do Not Have Permission to Patch this Area",
      }),
    });
    expect(areas.updateArea).not.toHaveBeenCalled();
  });
});
