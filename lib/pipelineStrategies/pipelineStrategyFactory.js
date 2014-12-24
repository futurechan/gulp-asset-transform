var tasksArrayStrategy = require('./tasksArrayStrategy')
    , streamFunctionStrategy = require('./streamFunctionStrategy')
;

function getPipelineStrategy(block){
    var strategy = (block.tasks)
        ? tasksArrayStrategy
        : streamFunctionStrategy

    return strategy;
}

module.exports = {
    getPipelineStrategy:getPipelineStrategy
}