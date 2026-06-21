ServerEvents.recipes(event => {
  event.shaped(
    Item.of('gundurability:repair_kit_1', 1),
    [
      '   ',
      ' I ',
      ' C '
    ],
    {
      I: 'minecraft:shaper_armor_trim_smithing_template',
      C: 'minecraft:copper_block',
    }
  )

  event.shaped(
    Item.of('gundurability:repair_kit_2', 1),
    [
      '   ',
      ' I ',
      ' C '
    ],
    {
      I: 'minecraft:dune_armor_trim_smithing_template',
      C: 'minecraft:iron_block',
    }
  )

  event.shaped(
    Item.of('gundurability:repair_kit_3', 1),
    [
      '   ',
      ' I ',
      ' C '
    ],
    {
      I: 'minecraft:silence_armor_trim_smithing_template',
      C: 'minecraft:gold_block',
    }
  )
})