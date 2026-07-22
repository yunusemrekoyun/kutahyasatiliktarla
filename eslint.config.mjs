import coreWebVitals from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

const config = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**', // sw.js — service worker globalleri, app kodu değil
      'reference/**',
      'uploads/**',
      'prisma/migrations/**',
      // Editör/ajan araç script'leri — uygulama kodu değil
      '.agents/**',
      '.claude/**',
      '.codex/**',
      '.impeccable/**',
    ],
  },
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      // Projede bilinçli atılan değerler _ önekiyle işaretleniyor (örn. _unused)
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      // React'in yeni danışma kuralı; mount-sync desenlerinde (scroll konumu,
      // IntersectionObserver ilk değeri) yanlış pozitif veriyor — uyarı olarak kalsın.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default config;
