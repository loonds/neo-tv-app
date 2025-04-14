import Blits from '@lightningjs/blits'
import Input from '../components/Input.js'
import Button from '../components/Button.js'
import Keyboard from '../components/Keyboard.js'

export default Blits.Component('SendOTP', {
  components: {
    Input,
    Button,
    Keyboard,
  },

  state() {
    return {
      username: '',
      inputValue: '',
    }
  },

  methods: {
    handleInputChange(value) {
      this.state.inputValue = value
      console.log('Input Changed:', value)
    },

    handleSendOTP() {
      console.log('Send OTP to:', this.state.inputValue)
      // You can add further logic to actually trigger OTP sending
    },
  },

  template: `
    <Element>
      <Element x="780" y="450">
        <Element x="360" w="400" y="-45" h="270" :y.transition="$keyboardY" :alpha.transition="$keyboardAlpha">
          <Keyboard margin="70" perRow="7" ref="keyboard" />
        </Element>

        <Input ref="username" :inputText="$username" placeholderText="Email/Phone" />
        <Button ref="button" y="210" buttonText="Submit" textAlign="center" />
      </Element>
    </Element>
  `,
  state() {
    return {
      username: '',
      index: 0,
      keyboardAlpha: 0,
      keyboardY: 0,
      focusable: ['username', 'button', 'keyboard'],
    }
  },
  hooks: {
    ready() {
      const username = this.$select('username')
      if (username && username.$focus) {
        username.$focus()
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
      console.log('setting focus to:', this.focusable[this.index])
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
      } else if (this.focusable[this.index] === 'password') {
        this.password += char
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
    right() {
      console.log("refocus child because we don't have a right focus")
      this.setFocus()
    },
    left() {
      console.log("refocus child because we don't have a left focus")
      this.setFocus()
    },
    enter() {
      const currentFocusable = this.focusable[this.index]
      let element = null
      switch (currentFocusable) {
        case 'button':
          console.log('submitting form:', this.username, this.password, this.checkbox)
          break
        case 'checkbox':
          this.checkbox = !this.checkbox
          break
        case 'progress':
          this.progress = this.progress === 100 ? 20 : this.progress + 20
          break
        case 'toggle':
          this.toggle = !this.toggle
          break
        case 'username':
        case 'password':
          this.keyboardAlpha = 1
          this.keyboardY = -45
          element = this.$select('keyboard')
          if (element && element.$focus) {
            element.$focus()
          }
          break
        default:
          console.warn('Unrecognized focusable element:', currentFocusable)
      }
    },
    back() {
      const currentFocusable = this.focusable[this.index]
      switch (currentFocusable) {
        case 'username':
          this.username = this.removeLastChar(this.username)
          break
        case 'password':
          this.password = this.removeLastChar(this.password)
          break
      }
    },
    any(e) {
      if (e.key.match(/^[\w\s.,;!@#$%^&*()_+\-=[\]{}|\\:'"<>,.?/~`]$/)) {
        this.handleKey(e.key)
      }
    },
  },
})
