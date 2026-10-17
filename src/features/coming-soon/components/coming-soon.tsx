import { SITE } from '@/core/config/site';

const { eyebrow, title, body } = SITE.comingSoon;

export function ComingSoon() {
  return (
    <main className="mx-auto flex w-full max-w-page flex-1 flex-col px-6 tablet:px-margin">
      <section className="flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center desktop:py-hero">
        <p className="inline-flex animate-enter items-center gap-2 rounded-full bg-surface-accent px-3 py-1 text-label-sm text-on-secondary motion-reduce:animate-none">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-primary" />
          {eyebrow}
        </p>
        <h1 className="max-w-4xl animate-enter font-display text-headline-md text-balance text-fg-strong [animation-delay:80ms] motion-reduce:animate-none tablet:text-headline-lg desktop:text-display-lg wide:text-display-xl">
          {title}
        </h1>
        <p className="max-w-md animate-enter text-body-md text-pretty text-fg-muted [animation-delay:160ms] motion-reduce:animate-none">
          {body}
        </p>
      </section>
      <footer className="py-8 text-center text-caption text-fg-muted">© {SITE.name}</footer>
    </main>
  );
}
