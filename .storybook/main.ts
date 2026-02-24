import type { StorybookConfig } from '@storybook/react-webpack5';

const config: StorybookConfig = {
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-webpack5-compiler-swc",
    "@storybook/addon-essentials",
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-interactions",
    "storybook-addon-pseudo-states",
  ],
  framework: {
    name: "@storybook/react-webpack5",
    options: {}
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    // 1) Exclude .module.css from the default CSS rule so our rule handles it
    const rules = config.module?.rules ?? [];
    const cssRuleIndex = rules.findIndex(
      (r) => typeof r === 'object' && r !== null && 'test' in r && (r as { test: RegExp }).test?.toString() === '/\\.css$/'
    );
    if (cssRuleIndex !== -1) {
      const cssRule = rules[cssRuleIndex] as { exclude?: RegExp | ((path: string) => boolean); [k: string]: unknown };
      const excludeModuleCss = /\.module\.css$/;
      cssRule.exclude = Array.isArray(cssRule.exclude)
        ? [excludeModuleCss, ...cssRule.exclude]
        : cssRule.exclude
          ? [excludeModuleCss, cssRule.exclude as RegExp]
          : excludeModuleCss;
    }

    // 2) Dedicated rule for .module.css with semantic class names: [name]__[local]___[hash]
    config.module?.rules?.unshift({
      test: /\.module\.css$/,
      sideEffects: true,
      use: [
        require.resolve('style-loader'),
        {
          loader: require.resolve('css-loader'),
          options: {
            importLoaders: 1,
            modules: {
              localIdentName: '[local]_[hash:base64:5]',
            },
          },
        },
        require.resolve('postcss-loader'),
      ],
    });

    return config;
  },
};
export default config;