const colors = require('tailwindcss/colors')

const config = {
  mode: 'jit',
  purge: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        ec: colors.teal,
        cf: colors.yellow,
        rc: colors.orange,
        py: colors.rose,
        rd: colors.purple,
      },
    },
  },

  plugins: [],
}

module.exports = config
