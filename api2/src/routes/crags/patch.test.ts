import { crags } from "../../services";
import { handler } from "./patch";
import { getAuth0UserPublicDataFromEvent } from "../../utils/auth";

jest.mock("../../utils/auth", () => ({
  getAuth0UserPublicDataFromEvent: jest.fn(() => ({
    sub: "user-sub",
    nickname: "",
    picture: "",
  })),
}));

jest.mock("../../services", () => ({
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

describe("Crags PATCH", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Passes update to crags.updateCrag", async () => {
    const request = {
      title: "example area title",
      description: "example area description",
    };

    // @ts-ignore expected 3 arguments, but got 1
    await handler({
      pathParameters: {
        cragSlug: "crag-slug",
      },
      body: JSON.stringify(request),
    });

    expect(crags.updateCrag).toHaveBeenCalledWith(
      "crag-slug",
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
    expect(crags.updateCrag).not.toHaveBeenCalled();
  });

  it("Retuns an error if the user does not have permssions to update the crag", async () => {
    (getAuth0UserPublicDataFromEvent as jest.Mock).mockImplementationOnce(
      jest.fn(() => ({
        sub: "not-crag-maintainers-user-sub",
      }))
    );

    const request = {
      title: "example area title",
      description: "example area description",
    };

    // @ts-ignore expected 3 arguments, but got 1
    const response = await handler({
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
          "Permission Error: You Do Not Have Permission to Patch this Crag",
      }),
    });
    expect(crags.updateCrag).not.toHaveBeenCalled();
  });
});
