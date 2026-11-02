import path from "path"
import type { StorybookConfig } from '@storybook/react-webpack5';
import type { Compiler, EntryObject } from "webpack"

/**
 * A failed hot update calls `location.reload()`. The preview then reconnects,
 * misses the update again, and every story stays on the preparing spinner.
 * Keep module updates, but leave a full reload to a manual refresh.
 */
function withoutHotFullReload(entry: Compiler["options"]["entry"]): Compiler["options"]["entry"] {
  const rewrite = (value: string) =>
    value.includes("webpack-hot-middleware/client")
      ? value.replace("reload=true", "reload=false")
      : value

  if (typeof entry === "string") return rewrite(entry)
  if (Array.isArray(entry)) {
    return entry.map((item) => (typeof item === "string" ? rewrite(item) : item))
  }
  if (entry && typeof entry === "object") {
    const rewritten: EntryObject = {}
    for (const [name, value] of Object.entries(entry)) {
      if (typeof value === "string") rewritten[name] = rewrite(value)
      else if (Array.isArray(value)) {
        rewritten[name] = value.map((item) => (typeof item === "string" ? rewrite(item) : item))
      } else if (value && typeof value === "object" && Array.isArray(value.import)) {
        rewritten[name] = {
          ...value,
          import: value.import.map((item) => rewrite(item)),
        }
      } else {
        rewritten[name] = value
      }
    }
    return rewritten
  }
  return entry
}

/**
 * The dev server authenticates the preview channel with the token baked into
 * the manager page. A later preview compile can emit `iframe.html` with a
 * different token, and the server then rejects every story connection.
 * When the preview is framed by the manager, use the manager token.
 */
function applyPreviewChannelToken(compiler: Compiler) {
  const HtmlWebpackPlugin = require("html-webpack-plugin") as {
    getHooks: (compilation: unknown) => {
      beforeEmit: {
        tap: (
          name: string,
          fn: (data: { html: string }) => { html: string }
        ) => void
      }
    }
  }

  compiler.hooks.compilation.tap("SyncPreviewChannelToken", (compilation) => {
    HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tap(
      "SyncPreviewChannelToken",
      (data) => {
        data.html = data.html.replace(
          /window\['CHANNEL_OPTIONS'\]\s*=\s*(\{[\s\S]*?\});/,
          "window['CHANNEL_OPTIONS'] = (function (embedded) {" +
            "try {" +
            "var parentChannel = window.parent && window.parent !== window && window.parent.CHANNEL_OPTIONS;" +
            "if (parentChannel && parentChannel.wsToken) return parentChannel;" +
            "} catch (e) {}" +
            "return embedded;" +
            "})($1);"
        )
        return data
      }
    )
  })
}

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
    config.resolve = config.resolve ?? {}
    config.resolve.alias = {
      ...config.resolve.alias,
      "@storybook/argTypes": path.resolve(__dirname, "argTypes"),
    }

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

    config.entry = withoutHotFullReload(config.entry)
    config.plugins = config.plugins ?? []
    config.plugins.push({ apply: applyPreviewChannelToken })

    return config;
  },
};
export default config;