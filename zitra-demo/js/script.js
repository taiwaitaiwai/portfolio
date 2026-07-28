// script.js (revised full version)
// QR texts supported: ZITRA_WIN / ZITRA_LOSE

const video = document.getElementById("video");
const canvasElement = document.getElementById("canvas");
const canvas = canvasElement.getContext("2d", { willReadFrequently: true });

let isScanning = true;

/**
 * Start camera stream
 */
function startCamera() {
  return navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
      video.srcObject = stream;
      video.setAttribute("playsinline", "true"); // iOS Safari: no fullscreen
      return video.play();
    })
    .then(() => {
      isScanning = true;
      requestAnimationFrame(tick);
    })
    .catch((err) => {
      console.error("Camera error:", err);
      alert("Could not access camera. Please ensure you are using HTTPS and have given permission.");
    });
}

/**
 * Stop camera stream cleanly
 */
function stopCamera() {
  const stream = video.srcObject;
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  video.srcObject = null;
}

/**
 * Scanning loop
 */
function tick() {
  if (!isScanning) return;

  if (video.readyState === video.HAVE_ENOUGH_DATA) {
    canvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;

    canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);

    const imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: "dontInvert",
    });

    if (code && code.data) {
      readQRCode(code.data);
      return; // avoid scheduling another frame in the same tick
    }
  }

  requestAnimationFrame(tick);
}

/**
 * QR result handling
 */
function readQRCode(text) {
  const value = (text || "").trim();

  // Pause scanning + release camera resources
  isScanning = false;
  stopCamera();

  // WIN
  if (value === "ZITRA_WIN") {
    window.location.href = "win.html";
    return;
  }

  // LOSE
  if (value === "ZITRA_LOSE") {
    window.location.href = "lose.html";
    return;
  }

  // Unknown code: show message, then restart scanning
  alert("Ungültiger QR-Code. Bitte scanne eine ZITRA-Dose.");
  startCamera();
}

// Start immediately when scan.html loads
startCamera();
