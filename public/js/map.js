define([
  'underscore',
  'data/tiles',
  'data/layers',
  'data/maps',
  'actions'
], function(_, TILES, LAYERS, MAPS, actions){
  // map a coordinate to a 1d array index
  function pointToIndex(x, y) {
    return x + y * map.cols;
  }

  function isOnMap(x, y) {
    return x >= 0 && x < map.cols && y >=0 && y < map.rows;
  }

  // get entities at this position and check if we can go there
  function isSolid(x, y) {
    var entitiesHere = map.GameSystem.getEntities({ mapX: x, mapY: y });
    return _.find(entitiesHere, function(e) {
      return e.solid;
    });
  }

  var currentMap;

  var map = {};

  var isMapLoaded = false;
  var world = {
    init: function(game) {
      map.GameSystem = game;
      var settings = game.getSettings();
      map.rows = settings.rows;
      map.cols = settings.cols;
      map.gridX = settings.gridX;
      map.gridY = settings.gridY;
      map.ctx = settings.ctx;
    },

    load: function(mapName, mapState) {
      this.unload();

      currentMap = MAPS[mapName] || false;
      if (!currentMap) {
        console.error('unable to load map:', mapName);
        return;
      }
      isMapLoaded = true;

      // set new background color
      map.ctx.fillStyle = currentMap.backgroundColor;

      var previousState = map.GameSystem.getMapState(currentMap.id);

      // create map entities
      var x, y, index, id, entity;
      for (x = 0; x < map.cols; x++) {
        for (y = 0; y < map.rows; y++) {
          index = pointToIndex(x, y);
          id = currentMap.tiles[index];

          // create map tiles
          entity = map.GameSystem.createEntity('sprite', TILES[id]);
          entity.layer = LAYERS.tile;
          entity.mapId = currentMap.id;
          this.setEntityAt(entity, x, y);

          if (!previousState) {
            // create npcs
            var unitId = currentMap.unitTiles[index];
            if (unitId && currentMap.npcs[unitId]) {
              var npc = currentMap.npcs[unitId];
              entity = map.GameSystem.createEntity(npc.entityId, npc.props);
              entity.layer = LAYERS.unit;
              entity.mapId = currentMap.id;
              entity.persist = true;
              this.setEntityAt(entity, x, y);
            }
          }
        }
      }

      if (previousState) {
        // restore all entities in their current state
        _.each(previousState, function(e) {
          map.GameSystem.addEntity(e);
        });
      }

      // set player
      var hero = map.GameSystem.getHero();
      mapState = _.defaults(mapState, currentMap.heroStart);
      this.setEntityAt(hero, mapState.x, mapState.y);
      hero.direction = mapState.direction;

      this.triggerEvent('onEnterMap');
    },

    triggerEvent: function(eventName, options) {
      if (currentMap.events && currentMap.events[eventName]) {
        options = options || {};
        currentMap.events[eventName](map.GameSystem, options);
      }
    },

    unload: function() {
      if (isMapLoaded) {
        var persist = [];

        // remove all entities related to this map
        var entities = _.reject(map.GameSystem.getEntities(), function(e) {
          if (e.persist) {
            persist.push(e);
          }

          return e.mapId === currentMap.id;
        });

        map.GameSystem.saveMapState(currentMap.id, persist);

        // this is the 'game' state
        // TODO make this the main state
        map.GameSystem.setEntities(entities);
      }
    },

    getEntities: function() {
      return map.GameSystem.getEntities();
    },

    getTriggerAt: function(x, y) {
      var idx = pointToIndex(x, y);
      var triggerId = currentMap.triggerTiles[idx];
      var actionName = currentMap.triggers[triggerId];

      return actions[actionName] || function(){};
    },

    triggerAction: function(triggerEntity, x, y) {
      var idx = pointToIndex(x, y);
      var actionId = currentMap.actionTiles[idx];

      // map actions
      if (currentMap.actions[actionId]) {
        var actionName = currentMap.actions[actionId];

        actions[actionName](triggerEntity, map.GameSystem, x, y);

        // returning here blocks entity actions
        // TODO maybe need to remove this if entities are on the same spot
        return;
      }

      // entity actions
      var entitiesHere = map.GameSystem.getEntities({ mapX: x, mapY: y});
      var entity = _.find(entitiesHere, function(entity) {
        return entity.action;
      });
      if (entity) {
        actions[entity.action](triggerEntity, map.GameSystem, x, y, entity);
        return;
      }
    },

    // try to move the entity from point A to point B
    moveEntityTo: function(entity, x, y, skipTrigger) {
      if (isOnMap(x, y) && !isSolid(x, y)) {
        this.setEntityAt(entity, x, y);

        if (!skipTrigger && entity.isPlayer) {
          this.getTriggerAt(x, y)(entity, map.GameSystem, x, y);
        }
      }
    },

    // set an entity at a location
    setEntityAt: function(entity, x, y) {
      // set map position
      entity.mapX = x;
      entity.mapY = y;
      // set canvas position
      entity.x = x * map.gridX;
      entity.y = y * map.gridY;
    },

    getCurrentMap: function() {
      return currentMap;
    }
  };

  return world;
});
