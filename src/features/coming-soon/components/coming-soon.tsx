import Link from 'next/link';

import { SITE } from '@/core/config/site';
import { Button } from '@/ui';

const { title, body, previewCta } = SITE.comingSoon;

export function ComingSoon() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-1 flex-col px-6 tablet:px-margin">
      <section className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center desktop:py-hero">
        <h1 className="max-w-4xl animate-enter font-display text-headline-md text-balance text-fg-strong motion-reduce:animate-none tablet:text-display-lg desktop:text-display-xl">
          {title}
        </h1>
        <p className="max-w-md animate-enter text-body-md text-pretty text-fg-muted [animation-delay:120ms] motion-reduce:animate-none">
          {body}
        </p>
        {/* Temporary: remove together with the dashboard-preview feature. */}
        <Button
          asChild
          variant="primary"
          className="mt-2 animate-enter [animation-delay:240ms] motion-reduce:animate-none"
        >
          <Link href="/preview">{previewCta}</Link>
        </Button>
      </section>
      <footer className="py-8 text-center text-caption text-fg-muted">© {SITE.name}</footer>
    </main>
  );
}
