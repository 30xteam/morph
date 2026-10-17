import { simulateDays, simulateRequestSchema } from '@/features/segmentation/server';

export async function POST(request: Request) {
  const parsed = simulateRequestSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return Response.json(
      { error: 'Invalid request', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  try {
    const { days, seed, consensus } = parsed.data;
    return Response.json(await simulateDays(days, seed, consensus));
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 502 });
  }
}
