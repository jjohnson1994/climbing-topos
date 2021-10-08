import { updateTopo } from "./topos";
import { topos } from '../models'

jest.mock('../models', () => ({
  topos: {
    update: jest.fn()
  }
}))

describe("Topos Service", () => {
  it("Passes update to topos.update", async () => {
    await updateTopo(
      'crag-slug',
      'area-slug',
      'topo-slug',
      {
        orientation: "north"
      }
    );

    expect(topos.update).toHaveBeenCalledWith(
      'crag-slug',
      'area-slug',
      'topo-slug',
      {
        UpdateExpression: 'set #orientation = :orientation',
        ExpressionAttributeNames: {
          '#orientation': 'orientation'
        },
        ExpressionAttributeValues: {
          ':orientation': 'north'
        }
      }
    )
  });
});
