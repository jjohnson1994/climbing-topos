import { updateArea } from "./areas";
import { areas } from '../models'

jest.mock('../models', () => ({
  areas: {
    update: jest.fn()
  }
}))

describe("Areas Service", () => {
  it("Passes Update to area.update", async () => {
    await updateArea(
      'crag-slug',
      'area-slug',
      {
        title: "area title",
        description: "area description",
      }
    );

    expect(areas.update).toHaveBeenCalledWith(
      'crag-slug',
      'area-slug',
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
