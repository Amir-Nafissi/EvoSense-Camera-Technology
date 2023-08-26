
var app = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function() {
        console.log("deviceready");

        var imageElement = document.getElementById("camera-rectangle");

        let options = {
            x: 20,
            y: 165,
            width: 300,
            height: 357,
            camera: CameraPreview.CAMERA_DIRECTION.BACK,
            toBack: false,
            tapPhoto: true,
            tapFocus: false,
            previewDrag: false,
            storeToFile: false,
            disableExifHeaderStripping: false
        }

        CameraPreview.startCamera(options);

        console.log("shit worked");
    },
    TurnOffCamera: function() {
        CameraPreview.stopCamera();
    }
};

app.initialize();




    