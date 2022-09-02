var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {
    console.log('::::::::::::::::::::::::::::::: ');
    var spawner_t = Game.spawns.Spawn1;    
    var room_t = spawner_t.room;


  for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var tower = Game.getObjectById('TOWER_ID');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
    var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
     
     
    console.log('h-b-u: ' + harvesters.length + '-' + builders.length + '-' + upgraders.length );
    var screeps_count= harvesters.length+builders.length+upgraders.length;
    
        
    var energy_capacity = room_t.energyCapacityAvailable;
    var energy_available = room_t.energyAvailable;
        console.log('energy: ' + energy_available + '/' + energy_capacity);

    if(energy_capacity==energy_available && harvesters.length>1)
    {
        for (var i = 0; i < harvesters.length; i++) {
            harvesters[i].memory.role = 'upgrader';
        }
    }
     
    if(energy_available<energy_capacity && upgraders.length>1)
    {
        for (var i = 0; i < upgraders.length; i++) {
            upgraders[i].memory.role = 'harvester';
        }
    }
    
    if(screeps_count <7&& energy_available>250 ) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE,CARRY], newName,
            {memory: {role: 'harvester'}});
    }
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
        console.log(':::::::::::::::::::::::::::::::\n');

}