import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 뷰티 브랜드 컬러 (예시)
        beauty: {
          pink: '#FF6B9D',
          coral: '#FF8A80',
          lavender: '#B388FF',
          mint: '#64FFDA',
        },
      },
    },
  },
  plugins: [],
  // Mantine과 충돌 방지
//   corePlugins: {
//     preflight: false,
//   },
};

export default config;