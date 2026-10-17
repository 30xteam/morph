import { evaluateRequestSchema, evaluateSegmentation } from '@/features/segmentation/server';

export async function POST(request: Request) {
  const parsed = evaluateRequestSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    return Response.json(await evaluateSegmentation(parsed.data.mode));
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 502 });
  }
}
