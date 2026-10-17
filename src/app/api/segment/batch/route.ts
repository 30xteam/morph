import { segmentBatch, segmentBatchRequestSchema } from '@/features/segmentation/server';

export async function POST(request: Request) {
  const parsed = segmentBatchRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  return Response.json({ items: await segmentBatch(parsed.data.profiles, parsed.data.trigger) });
}
