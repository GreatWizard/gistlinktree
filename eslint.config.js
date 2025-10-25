import { defineConfig } from 'eslint/config'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import nodePlugin from 'eslint-plugin-n'
import stylelintConfig from 'eslint-config-stylelint'

export default defineConfig([
  eslintPluginPrettierRecommended,
  stylelintConfig,
  nodePlugin.configs['flat/recommended-script'],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  {
    rules: {
      'no-console': 0,
    },
  },
  {
    files: ['eslint.config.js'],
    rules: {
      'n/no-unpublished-import': 0,
    },
  },
])
