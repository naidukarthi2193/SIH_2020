navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

// Select everything in HTML
const video = document.querySelector('#video');
const audio = document.querySelector('#audio');
const canvas = document.querySelector('#canvas');

const weights = './weights';


const context = canvas.getContext('2d');
console.log(context)
const modelParams = {
  flipHorizontal: true,   // flip e.g for video 
  imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.79,    // confidence threshold for predictions.
}

let model;
(async function () {
  await faceapi.loadSsdMobilenetv1Model(weights);
  await faceapi.loadFaceLandmarkModel(weights);
  await faceapi.loadFaceRecognitionModel(weights);
  await faceapi.loadTinyFaceDetectorModel(weights)
  await faceapi.loadMtcnnModel(weights)
  await faceapi.loadFaceLandmarkModel(weights)
  await faceapi.loadFaceLandmarkTinyModel(weights)
  await faceapi.loadFaceRecognitionModel(weights)
  await faceapi.loadFaceExpressionModel(weights)
  // console.log(faceapi)

  const input = document.getElementById('myImage')
  let fullFaceDescriptions = await faceapi.detectAllFaces(input).withFaceLandmarks().withFaceDescriptors()
  context.drawImage(input, 10, 10);
  // fullFaceDescriptions = faceapi.resizeResults()

  await faceapi.draw.drawDetections(canvas, fullFaceDescriptions)
  await faceapi.draw.drawFaceLandmarks(canvas, fullFaceDescriptions)



})()

// Start Video
handTrack.startVideo(video).then(status => {
  if (status) {
    navigator.getUserMedia({ video: {} }, stream => {
      console.log(stream)
      video.srcObject = stream;
      // setInterval(runDetection, 100)
      runDetection();
    },
      err => console.log(err)
    )
  }
});

//Detecting hand movement
function runDetection() {
  model.detect(video).then(predictions => {
    // console.log(predictions);
    model.renderPredictions(predictions, canvas, context, video);
    if (predictions.length > 0) {
      audio.play();
    } else {
      audio.pause();
    }
    requestAnimationFrame(runDetection);
  })
}

// Loading Model to train
handTrack.load(modelParams).then(lmodel => {
  model = lmodel;
});