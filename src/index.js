import Blits from '@lightningjs/blits'
import { theme } from '@lightningjs/blits/plugins'

import keymapping from './keymapping.js'
import App from './App.js'

import colors from './themes/colors.js'
import sizes from './themes/sizes.js'

// Determine current screen size
const screenWidth = window.innerWidth || 1920
const screenHeight = window.innerHeight || 1080

// Decide size theme based on screen width
let sizeMode = 'small'
if (screenWidth >= 3840) {
  sizeMode = 'xlarge'
} else if (screenWidth >= 1920) {
  sizeMode = 'large'
}

// Theme plugin for colors
Blits.Plugin(theme, 'colors', {
  themes: {
    light: colors.light,
    dark: colors.dark,
  },
  base: 'light',
  current: 'dark',
})

// Theme plugin for sizes
Blits.Plugin(theme, 'sizes', {
  themes: {
    small: sizes.small,
    large: sizes.large,
    xlarge: sizes.xlarge, // Add xlarge key to your `sizes.js`
  },
  base: 'small',
  current: sizeMode,
})

// Launch the app with dynamic resolution
Blits.Launch(App, 'app', {
  w: screenWidth,
  h: screenHeight,
  multithreaded: false,
  debugLevel: 1,
  reactivityMode: 'Proxy',
  defaultFont: 'lato',
  keymap: {
    ...keymapping(),
    85: 'sourceCode', // U or u key
  },
  fonts: [
    { family: 'lato', type: 'msdf', file: 'fonts/Lato-Regular.ttf' },
    { family: 'raleway', type: 'msdf', file: 'fonts/Raleway-ExtraBold.ttf' },
    { family: 'opensans', type: 'web', file: 'fonts/OpenSans-Medium.ttf' },
    { family: 'kalam', type: 'msdf', file: 'fonts/Kalam-Regular.ttf' },
    { family: 'lato-black', type: 'msdf', file: 'fonts/Lato-Black.ttf' },
  ],
  canvasColor: 'transparent',
  viewportMargin: 100,
})
