import Blits from '@lightningjs/blits'
import { theme } from '@lightningjs/blits/plugins'

import keymapping from './keymapping.js'
import App from './App.js'

import colors from './themes/colors.js'
import sizes from './themes/sizes.js'

// Theme plugin instance for colors (light mode / dark mode)
Blits.Plugin(theme, 'colors', {
  themes: {
    light: colors.light,
    dark: colors.dark,
  },
  base: 'light',
  current: 'dark',
})

// Theme plugin instance for sizes (small mode / large mode)
Blits.Plugin(theme, 'sizes', {
  themes: {
    small: sizes.small,
    large: sizes.large,
  },
  base: 'small',
  current: 'small',
})

// Use the Blits Language plugin

Blits.Launch(App, 'app', {
  w: 1920,
  h: 1080,
  multithreaded: false,
  debugLevel: 1,
  reactivityMode: 'Proxy',
  // adding source code key code: U, u
  defaultFont: 'lato',
  keymap: { ...keymapping(), ...{ 85: 'sourceCode' } },
  fonts: [
    {
      family: 'lato',
      type: 'msdf',
      file: 'fonts/Lato-Regular.ttf',
    },
    {
      family: 'raleway',
      type: 'msdf',
      file: 'fonts/Raleway-ExtraBold.ttf',
    },
    { family: 'opensans', type: 'web', file: 'fonts/OpenSans-Medium.ttf' },
    {
      family: 'kalam',
      type: 'msdf',
      file: 'fonts/Kalam-Regular.ttf',
    },
    {
      family: 'lato-black',
      type: 'msdf',
      file: 'fonts/Lato-Black.ttf',
    },
  ],
  canvasColor: 'transparent',
  viewportMargin: 100,
})
