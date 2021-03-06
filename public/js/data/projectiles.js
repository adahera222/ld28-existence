define([
  'data/layers'
], function(LAYERS){
  // projectiles are created with an entity
  // spriteId => function() { return properties; }
  var projectiles = {
    'fire': function(entity) {
      return {
        x: entity.x + 10,
        y: entity.y,
        framesLeft: 25,
        layer: LAYERS.projectile,
        damage: entity.weaponPower || 1,
        damageType: 'fire'
      };
    },
    'wind': function(entity) {
      return {
        x: entity.x + 10,
        y: entity.y,
        framesLeft: 60,
        layer: LAYERS.projectile,
        damage: entity.weaponPower || 1,
        damageType: 'wind'
      };
    }
  };

  return projectiles;
});
