import { analytics, areas, crags } from "../../services";
import { handler } from "./routeOnModify";
import algolaIndex from "../../db/algolia";

jest.mock("../../db/algolia");

jest.mock("../../db/dynamodb", () => ({
  normalizeRow: (row: Record<string, string | boolean | number>) => row,
}));

jest.mock("../../services", () => ({
  analytics: {
    incrementGlobalRouteCount: jest.fn(),
  },
  areas: {
    incrementRouteCount: jest.fn(),
  },
  crags: {
    incrementRouteCount: jest.fn(),
  },
}));

describe("routeOnModify", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each([
    ['incrementGlobalRouteCount', analytics.incrementGlobalRouteCount],
    ['area.incrementRouteCount', areas.incrementRouteCount],
    ['crags.incrementRouteCount', crags.incrementRouteCount],
  ])(
    "Calls %s when a route become verified",
    async (_title, func) => {
      // @ts-ignore
      await handler({
        Records: [
          {
            Sns: {
              Message: JSON.stringify({
                dynamodb: {
                  NewImage: {
                    verified: true,
                  },
                  OldImage: {
                    verified: false,
                  },
                },
              }),
            },
          },
        ],
      });

      expect(func).toHaveBeenCalled();
    },
  )

  it("Does not call incrementGlobalRouteCount if a route is not verified", async () => {
    // @ts-ignore
    await handler({
      Records: [
        {
          Sns: {
            Message: JSON.stringify({
              dynamodb: {
                NewImage: {
                  verified: false,
                },
                OldImage: {
                  verified: false,
                },
              },
            }),
          },
        },
      ],
    });

    expect(analytics.incrementGlobalRouteCount).not.toHaveBeenCalled();
  });

  it("Does not call incrementGlobalRouteCount if a route is already verified", async () => {
    // @ts-ignore
    await handler({
      Records: [
        {
          Sns: {
            Message: JSON.stringify({
              dynamodb: {
                NewImage: {
                  verified: true,
                },
                OldImage: {
                  verified: true,
                },
              },
            }),
          },
        },
      ],
    });

    expect(analytics.incrementGlobalRouteCount).not.toHaveBeenCalled();
  });

  it("Calls algolia.saveObject", async () => {
    // @ts-ignore
    await handler({
      Records: [
        {
          Sns: {
            Message: JSON.stringify({
              dynamodb: {
                NewImage: {
                  slug: "a-new-route",
                  title: "a new route",
                },
              },
            }),
          },
        },
      ],
    });

    expect(algolaIndex.saveObject).toHaveBeenCalledWith({
      slug: "a-new-route",
      title: "a new route",
      model: "route",
      objectID: "a-new-route",
    });
  });

  it("Throws is task fails", () => {
    (algolaIndex.saveObject as jest.Mock).mockImplementationOnce(
      () => {
        throw new Error("An Error");
      }
    );

    return expect(
      // @ts-ignore
      handler({
        Records: [
          {
            Sns: {
              Message: JSON.stringify({
                dynamodb: {
                  NewImage: {
                    slug: "a-new-route",
                    title: "a new route",
                  },
                },
              }),
            },
          },
        ],
      })
    ).rejects.toThrowError();
  });
});
