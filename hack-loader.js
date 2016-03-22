var path = require('path');
var fs = require('fs');

module.exports = function(source, map) {
    var that = this;
    this.cacheable();
    var filePath = path.resolve(__dirname, 'app', 'components', 'IconSubstitute.jsx');
    //console.log('Path: ', filePath);

    this.addDependency(filePath);
    var fileContent = fs.readFileSync(filePath, "utf-8");
    return fileContent;
    //     console.log(file);
    //     if (err) return callback(err);
    //
    //     that.callback(null, file, map);
    // });

    //this.callback(null, source, map);
}
