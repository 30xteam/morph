import { recalculateProfile, recalculateRequestSchema } from '@/features/segmentation/server';

export async function POST(request: Request) {
  const parsed = recalculateRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    return Response.json(await recalculateProfile(parsed.data.profile, parsed.data.previous));
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 502 });
  }
}
