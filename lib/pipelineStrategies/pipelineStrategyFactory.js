var tasksArrayStrategy = require('./tasksArrayStrategy')
    , streamFunctionStrategy = require('./streamFunctionStrategy')
;

function getPipelineStrategy(block){
    if(block.tasks) return tasksArrayStrategy;

    if(block.stream) return streamFunctionStrategy

}

module.exports = {
    getPipelineStrategy:getPipelineStrategy
}