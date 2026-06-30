// Photographic-style farmland landscape rendered as SVG (reliable, no broken images).
// Used as listing imagery until real photos are added via the admin panel.

type Scene = {
  sky: [string, string];
  sun: string;
  sunX: number;
  sunY: number;
  hillFar: string;
  hillNear: string;
  rows: string[];
  tree: string;
  treeSide: 'left' | 'right';
};

const SCENES: Scene[] = [
  {
    sky: ['#cfe4e6', '#f3f1e3'],
    sun: '#fff4d8',
    sunX: 600,
    sunY: 120,
    hillFar: '#b9cda8',
    hillNear: '#7f9e6a',
    rows: ['#6f9a5b', '#5b8049', '#4b6b43', '#3f5d3a'],
    tree: '#3d5638',
    treeSide: 'right',
  },
  {
    sky: ['#f7e3bd', '#f4d9a6'],
    sun: '#ffe7b0',
    sunX: 210,
    sunY: 150,
    hillFar: '#cdb27a',
    hillNear: '#9c7d44',
    rows: ['#b89a57', '#a3863f', '#8a6a43', '#6f5535'],
    tree: '#5b4626',
    treeSide: 'left',
  },
  {
    sky: ['#e6e7d6', '#d7e0c6'],
    sun: '#f4f1dc',
    sunX: 420,
    sunY: 90,
    hillFar: '#a9c08f',
    hillNear: '#85AB8B',
    rows: ['#7faa64', '#6f9a5b', '#5b8049', '#4b6b43'],
    tree: '#3d5638',
    treeSide: 'right',
  },
  {
    sky: ['#eef0e4', '#dfe6d4'],
    sun: '#f6f4e6',
    sunX: 540,
    sunY: 110,
    hillFar: '#c2d2b4',
    hillNear: '#9bbf95',
    rows: ['#7faa64', '#6f9a5b', '#57804a', '#48693d'],
    tree: '#3d5638',
    treeSide: 'left',
  },
];

type Props = {
  variant: number;
  className?: string;
};

export default function FieldScene({ variant, className }: Props) {
  const s = SCENES[variant % SCENES.length];
  const gid = `sky-${variant % SCENES.length}`;
  const sgid = `sun-${variant % SCENES.length}`;

  // Perspective field rows: bands grow taller toward the bottom.
  const horizon = 205;
  const bottom = 480;
  const bandCount = 7;
  let weight = 1;
  const weights: number[] = [];
  for (let i = 0; i < bandCount; i++) {
    weights.push(weight);
    weight *= 1.32;
  }
  const total = weights.reduce((a, b) => a + b, 0);
  const bands: { y: number; h: number; fill: string }[] = [];
  let y = horizon;
  weights.forEach((w, i) => {
    const h = ((bottom - horizon) * w) / total;
    bands.push({ y, h: h + 0.5, fill: s.rows[i % s.rows.length] });
    y += h;
  });

  const treeX = s.treeSide === 'left' ? 120 : 680;

  return (
    <svg
      className={className}
      viewBox="0 0 800 480"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={s.sky[0]} />
          <stop offset="100%" stopColor={s.sky[1]} />
        </linearGradient>
        <radialGradient id={sgid} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={s.sun} stopOpacity="0.95" />
          <stop offset="60%" stopColor={s.sun} stopOpacity="0.35" />
          <stop offset="100%" stopColor={s.sun} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sky */}
      <rect width="800" height={horizon + 30} fill={`url(#${gid})`} />
      {/* Sun haze */}
      <circle cx={s.sunX} cy={s.sunY} r="150" fill={`url(#${sgid})`} />
      <circle cx={s.sunX} cy={s.sunY} r="34" fill={s.sun} opacity="0.9" />

      {/* Far hills */}
      <path
        d={`M0 ${horizon} Q200 ${horizon - 55} 420 ${horizon - 20} T800 ${
          horizon - 35
        } V${horizon + 40} H0 Z`}
        fill={s.hillFar}
      />
      {/* Near hills */}
      <path
        d={`M0 ${horizon + 8} Q260 ${horizon - 30} 540 ${horizon + 6} T800 ${
          horizon - 6
        } V${horizon + 50} H0 Z`}
        fill={s.hillNear}
      />

      {/* Field rows (perspective) */}
      {bands.map((b, i) => (
        <rect key={i} x="0" y={b.y} width="800" height={b.h} fill={b.fill} />
      ))}
      {/* Subtle furrow lines converging */}
      <g stroke="#1f2a1d" strokeOpacity="0.08" strokeWidth="2">
        <line x1="380" y1={horizon} x2="120" y2={bottom} />
        <line x1="410" y1={horizon} x2="400" y2={bottom} />
        <line x1="440" y1={horizon} x2="700" y2={bottom} />
      </g>

      {/* Tree */}
      <g>
        <rect x={treeX - 6} y={horizon + 2} width="12" height="60" rx="4" fill={s.tree} opacity="0.85" />
        <ellipse cx={treeX} cy={horizon - 8} rx="46" ry="40" fill={s.tree} />
        <ellipse cx={treeX - 26} cy={horizon + 6} rx="30" ry="26" fill={s.tree} opacity="0.92" />
        <ellipse cx={treeX + 26} cy={horizon + 6} rx="30" ry="26" fill={s.tree} opacity="0.92" />
      </g>

      {/* Soft bottom scrim for text contrast */}
      <rect x="0" y="320" width="800" height="160" fill="#1f2a1d" opacity="0.12" />
    </svg>
  );
}
