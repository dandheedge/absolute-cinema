/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles

import 'vuetify/styles'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true,
        colors: {
          // deep-orange-darken-3
          primary: '#D84315',
          // yellow-darken-4
          secondary: '#F57F17',
          background: '#050507',
          surface: '#121212',
        },
      },
    },
  },
})
