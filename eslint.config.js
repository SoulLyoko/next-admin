import antfu from '@antfu/eslint-config'
import oxlint from 'eslint-plugin-oxlint'

export default antfu(
  {
    unocss: true,
    formatters: true,
    rules: {
      'ts/ban-ts-comment': 'off',
    },
  },
  oxlint.configs['flat/recommended'],
)
