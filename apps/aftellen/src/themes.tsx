import type { ReactNode } from 'react';
import type { Countdown, ThemeId } from './countdown';

interface Look {
  label: string;
  emoji: string;
  sky: [string, string];
  scene: ReactNode;
}

const stars = (n: number, seed: number) =>
  Array.from({ length: n }, (_, i) => {
    const x = (i * 97 + seed * 31) % 400;
    const y = (i * 53 + seed * 17) % 380;
    return <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 2.2 : 1.2} fill="#fff" opacity={0.5 + (i % 4) * 0.12} />;
  });

export const LOOKS: Record<ThemeId | 'nacht', Look> = {
  zee: {
    label: 'Zee',
    emoji: '🏖️',
    sky: ['#3fb6e8', '#ffd59e'],
    scene: (
      <>
        <circle cx="310" cy="190" r="56" fill="#fff4b8" />
        <circle cx="310" cy="190" r="80" fill="#fff4b8" opacity="0.25" />
        <path d="M250 520 l30 -90 l30 90 z" fill="#fff" />
        <path d="M240 528 h80 l-12 18 h-56 z" fill="#ef5b5b" />
        <path d="M0 540 q50 -25 100 0 t100 0 t100 0 t100 0 V800 H0z" fill="#1e88c8" />
        <path d="M0 590 q50 -25 100 0 t100 0 t100 0 t100 0 V800 H0z" fill="#1673b0" />
        <path d="M0 690 q120 -50 260 -10 t140 0 V800 H0z" fill="#f6d79b" />
      </>
    ),
  },
  bergen: {
    label: 'Bergen',
    emoji: '🏔️',
    sky: ['#7cc4f2', '#e3f3ff'],
    scene: (
      <>
        <path d="M-40 640 L110 360 L260 640z" fill="#8aa3c9" />
        <path d="M110 360 l-42 78 l22 -10 l20 18 l20 -18 l22 10z" fill="#fff" />
        <path d="M120 680 L300 300 L480 680z" fill="#6d86b3" />
        <path d="M300 300 l-50 105 l26 -14 l24 22 l24 -22 l26 14z" fill="#fff" />
        <path d="M0 660 q100 -60 200 -20 t200 -10 V800 H0z" fill="#5bae6a" />
        <path d="M0 730 q140 -40 260 -10 t140 0 V800 H0z" fill="#3e8f50" />
      </>
    ),
  },
  sinterklaas: {
    label: 'Sinterklaas',
    emoji: '🎁',
    sky: ['#3b1d5e', '#b7324a'],
    scene: (
      <>
        {stars(28, 1)}
        <circle cx="300" cy="150" r="42" fill="#ffe9a8" />
        <path d="M0 560 h70 v-60 l40 -40 l40 40 v60 h40 v-90 l50 -50 l50 50 v90 h50 v-40 l35 -35 l35 35 V800 H0z" fill="#22113a" />
        <rect x="235" y="400" width="22" height="40" fill="#22113a" />
        <rect x="92" y="520" width="18" height="22" rx="3" fill="#ffd36b" />
        <rect x="230" y="500" width="18" height="22" rx="3" fill="#ffd36b" />
        <rect x="262" y="500" width="18" height="22" rx="3" fill="#ffd36b" />
      </>
    ),
  },
  kerstmis: {
    label: 'Kerstmis',
    emoji: '🎄',
    sky: ['#0f3b4f', '#2c7a6b'],
    scene: (
      <>
        {stars(36, 2)}
        {[60, 180, 320].map((x, i) => (
          <g key={x} transform={`translate(${x} ${560 - i * 20})`}>
            <path d="M0 -150 L55 0 H-55z" fill="#155e3b" />
            <path d="M0 -150 L30 -70 H-30z" fill="#1b7a4c" />
            <rect x="-9" y="0" width="18" height="24" fill="#5b3a22" />
          </g>
        ))}
        <path d="M0 620 q100 -40 200 -10 t200 -10 V800 H0z" fill="#f4fbff" />
      </>
    ),
  },
  verjaardag: {
    label: 'Verjaardag',
    emoji: '🎂',
    sky: ['#ff8fb8', '#ffd27a'],
    scene: (
      <>
        {[
          [70, 380, '#ff4f79'],
          [150, 300, '#5b8cff'],
          [250, 360, '#3ec98e'],
          [330, 280, '#ffb020'],
        ].map(([x, y, c]) => (
          <g key={String(x)}>
            <path d={`M${x} ${Number(y) + 60} q-12 60 6 140`} stroke="#fff" strokeWidth="2" fill="none" />
            <ellipse cx={x} cy={y} rx="38" ry="48" fill={String(c)} />
            <ellipse cx={Number(x) - 12} cy={Number(y) - 16} rx="8" ry="13" fill="#fff" opacity="0.45" />
          </g>
        ))}
        <path d="M0 720 q200 -50 400 0 V800 H0z" fill="#fff3e0" />
      </>
    ),
  },
  pasen: {
    label: 'Pasen',
    emoji: '🐣',
    sky: ['#b8e6ff', '#fff6c9'],
    scene: (
      <>
        <circle cx="90" cy="160" r="46" fill="#fff6a8" />
        <path d="M0 620 q120 -80 240 -30 t160 -20 V800 H0z" fill="#9ed67a" />
        <path d="M0 690 q160 -50 280 -10 t120 0 V800 H0z" fill="#7cc35a" />
        {[
          [80, 690, '#ff9ecb'],
          [200, 668, '#9ec5ff'],
          [320, 690, '#ffd56b'],
        ].map(([x, y, c]) => (
          <ellipse key={String(x)} cx={x} cy={y} rx="22" ry="29" fill={String(c)} />
        ))}
      </>
    ),
  },
  kamp: {
    label: 'Kamp',
    emoji: '⛺',
    sky: ['#14213d', '#3d4f8a'],
    scene: (
      <>
        {stars(40, 3)}
        <path d="M0 640 q200 -40 400 0 V800 H0z" fill="#26482f" />
        <path d="M70 650 L170 480 L270 650z" fill="#f28b30" />
        <path d="M170 480 L145 650 h50z" fill="#9a4f12" />
        <path d="M310 650 q-14 -30 4 -60 q2 26 16 34 q4 -16 0 -30 q24 26 6 56z" fill="#ffc23d" />
        <rect x="292" y="648" width="46" height="8" rx="4" fill="#6b4226" />
      </>
    ),
  },
  logeren: {
    label: 'Logeren',
    emoji: '🧸',
    sky: ['#26306b', '#8b6bc9'],
    scene: (
      <>
        {stars(30, 4)}
        <path d="M95 640 v-150 l105 -90 l105 90 v150z" fill="#f4e3c3" />
        <path d="M75 500 l125 -110 l125 110" stroke="#c0504d" strokeWidth="22" fill="none" strokeLinejoin="round" />
        <rect x="125" y="520" width="44" height="44" rx="6" fill="#ffd36b" />
        <rect x="231" y="520" width="44" height="44" rx="6" fill="#ffd36b" />
        <rect x="180" y="580" width="40" height="60" rx="8" fill="#8c5a3c" />
        <path d="M0 640 q200 -30 400 0 V800 H0z" fill="#3d5a8c" />
      </>
    ),
  },
  nacht: {
    label: 'Sterrenhemel',
    emoji: '✨',
    sky: ['#0e1440', '#4b3a8f'],
    scene: (
      <>
        {stars(50, 5)}
        <path d="M0 680 q120 -40 240 -10 t160 -10 V800 H0z" fill="#241c5c" />
      </>
    ),
  },
};

export const lookOf = (c: Pick<Countdown, 'theme' | 'emoji'>) => {
  const look = LOOKS[c.theme ?? 'nacht'];
  return { ...look, emoji: c.theme ? look.emoji : (c.emoji ?? look.emoji) };
};

export const Scene = ({ c }: { c: Pick<Countdown, 'theme' | 'emoji'> }) => {
  const { sky, scene } = lookOf(c);
  return (
    <div className="scene" style={{ background: `linear-gradient(180deg, ${sky[0]}, ${sky[1]})` }} aria-hidden>
      <svg viewBox="0 0 400 800" preserveAspectRatio="xMidYMax slice">
        {scene}
      </svg>
    </div>
  );
};
