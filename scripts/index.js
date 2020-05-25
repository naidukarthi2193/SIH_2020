const video = document.getElementById('video');

Promise.all([
  // faceapi.loadSsdMobilenetv1Model('/models'),
  faceapi.loadFaceLandmarkModel('/models'),
  faceapi.loadFaceRecognitionModel('/models'),
  faceapi.loadTinyFaceDetectorModel('/models'),
  faceapi.loadFaceLandmarkModel('/models'),
  faceapi.loadFaceLandmarkTinyModel('/models'),
  faceapi.loadFaceRecognitionModel('/models'),
  faceapi.loadFaceExpressionModel('/models'),
])
  .then(startVideo)
  .catch(err => console.error(err));

function startVideo() {
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  // console.log('thiru');

  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);


  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();


    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // console.log(detections);
  }, 100)
})

