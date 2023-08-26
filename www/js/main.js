
//execute the python ai script
var exec_script = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {

        var success = function(message) {
            alert(message);
        }
    
        var failure = function() {
            alert("Error calling Hello Plugin");
        }
    
        hello.greet("python3 ../../ai_stuff/main.py",success(),failure());
    }
}

var fileStorage = {


    write: function (name, data, useSandbox) {

        var nameParts = name.split('/');
        var nameIndex = 0;
        var dir = (useSandbox) ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

        return new Promise(function (resolve, reject) {

            var fail = function (msg, error) {
                reject('Write failed on ' + msg + ', code: ' + error.code);
            };

            var fileUrl = '';

            var gotFileWriter = function (writer) {
                writer.onwrite = function () {
                    resolve(fileUrl);
                    
                };
                writer.onerror = fail.bind(null, 'gotFileWriter');
                writer.write(data);
            };

            var gotFileEntry = function (fileEntry) {
                fileUrl = fileEntry.toURL();
                fileEntry.createWriter(gotFileWriter, fail.bind(null, 'createWriter'));
            };

            var gotDirectory = function (directory) {

                nameIndex++;

                if (nameIndex === (nameParts.length - 1)) {
                    directory.getFile(nameParts[nameIndex], { create: true, exclusive: false }, gotFileEntry, fail.bind(null, 'gotDirectory - getDirectory'));
                }
                else {
                    directory.getDirectory(nameParts[nameIndex], { create: true }, gotDirectory, fail.bind(null, 'gotDirectory - getFile'));
                }
            };

            var gotFileSystem = function (fileSystem) {

                if (nameParts.length > 1) {
                    fileSystem.getDirectory(nameParts[nameIndex], { create: true }, gotDirectory, fail.bind(null, 'gotFileSystem - getDirectory'));
                }
                else {
                    fileSystem.getFile(name, { create: true, exclusive: false }, gotFileEntry, fail.bind(null, 'gotFileSystem - getFile'));
                }
            };

            window.resolveLocalFileSystemURL(dir, gotFileSystem, fail.bind(null, 'requestFileSystem'));
        });
    },


    read: function (name, useSandbox) {

        var dir = (useSandbox) ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

        return new Promise(function (resolve, reject) {

            var fail = function (msg, error) {
                reject('Read failed on ' + msg + ', code: ' + error.code);
            };

            var gotFile = function (file) {

                var reader = new FileReader();

                reader.onloadend = function (evt) {
                    resolve(evt.target.result);
                };

                reader.onerror = fail.bind(null, 'gotFile');

                reader.readAsText(file);
            };

            var gotFileEntry = function (fileEntry) {
                fileEntry.file(gotFile, fail.bind(null, 'gotFileEntry'));
            };

            window.resolveLocalFileSystemURL(dir + name, gotFileEntry, fail.bind(null, 'resolveLocalFileSystemURL'));
        });
    },

    removeFile: function (name, useSandbox) {

        var dir = (useSandbox) ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

        return new Promise(function (resolve, reject) {

            var fail = function (msg, error) {
                reject('Remove file failed on ' + msg + ', code: ' + error.code);
            };

            var gotFileEntry = function (fileEntry) {
                fileEntry.remove(function () {
                    resolve();
                }, fail.bind(null, 'remove'));
            };

            window.resolveLocalFileSystemURL(dir + name, gotFileEntry, fail.bind(null, 'resolveLocalFileSystemURL'));
        });
    },


    removeDirectory: function (name, useSandbox) {

        var dir = (useSandbox) ? cordova.file.dataDirectory : cordova.file.externalDataDirectory;

        return new Promise(function (resolve, reject) {

            var fail = function (msg, error) {
                reject('Remove directory failed on ' + msg + ', code: ' + error.code);
            };

            var gotDirectory = function (directory) {
                directory.removeRecursively(function () {
                    resolve();
                }, fail.bind(null, 'removeRecursively'));
            };

            window.resolveLocalFileSystemURL(dir + name, gotDirectory, fail.bind(null, 'resolveLocalFileSystemURL'));
        });
    }
};
  
// reads file
var string = fileStorage.read("comm.txt",true);

// put string on doc
document.getElementById("emotion").innerHTML = string

//empty the txt for the next emotion
fileStorage.write(" ");

var play_happy = false;
var play_sad = false;
var play_neutral = false;
var play_suprised = false;
var play_tried = false;
var i;

// if the ai reads the respective emotion for a solid amount of time then play the "happy" sound effect
if(string == "happy") {
    i+= 1
    if(i > 7000){
        play_happy = true;
        i = 0
    }
}
if(string == "sad") {
    i+= 1
    if(i > 7000){
        play_sad = true;
        i = 0
    }
}
if(string == "neutral") {
    i+= 1
    if(i > 7000){
        play_neutral = true;
        i = 0
    }
}
if(string == "suprised") {
    i+= 1
    if(i > 7000){
        play_suprised = true;
        i = 0
    }
}
if(string == "tired") {
    i+= 1
    if(i > 7000){
        play_tried = true;
        i = 0
    }
}

// audio stuff
var audio_stuff = {
    initialize: function() {
    document.addEventListener("deviceready", onDeviceReady, false);
},
onDeviceReady: function() {
    var happy = new Media("audio/happy.mp3", null, null, null);
    var sad = new Media("audio/sad.mp3", null, null, null)
    var neutral = new Media("audio/neutral.mp3", null, null, null)
    var suprised = new Media("audio/suprised.mp3", null, null, null)
    var tired = new Media("audio/tired.mp3", null, null, null)

    if(play_happy){
        happy.play();
        play_happy = false; 
    }
    if(play_sad) {
        sad.play();
        play_sad = false
    }
    if(play_neutral) {
        neutral.play();
        play_neutral = false;
    }
    if(play_suprised) {
        suprised.play()
        play_suprised = false;
    }
    if(play_tried) {
        tired.play()
        play_tried = false;
    }

},
}






   
