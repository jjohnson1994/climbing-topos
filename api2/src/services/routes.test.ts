import { updateRoute } from "./routes";
import { routes } from '../models'

jest.mock('../models', () => ({
  routes: {
    update: jest.fn()
  }
}))

describe("Crags Service", () => {
  it("Passes update to routes.update", async () => {
    await updateRoute(
      'crag-slug',
      'area-slug',
      'topo-slug',
      'route-slug',
      {
        title: "route title",
        description: "route description",
      }
    );

    expect(routes.update).toHaveBeenCalledWith(
      'crag-slug',
      'area-slug',
      'topo-slug',
      'route-slug',
      {
        UpdateExpression: 'set #title = :title, #description = :description',
        ExpressionAttributeNames: {
          '#title': 'title',
          '#description': 'description',
        },
        ExpressionAttributeValues: {
          ':title': 'route title',
          ':description': 'route description',
        }
      }
    )
  });
});
