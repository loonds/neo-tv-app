import Blits from '@lightningjs/blits'
import Input from '../components/Input.js'
import Button from '../components/Button.js'
import Keyboard from '../components/Keyboard.js'
import { sendOTP } from '../api/providers/index.js'

export default Blits.Component('SendOTP', {
  components: {
    Input,
    Button,
    Keyboard,
  },

  state() {
    return {
      email: '',
      index: 0,
      keyboardAlpha: 0,
      keyboardY: 0,
      focusable: ['email', 'button', 'skip_login', 'keyboard'],
    }
  },

  template: `
    <Element>
      <Element w="1920" h="1080" color="#000000" />

      <!-- Centered OTP Form Container -->
      <Element :x="300" :y="300" w="600" h="600">
        <Text content="Get Started !" :color="#FF2D95" size="42" fontStyle="bold" />
        <Text content="Enter your OTP to login/signup" y="80" textColor="#FFFFFF" :size="28" />

        <Input ref="email" :inputText="$email" placeholderText="Enter OTP" y="150" />

        <Button ref="button" y="250" buttonText="Login" textAlign="center" :color="blue" />

        <Text
          content="Skip Login!"
          ref="skip_login"
          y="330"
          textColor="#AAAAAA"
          textAlign="center"
          :size="24"
          textDecoration="underline"
        />

        <Text
          content="We will send you an OTP to login or signup for your account on your email id."
          y="400"
          w="420"
          textColor="#888888"
          :size="16"
          textWrap="true"
        />

        <!-- Keyboard Area -->
        <Element x="0" y="480" :y.transition="$keyboardY" :alpha.transition="$keyboardAlpha">
          <Keyboard margin="70" perRow="7" ref="keyboard" />
        </Element>
      </Element>
    </Element>
  `,

  hooks: {
    ready() {
      const email = this.$select('email')
      if (email && email.$focus) {
        email.$focus()
      }
      console.log('Screen Resolution:', window.innerWidth + 'x' + window.innerHeight)
    },
    focus() {
      if (this.keyboardAlpha) {
        this.keyboardAlpha = 0
        this.keyboardY = 0
      }
      this.setFocus()
    },
    init() {
      this.registerListeners()
    },
  },

  methods: {
    setFocus() {
      const next = this.$select(this.focusable[this.index])
      if (next && next.$focus) {
        next.$focus()
      }
    },
    removeLastChar(str) {
      return str.substring(0, str.length - 1)
    },
    handleKey(char) {
      if (this.focusable[this.index] === 'email') {
        this.email += char
      }
    },
    registerListeners() {
      this.$listen('onKeyboardInput', ({ key }) => {
        this.handleKey(key)
      })
    },
  },

  input: {
    up() {
      this.index = this.index === 0 ? this.focusable.length - 1 : this.index - 1
      this.setFocus()
    },
    down() {
      this.index = this.index === this.focusable.length - 1 ? 0 : this.index + 1
      this.setFocus()
    },
    async enter() {
      const currentFocusable = this.focusable[this.index]
      let element = null
      switch (currentFocusable) {
        case 'button':
          if (!this.email || this.email.trim() === '') {
            console.log('Username (Email/Phone) is required!')
            return
          }

          console.log('Sending OTP to:', this.email)

          try {
            const response = await sendOTP({
              email: this.email,
              device_name: 'DeviceName',
              mac_address: '00:00:00:00:00:00',
              android_id: '1234567890',
              app_version: '1.0.0',
            })

            console.log('OTP sent successfully:', response)

            // You can even check for success based on your API structure
            if (response.success) {
              this.$router.to('/verify-otp', {
                email: this.email,
              })
            } else {
              console.error('Failed to send OTP:', response.message || 'Unknown error')
            }
          } catch (error) {
            console.error('Error sending OTP:', error)
          }

          break

        case 'email':
          this.keyboardAlpha = 1
          this.keyboardY = 0
          element = this.$select('keyboard')
          if (element && element.$focus) {
            element.$focus()
          }
          break
        case 'skip_login':
          console.log('Skip Login clicked')
          break
      }
    },
    any(e) {
      // Prevent the backspace key from triggering the back function
      if (e.key === 'Backspace') {
        const currentFocusable = this.focusable[this.index]
        if (currentFocusable === 'email') {
          this.email = this.removeLastChar(this.email)
        }
      } else if (e.key.match(/^[0-9]$/)) {
        // This is for numeric keys (0-9) including '8'
        this.handleKey(e.key)
      } else if (e.key.match(/^[\w\s.,;!@#$%^&*()_+\-=[\]{}|\\:'"<>,.?/~`]$/)) {
        // Other characters like letters and symbols
        this.handleKey(e.key)
      }
    },
  },
})
