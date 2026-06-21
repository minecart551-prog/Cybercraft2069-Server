StartupEvents.registry('block', event => {
  event.create('barrier')
    .displayName('Invisible Block')
    .opaque(false)
    .notSolid()
    .hardness(0.2)
})