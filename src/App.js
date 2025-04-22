import Blits from '@lightningjs/blits'

import Portal from './pages/Portal'
import Home from './pages/Home.js'

import Player from './pages/Player'
import SourceInfo from './components/SourceInfo.js'

const queryString = new URLSearchParams(window.location.search)
const showSource = !!queryString.get('source')
const showFPS = !!queryString.get('fps')

export default Blits.Application({
  components: {
    SourceInfo,
  },
  template: `
    <Element w="1920" h="1080" :color="$backgroundColor">
      <RouterView w="100%" h="100%" />
      <FPScounter x="1610" :show="$showFPS" />
      <SourceInfo ref="info" :show="$showInfo" />
    </Element>
  `,
  state() {
    return {
      backgroundColor: '#1e293b',
      showFPS: showFPS,
      showInfo: false,
    }
  },
  routes: [
    // Send Otp page
    { path: '/send-otp', component: () => import('./pages/SendOTP.js') },
    { path: '/otp-verify', component: () => import('./pages/VerifyOTP.js') },
    // Demo routes
    { path: '/demo', component: Portal, options: { keepAlive: true } },
    { path: '/player', component: Player },
    { path: '/', component: Home, options: { keepAlive: true } },
  ],
  hooks: {
    ready() {
      if (process.env.NODE_ENV === 'testing') {
        this.showFPS = false
      }

      if (showSource === true) this.showInfo = true
      this.$listen('changeBackground', (color) => {
        this.backgroundColor = color ? color + 80 : '#1e293b'
      })
      this.$listen('clearBackground', () => {
        this.backgroundColor = 'transparent'
      })
    },
  },
  input: {
    // intercept key presses
    async intercept(e) {
      if (e.key === 'x') {
        this.$log.info(`Intercepting key press (${e.key}) in App Component`)

        return new Promise((resolve) => {
          this.$log.info('Executing an async operation')
          setTimeout(() => {
            this.$log.info('Finished an async operation')
            // resolve the input if you want to propagate the key press to the currently focused Component
            resolve(e)
          }, 2000)
        })
      }

      // return the input event to propagate the key press to the currently focused Component
      return e
    },
    escape() {
      this.quit()
    },
    back() {
      this.$router.to('/')
    },
  },
})
