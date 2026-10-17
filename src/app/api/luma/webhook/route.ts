import {
  lumaRegistrationSchema,
  profileFromLuma,
  segmentProfile,
} from '@/features/segmentation/server';

export async function POST(request: Request) {
  const parsed = lumaRegistrationSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid payload', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const profile = profileFromLuma(parsed.data);
    const outcome = await segmentProfile(profile, 'sign_up');
    return Response.json({ profile, outcome });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 502 });
  }
}
