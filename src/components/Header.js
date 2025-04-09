import Blits from '@lightningjs/blits'

export default Blits.Component('Header', {
  template: `
    <Element w="1920" h="100" color="#0f172a">
      <Element x="60" y="25">
        <Text size="40" content="MyApp" color="#ffffff" />
      </Element>
      <Element x="1600" y="25">
        <Element ref="plan" w="100" h="50" focusable="true" @enter="goToPlan" @click="goToPlan">
          <Text size="30" content="Plan" color="#ffffff" />
        </Element>
        <Element x="120" ref="account" w="150" h="50" focusable="true" @enter="goToAccount" @click="goToAccount">
          <Text size="30" content="Account" color="#ffffff" />
        </Element>
      </Element>
    </Element>
  `,

  refs: {
    plan: 'plan',
    account: 'account',
  },

  methods: {
    goToPlan() {
      this.$navigate('/plan')
    },
    goToAccount() {
      this.$navigate('/account')
    },
  },
})
