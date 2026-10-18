import { segmentRequestSchema } from '@/features/segmentation/server';
import { segmentProfile } from '@/libs/segmentation/server';

export async function POST(request: Request) {
  const parsed = segmentRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    return Response.json(await segmentProfile(parsed.data.profile, parsed.data.trigger));
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 502 });
  }
}
