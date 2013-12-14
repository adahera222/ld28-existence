define([
  'underscore'
], function(_){
  var maps = {
    world: {
      backgroundColor: 'rgb(156, 191, 227)',
      heroStart: {
        x: 6,
        y: 9
      },
      tiles: [
        "11111111111141111111",
        "12020200000000300021",
        "12220200000000300021",
        "12020200000000300021",
        "10000000000000300221",
        "10000000000000000221",
        "10000000000000300221",
        "10000000000000300221",
        "10000000000000302221",
        "10000000000000302221",
        "10000000000000302221",
        "10000000000000322221",
        "10000000000000322221",
        "10000000000000322221",
        "11111111111111111111"
      ],
      triggerTiles: [
        "00000000000010000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000"
      ],
      triggers: {
        1: function(entity, GameSystem) {
            console.log('cave entrance');
            GameSystem.getMap().load('cave', { x: 11, y: 0 });
          }
      }
    },

    cave: {
      backgroundColor: 'rgb(200, 200, 200)',
      heroStart: {
        x: 5,
        y: 5
      },
      tiles: [
        "11111111111141111111",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "15555555555555555551",
        "11111111111111111111"
      ],
      triggerTiles: [
        "00000000000010000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000",
        "00000000000000000000"
      ],
      unitTiles: [
        "                    ",
        "                    ",
        "                    ",
        "                    ",
        "                    ",
        "                    ",
        "                    ",
        "                    ",
        "                    ",
        "                    ",
        "                    ",
        "              d     ",
        "                    ",
        "                    ",
        "                    "
      ],
      triggers: {
        1: function(entity, GameSystem) {
            console.log('cave exit');
            GameSystem.getMap().load('world', { x: 11, y: 0 });
          }
      },
      npcs: {
        d: {
          entityId: 'dog',
          props: {
            ai: 'random',
            aiTicks: 0,
            thinkSpeed: 100
          }
        }
      }
    }
  };

  _.each(maps, function(map, id) {
    // assign id field
    maps[id].id = id;
    // join array of strings into a single string for indexing
    maps[id].tiles = map.tiles.join('');
    maps[id].triggerTiles = map.triggerTiles.join('');
    if (maps[id].unitTiles) {
      maps[id].unitTiles = map.unitTiles.join('');
    } else {
      maps[id].unitTiles = '';
    }
  });

  return maps;
});
