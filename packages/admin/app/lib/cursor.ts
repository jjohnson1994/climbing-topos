export function parseCursor(cursor: string | undefined): { hk: string; sk: string } | undefined {
  if (!cursor) return undefined;
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64').toString('utf-8'));
    if (
      parsed !== null &&
      typeof parsed === 'object' &&
      typeof parsed.hk === 'string' &&
      typeof parsed.sk === 'string'
    ) {
      return { hk: parsed.hk, sk: parsed.sk };
    }
  } catch {}
  return undefined;
}
