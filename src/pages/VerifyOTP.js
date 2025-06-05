import Blits from '@lightningjs/blits'
import Input from '../components/Input.js'
import Button from '../components/Button.js'
import Keyboard from '../components/Keyboard.js'
import { verifyOTP } from '../api/providers/index.js'

export default Blits.Component('VerifyOTP', {
  components: {
    Input,
    Button,
    Keyboard,
  },

  state() {
    return {
      otp: '',
      index: 0,
      keyboardAlpha: 0,
      keyboardY: 0,
      focusable: ['otp', 'button', 'keyboard'],
    }
  },

  template: `
    <Element>
      <Element w="1920" h="1080" color="#000000" />
      <!-- Centered OTP Form Container -->
      <Element :x="300" :y="300" w="600" h="600">
        <Text content="Verify OTP" textColor="#FFFFFF" :size="28" />

        <!-- OTP Input Field -->
        <Input ref="otp" :inputText="$otp" placeholderText="OTP" y="80" />

        <!-- Submit Button -->
        <Button ref="button" y="180" buttonText="Login" textAlign="center" color="blue" />

        <!-- Keyboard -->
        <Element x="0" y="280" :y.transition="$keyboardY" :alpha.transition="$keyboardAlpha">
          <Keyboard margin="70" perRow="7" ref="keyboard" />
        </Element>
      </Element>
    </Element>
  `,
  props: ['email'],

  hooks: {
    ready() {
      const otp = this.$select('otp')
      if (otp && otp.$focus) {
        otp.$focus()
      }
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
      // Restrict input to only 6 digits and allow numbers only
      if (this.focusable[this.index] === 'otp' && this.otp.length < 6 && /^[0-9]$/.test(char)) {
        this.otp += char
      }
    },

    registerListeners() {
      this.$listen('onKeyboardInput', ({ key }) => {
        this.handleKey(key)
      })
    },

    async verifyOTP() {
      const email = this.email
      const mac_address = '00:00:00:00:00:00'
      const otp = this.otp

      try {
        const response = await verifyOTP({ email, mac_address, password: otp })

        // Ensure the response contains the success field and check for it
        console.log('Raw Response:', response)
        if (response && response.success) {
          // Extract token from the correct part of the response (it's nested under `data`)
          const token = response.token
          // Store the Bearer Token in localStorage for future API calls
          localStorage.setItem('authToken', token)
          console.log('OTP Verified Successfully:', response.message)
          this.$router.to('/')
          // Optionally, navigate to the next step or page
        } else {
          console.log('OTP Verification Failed:', response.message)
        }
      } catch (error) {
        console.error('Error during OTP verification:', error)
      }
    },

    // You can call this method to retrieve the Bearer Token for future API calls
    getAuthToken() {
      return localStorage.getItem('authToken')
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
    enter() {
      const currentFocusable = this.focusable[this.index]
      switch (currentFocusable) {
        case 'button':
          console.log('Verifying OTP:', this.otp)
          this.verifyOTP() // Call the verify OTP function
          break
        case 'otp':
          this.keyboardAlpha = 1
          this.keyboardY = 0
          break
      }
    },
    any(e) {
      // Prevent the backspace key from triggering the back function
      if (e.key === 'Backspace') {
        const currentFocusable = this.focusable[this.index]
        if (currentFocusable === 'otp') {
          this.otp = this.removeLastChar(this.otp)
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
