export async function mapWithLimit<T, R>(
  items: readonly T[],
  limit: number,
  task: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  const results = Array.from<R>({ length: items.length });
  let next = 0;

  const worker = async () => {
    for (let index = next++; index < items.length; index = next++) {
      // oxlint-disable-next-line no-await-in-loop -- each worker drains the shared queue in order
      results[index] = await task(items[index] as T, index);
    }
  };

  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}
