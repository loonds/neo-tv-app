import Blits from '@lightningjs/blits'

export default Blits.Component('OTPVerify', {
  template: `
    <Element :w="this.stageW" :h="this.stageH" color="#0f172a">
      <Text x="60" y="100" size="40" :content="'Verifying ' + this.phone" color="#fff" />
    
      <TextInput
        ref="otpInput"
        x="60"
        y="180"
        w="300"
        h="60"
        fontSize="28"
        placeholder="Enter OTP"
        backgroundColor="#1e293b"
        color="#fff"
        borderRadius="10"
        :content="this.otp"
      />
    
      <Button
        ref="verifyOtpButton"
        x="60"
        y="280"
        w="200"
        h="60"
        content="Verify OTP"
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
      phone: '',
      otp: '',
      stageW: 1920,
      stageH: 1080,
      index: 0,
      focusable: ['otpInput', 'verifyOtpButton'],
    }
  },

  hooks: {
    mounted() {
      this.phone = this.$params?.phone || ''
      this.setFocus()
    },
  },

  methods: {
    setFocus() {
      const el = this.$select(this.focusable[this.index])
      if (el && el.$focus) el.$focus()
    },

    verifyOTP() {
      if (this.otp === '1234') {
        console.log(`OTP Verified for ${this.phone}`)
        this.$navigate('Home') // or any other screen
      } else {
        console.log('Invalid OTP')
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
      if (focus === 'verifyOtpButton') {
        this.verifyOTP()
      }
    },
    any(e) {
      if (this.focusable[this.index] === 'otpInput') {
        if (e.key === 'Backspace') {
          this.otp = this.otp.slice(0, -1)
        } else if (e.key.match(/[0-9]/) && this.otp.length < 6) {
          this.otp += e.key
        }
      }
    },
  },
})
