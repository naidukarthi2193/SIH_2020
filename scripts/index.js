const video = document.getElementById("video");
const attentionBtn = document.getElementById("attention");
let detection, expressions, alignedRect, landmarks;

Promise.all([
  // faceapi.loadSsdMobilenetv1Model('/models'),
  faceapi.loadFaceLandmarkModel("/models"),
  faceapi.loadFaceRecognitionModel("/models"),
  faceapi.loadTinyFaceDetectorModel("/models"),
  faceapi.loadFaceLandmarkModel("/models"),
  faceapi.loadFaceLandmarkTinyModel("/models"),
  faceapi.loadFaceRecognitionModel("/models"),
  faceapi.loadFaceExpressionModel("/models"),
])
  .then(startVideo)
  .catch((err) => console.error(err));

function startVideo() {
  navigator.getUserMedia(
    {
      video: {},
    },
    (stream) => (video.srcObject = stream),
    (err) => console.error(err)
  );
}

video.addEventListener("play", () => {
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
    if (detections[0]) {
      console.log(detections[0]);
      alignedRect = detections[0].alignedRect;
      detection = detections[0].detection;
      expressions = detections[0].expressions;
      landmarks = detections[0].landmarks;
    }

    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

    // console.log(detections);
  }, 100);
});

attentionBtn.addEventListener("click", () => {
  takeASnap().then(download);
});

function takeASnap() {
  const canvas = document.createElement("canvas"); // create a canvas
  const jsondata = document.createElement("p");
  const ctx = canvas.getContext("2d"); // get its context
  canvas.width = video.videoWidth; // set its size to the one of the video
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0); // the video
  canvas.style.display = "none";

  jsondata.innerText = `${JSON.stringify({
    alignedRect,
    expressions,
    detection,
    landmarks,
  })}`;

  document.body.appendChild(jsondata);

  return new Promise((res, rej) => {
    canvas.toBlob(res, "image/jpeg"); // request a Blob from the canvas
  });
}
function download(blob) {
  // uses the <a download> to download a Blob
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "screenshot.jpg";
  document.body.appendChild(a);
  a.click();
}
