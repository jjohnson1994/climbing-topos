import { defineEventHandler, setResponseHeader } from 'h3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Resource } from 'sst';

const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));

const BASE_URL = 'https://climbingtopos.com';

interface SitemapItem {
  slug?: string;
  cragSlug?: string;
  areaSlug?: string;
  topoSlug?: string;
}

async function queryAllByModel(model: string): Promise<SitemapItem[]> {
  const items: SitemapItem[] = [];
  let lastEvaluatedKey: Record<string, unknown> | undefined;

  do {
    const result = await dynamoDb.send(
      new QueryCommand({
        TableName: Resource.climbingtopos2.name,
        IndexName: 'gsi1',
        KeyConditionExpression: '#model = :model',
        ProjectionExpression: '#slug, #cragSlug, #areaSlug, #topoSlug',
        ExpressionAttributeNames: {
          '#model': 'model',
          '#slug': 'slug',
          '#cragSlug': 'cragSlug',
          '#areaSlug': 'areaSlug',
          '#topoSlug': 'topoSlug',
        },
        ExpressionAttributeValues: { ':model': model },
        ExclusiveStartKey: lastEvaluatedKey,
      }),
    );
    items.push(...((result.Items ?? []) as SitemapItem[]));
    lastEvaluatedKey = result.LastEvaluatedKey as
      | Record<string, unknown>
      | undefined;
  } while (lastEvaluatedKey);

  return items;
}

function buildXml(urls: string[]): string {
  const urlEntries = urls
    .map((url) => `  <url><loc>${url}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=3600');

  const [crags, routes] = await Promise.all([
    queryAllByModel('crag'),
    queryAllByModel('route'),
  ]);

  const urls: string[] = [BASE_URL];

  for (const crag of crags) {
    if (crag.slug) {
      urls.push(`${BASE_URL}/crags/${crag.slug}`);
    }
  }

  const seenAreas = new Set<string>();
  for (const route of routes) {
    if (route.cragSlug && route.areaSlug) {
      const areaKey = `${route.cragSlug}/${route.areaSlug}`;
      if (!seenAreas.has(areaKey)) {
        seenAreas.add(areaKey);
        urls.push(
          `${BASE_URL}/crags/${route.cragSlug}/areas/${route.areaSlug}`,
        );
      }
    }
    if (route.cragSlug && route.areaSlug && route.topoSlug && route.slug) {
      urls.push(
        `${BASE_URL}/crags/${route.cragSlug}/areas/${route.areaSlug}/topos/${route.topoSlug}/routes/${route.slug}/`,
      );
    }
  }

  return buildXml(urls);
});
