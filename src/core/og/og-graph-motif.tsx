import type { OgColors } from './design-tokens';

const GOLDEN_ANGLE = 2.399963229728653;
const PROGRAMS = [
  { x: 250, y: 150 },
  { x: 120, y: 330 },
  { x: 360, y: 400 },
];
const PROFILE_TONES = ['ink-muted', 'ink-muted', 'green-fg', 'yellow-fg', 'red-fg'] as const;

function nearestProgram(x: number, y: number) {
  return PROGRAMS.reduce((best, program) =>
    Math.hypot(program.x - x, program.y - y) < Math.hypot(best.x - x, best.y - y) ? program : best,
  );
}

const profiles = Array.from({ length: 34 }, (_, index) => {
  const angle = index * GOLDEN_ANGLE;
  const radius = 60 + Math.sqrt(index) * 34;
  const x = 250 + Math.cos(angle) * radius;
  const y = 280 + Math.sin(angle) * radius * 0.85;
  return {
    x,
    y,
    tone: PROFILE_TONES[index % PROFILE_TONES.length]!,
    program: nearestProgram(x, y),
  };
});

export function OgGraphMotif({ colors }: { colors: OgColors }) {
  return (
    <svg width={500} height={560} viewBox="0 0 500 560">
      {profiles.map((profile, index) => (
        <line
          key={`edge-${profile.x}-${profile.y}`}
          x1={profile.x}
          y1={profile.y}
          x2={profile.program.x}
          y2={profile.program.y}
          stroke={index % 4 === 0 ? colors.accent : colors.line}
          strokeOpacity={index % 4 === 0 ? 0.55 : 1}
          strokeWidth={1.5}
        />
      ))}
      {profiles.map((profile, index) => (
        <circle
          key={`profile-${profile.x}-${profile.y}`}
          cx={profile.x}
          cy={profile.y}
          r={index % 5 === 2 ? 7 : 5}
          fill={colors[profile.tone]}
        />
      ))}
      {PROGRAMS.map((program) => (
        <circle
          key={`program-${program.x}-${program.y}`}
          cx={program.x}
          cy={program.y}
          r={13}
          fill={colors.accent}
        />
      ))}
    </svg>
  );
}
