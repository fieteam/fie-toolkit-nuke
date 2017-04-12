
var fs = require('fs-extra');
var archiver = require('archiver');
var path = require('path');
var work_path = process.cwd();

module.exports = function(zipPath, destZipFile) {
    if (fs.existsSync(destZipFile)) {
        fs.removeSync(destZipFile);
    }
    fs.ensureDirSync(path.resolve(work_path,'_output/'));

    console.log('stream',destZipFile);
    var zip_output = fs.createWriteStream(destZipFile);

    var archive = archiver('zip', {
        level: 9
    });

    zip_output.on('close', function() {
        console.log(destZipFile + ":" + archive.pointer() + ' total bytes');
    });

    archive.on('error', function(err) {
        console.log('compress error',err);
    });

    archive.pipe(zip_output);
    if (fs.existsSync(path.join(work_path, 'h5'))) archive.directory(path.join(work_path, 'h5'), 'h5');
    if (fs.existsSync(path.join(work_path, 'image'))) archive.directory(path.join(work_path, 'image'), 'image');

    if (fs.existsSync(path.join(work_path, 'qap.json'))) {
        archive.file('qap.json');
    }

    archive.directory(zipPath, 'qap');
    if (fs.existsSync(path.join(work_path, 'iconfont'))) {
        archive.directory(path.join(work_path, 'iconfont'), 'iconfont');
    }
    if(fs.existsSync(path.join(work_path, 'public'))){
      archive.directory(path.join(work_path, 'public'), 'public');
    }
    if(fs.existsSync(path.join(work_path, 'lifecycle'))){
      archive.directory(path.join(zipPath, 'lifecycle'), 'lifecycle');
    }
    archive.finalize();
}
