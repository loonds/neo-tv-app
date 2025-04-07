import Blits from '@lightningjs/blits'

export default Blits.Component('Header', {
  // ✅ FIXED: Changed `state` to be a function returning an object
  state() {
    return {
      width: 800,
      height: 100,
      radius: 10,
      scale: 1,
      rotation: 0,
      x: 0,
    }
  },

  template: `
    <Element w="1920" h="100" color="#0f172a">
      <Element x="60" y="25">
        <Text size="40" content="MyApp" color="#ffffff" />
      </Element>
      <Element x="1600" y="25">
        <Text x="0" size="30" content="Plan" color="#ffffff" />
        <Text x="120" size="30" content="Account" color="#ffffff" />
      </Element>
    </Element>
  `,
})
