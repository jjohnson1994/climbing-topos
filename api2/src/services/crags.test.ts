import { updateCrag } from "./crags";
import { crags } from '../models'

jest.mock('../models', () => ({
  crags: {
    update: jest.fn()
  }
}))

describe("Crags Service", () => {
  it("Passes update to crags.update", async () => {
    await updateCrag(
      'crag-slug',
      {
        title: "area title",
        description: "area description",
      }
    );

    expect(crags.update).toHaveBeenCalledWith(
      'crag-slug',
      {
        UpdateExpression: 'set #title = :title, #description = :description',
        ExpressionAttributeNames: {
          '#title': 'title',
          '#description': 'description',
        },
        ExpressionAttributeValues: {
          ':title': 'area title',
          ':description': 'area description',
        }
      }
    )
  });
});
