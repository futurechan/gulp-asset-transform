
module.exports = {
    js:function(filename){
        return '<script src="' + filename + '"></script>';
    },
    css:function(filename){
        return '<link rel="stylesheet" type="text/css" href="' + filename + '">';
    }
}