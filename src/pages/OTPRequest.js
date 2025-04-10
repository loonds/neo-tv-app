import Blits from '@lightningjs/blits'

export default Blits.Component('OTPRequest', {
  template: `
    <Element :w="this.stageW" :h="this.stageH" color="#0f172a">
      <Text x="60" y="100" size="40" content="Enter Phone Number" color="#fff" />
    
      <Button
        ref="sendOtpButton"
        x="60"
        y="280"
        w="200"
        h="60"
        content="Send OTP"
        backgroundColor="#10b981"
        fontSize="24"
      />
    </Element>
  `,

  components: {
    TextInput: Blits.Elements.TextInput,
    Button: Blits.Elements.Button,
  },

  state() {
    return {
      stageW: 1920,
      stageH: 1080,
      phone: '',
      index: 0,
      focusable: ['phoneInput', 'sendOtpButton'],
    }
  },

  hooks: {
    mounted() {
      this.setFocus()
    },
  },

  methods: {
    setFocus() {
      const el = this.$select(this.focusable[this.index])
      if (el && el.$focus) el.$focus()
    },

    sendOTP() {
      if (this.phone.length === 10) {
        // Fake OTP send (you can integrate real API)
        console.log(`Sending OTP to ${this.phone}`)
        this.$navigate('OTPVerify', { phone: this.phone })
      } else {
        console.log('Invalid phone number')
      }
    },
  },

  input: {
    up() {
      this.index = this.index === 0 ? 1 : 0
      this.setFocus()
    },
    down() {
      this.index = this.index === 1 ? 0 : 1
      this.setFocus()
    },
    enter() {
      const focus = this.focusable[this.index]
      if (focus === 'sendOtpButton') {
        this.sendOTP()
      }
    },
    any(e) {
      if (this.focusable[this.index] === 'phoneInput') {
        if (e.key === 'Backspace') {
          this.phone = this.phone.slice(0, -1)
        } else if (e.key.match(/[0-9]/) && this.phone.length < 10) {
          this.phone += e.key
        }
      }
    },
  },
})
