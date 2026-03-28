import next from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
    {
        ignores: ['.next', 'node_modules', '.git', 'dist', 'build', 'out'],
    },
    ...next,
];

export default eslintConfig;
