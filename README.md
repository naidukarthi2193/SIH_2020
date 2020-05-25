# SIH_2020
Attention Span Detection

**Detecting Faces with landmarks and expressions**

> Used Face-api.js for face detection which is built upon tensorflow library.  
> Used navigator.getUserMedia for accessing web cam.  

> **index.js**  
 ```javascript
Promise.all([
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

```  
is used to load all the models required... and then calling the startVideo function



``` javascript
function startVideo() {
  navigator.getUserMedia(
    {
      video: {}
    },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}
```
which is used to hook the web cam to video element in html...

```javascript
video.addEventListener('play', () => {
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
  }, 100)
})
```
In this part, we detect the faces and computes the landmarks and faceExpressions
and we map it to canvas for drawing the detection area...
