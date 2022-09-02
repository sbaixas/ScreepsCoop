var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.store.getFreeCapacity() > 0) {
            var sources = creep.room.find(FIND_SOURCES);
            var target =0;
            if(sources.length>1 && creep.memory.target == -1)
            {
                target = Game.time%sources.length;
                creep.memory.target = target;

            }
            if(creep.harvest(sources[target]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[target], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            creep.memory.target = -1;

            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;