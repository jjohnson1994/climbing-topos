import { handler } from './post';

describe('Crags.post', () => {
  it('Does not accept an invalid request', async () => {
    const event = {
      body: `{}`
    };
    
    // @ts-ignore
    const response = await handler(event)

    expect(response).toMatchObject({
      body: '{"error":true}',
      statusCode: 400
    })
  });
});
