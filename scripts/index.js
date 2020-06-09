const video = document.getElementById("video");
const attentionBtn = document.getElementById("attention");

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

attentionBtn.addEventListener("click", () => {
  takeASnap().then(download);
});

async function takeASnap() {
  const canvas = document.createElement("canvas"); // create a canvas
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  let jsondata;

  const ctx = canvas.getContext("2d"); // get its context
  canvas.width = video.videoWidth; // set its size to the one of the video
  canvas.height = video.videoHeight;

  // Single Image detection
  const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();
  if (detections[0]) {
    let { topLeft, bottomRight } = detections[0].detection.box;
    let detection = { topLeft, bottomRight };
    let expressions = detections[0].expressions;
    let landmarks = detections[0].landmarks.positions;

    jsondata = `${JSON.stringify({
      expressions,
      detection,
      landmarks,
    })}`;
  }

  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  faceapi.draw.drawDetections(canvas, resizedDetections);
  faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
  faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
  ctx.drawImage(video, 0, 0); // the video

  canvas.style.display = "none";

  // console.log(jsondata);

  // Write your AJAX call here to send the single data related to the image and add it to your json file of all the users
  //fetch(url, options)
  // In options, add your json data and send it to backend

  return new Promise((res, rej) => {
    canvas.toBlob(res, "image/jpeg"); // request a Blob from the canvas
  });
}
function download(blob) {
  // uses the <a download> to download a Blob
  let a = document.createElement("a");
  a.href = URL.createObjectURL(blob);

  // Write a new name for your files
  a.download = "screenshot.jpg";
  document.body.appendChild(a);
  a.click();
}
