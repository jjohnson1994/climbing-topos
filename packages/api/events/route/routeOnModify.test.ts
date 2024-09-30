import { analytics, areas, crags } from "@/services";
import { handler } from "./routeOnModify";
import algolaIndex from "@/db/algolia";

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
    ['crags.incrementRouteCount', crags.incrementRouteCount]
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

  it("Calls algoliaIndex.saveObject aslong as the route is verified", async () => {
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

    expect(algolaIndex.saveObject).toHaveBeenCalled();
  });

  it("Saves normalised grade to Algolia", async () => {
    // @ts-ignore
    await handler({
      Records: [
        {
          Sns: {
            Message: JSON.stringify({
              dynamodb: {
                NewImage: {
                  verified: true,
                  gradingSystem: 'Font',
                  grade: '6'
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

    expect(algolaIndex.saveObject).toHaveBeenCalledWith(
      expect.objectContaining({
        grade: '6B'
      })
    )
  });

  it("Throws is task fails", () => {
    (analytics.incrementGlobalRouteCount as jest.Mock).mockImplementationOnce(
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
                    verified: true
                  },
                  OldImage: {
                    verified: false,
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
