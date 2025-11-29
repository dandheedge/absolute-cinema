import vuetify from 'eslint-config-vuetify'
import { concat } from 'eslint-flat-config-utils'
import tseslint from 'typescript-eslint'

export default concat(
  vuetify(),
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
)
