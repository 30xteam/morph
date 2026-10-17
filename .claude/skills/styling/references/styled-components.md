# styled-components

CSS-in-JS with a runtime — style tags are generated during render. It
remains common in existing codebases, but is **reference-only for new code,
not a new-adoption recommendation** (see `styling/SKILL.md` — Choosing an
Approach): the runtime generates styles on every render pass, which adds
real CPU cost to initial paint and interacts poorly with React Server
Components/streaming SSR. Use this reference to work correctly within an
existing styled-components codebase; for a new project, use one of the
zero-runtime references instead.

## Defining a Styled Component

```ts
const Header = styled.header`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
`;
```

## Variants via `css` Prop Interpolation, Not String Concatenation

```ts
import { css } from 'styled-components';

const variantStyles: Record<Variant, ReturnType<typeof css>> = {
  primary: css`background: var(--color-primary); color: white;`,
  secondary: css`background: var(--color-gray-200);`,
};

const Button = styled.button<{ $variant: Variant }>`
  padding: 0.5rem 1rem;
  ${({ $variant }) => variantStyles[$variant]}
`;
```

Prefix a prop used only for styling with `$` (a "transient prop") so
styled-components doesn't forward it to the underlying DOM element as an
invalid HTML attribute.

## Extending an Existing Styled Component

```ts
const PrimaryButton = styled(Button).attrs({ $variant: 'primary' })``;
```

Prefer `styled(Component)` over duplicating a template literal when a
variant is just a fixed prop value on an existing component.

## Hard Rules

- Prefix style-only props with `$` — never pass a styling-only prop through to the DOM unprefixed.
- Resolve variants through a typed lookup object, never string-interpolated conditionals inside the template literal.
- Don't introduce styled-components into a project that isn't already using it — prefer Tailwind, CSS Modules, or vanilla-extract for new code.
