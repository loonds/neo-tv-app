import Blits from '@lightningjs/blits'

import Home from './pages/Home.js'
import Listing from './pages/Listing.js'
import Player from './pages/Player.js'
import Plan from './pages/Plan.js'
import Test from './pages/Test.js'
import OTPRequest from './pages/OTPRequest.js'
import OTPVerify from './pages/OTPVerify.js'

export default Blits.Application({
  template: `
    <Element>
      <RouterView />
    </Element>
  `,
  routes: [
    { path: '/', component: Home },
    { path: '/listing', component: Listing },
    { path: '/plan', component: Plan },
    { path: '/player', component: Player },
    { path: '/otp-request', component: OTPRequest },
    { path: '/otp-verify', component: OTPVerify },
  ],
})
