import Blits from '@lightningjs/blits'
import Input from '../components/Input.js'
import Button from '../components/Button.js'
import Keyboard from '../components/Keyboard.js'

export default Blits.Component('VerifyOTP', {
  components: {
    Input,
    Button,
    Keyboard,
  },

  state() {
    return {
      username: '',
      otp: '',
      index: 0,
      keyboardAlpha: 0,
      keyboardY: 0,
      focusable: ['otp', 'button', 'keyboard'],
    }
  },

  template: `
    <Element>
      <Element x="960" y="540" mount="0.5" w="600" h="500">
        <!-- Form Title -->
        <!-- Form Title Centered -->
        <Text content="Verify OTP" x="150" mount="0.5" y="0" textColor="white" fontSize="42" textAlign="center" />
    
        <!-- Input Field -->
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
      if (this.focusable[this.index] === 'username') {
        this.username += char
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
    enter() {
      const currentFocusable = this.focusable[this.index]
      let element = null
      switch (currentFocusable) {
        case 'button':
          console.log('Sending OTP to:', this.username)
          break
        case 'username':
          this.keyboardAlpha = 1
          this.keyboardY = 0
          element = this.$select('keyboard')
          if (element && element.$focus) {
            element.$focus()
          }
          break
      }
    },
    back() {
      const currentFocusable = this.focusable[this.index]
      if (currentFocusable === 'username') {
        this.username = this.removeLastChar(this.username)
      }
    },
    any(e) {
      if (e.key.match(/^[\w\s.,;!@#$%^&*()_+\-=[\]{}|\\:'"<>,.?/~`]$/)) {
        this.handleKey(e.key)
      }
    },
  },
})
