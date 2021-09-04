const { createFFmpeg, fetchFile } = FFmpeg;
let ffmpeg;

/**
 * Takes bytes and returns a nicer readable value.
 * 
 * From https://stackoverflow.com/a/18650828.
 *
 * @param {bytes} The value in bytes to format.
 * @param {decimals} Number of decimal places to include. Defaults to 2.
 * @return {string} Formatted bytes value.
 */
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Called when a file is selected to update the size on the page.
 */
function updateSize() {
  
  if (!this.value) {
    return;
  }
  let file = this.files[0],
      fileBytes = file.size;
  let fileSize = formatBytes(fileBytes);

  document.getElementById("file-size").innerHTML = fileSize;
}

/**
 * Called when the user asks to convert the video.
 * 
 * Uses the form values from the page to determine quality, FPS, and size.
 */
const transcode = async () => {
  if (!uploadInput.value) {
    message.innerHTML = "Select a file first!";
    return
  }
  if (!ffmpeg) {
    ffmpeg = createFFmpeg();
  }

  ffmpeg.setLogger(({ type, message }) => {
    if (type == "fferr") {
      detailMessage.innerHTML = message;
    }
  });
  
  const quality = qualitySlider.value;
  const widthPercent = parseInt(widthSlider.value);
  const fps = parseInt(fpsSlider.value);
  const { name } = uploadInput.files[0];
  outputImage.classList.add('hidden');
  spinner.classList.remove('hidden');
  convertButton.disabled = true;
  uploadInput.disabled = true;
  message.innerHTML = 'Loading ffmpeg-core.js';
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  ffmpeg.FS('writeFile', name, await fetchFile(uploadInput.files[0]));
  message.innerHTML = 'Transcoding. Please wait...';
  const vFilter = "fps=" + fps + ",scale=iw/100*" + widthPercent + ":-1:flags=lanczos"
  await ffmpeg.run('-i', name, '-vf', vFilter, '-vcodec', 'libwebp', '-lossless', '0', '-compression_level', '6', '-q:v', quality, '-loop', '0', '-preset', 'picture', '-an', '-vsync', '0', 'output.webp');
  message.innerHTML = 'Completed transcoding!';
  const data = ffmpeg.FS('readFile', 'output.webp');

  outputImage.src = URL.createObjectURL(new Blob([data.buffer], { type: 'image/webp' }));
  outputImage.classList.remove('hidden');
  spinner.classList.add('hidden');
  convertButton.disabled = false;
  uploadInput.disabled = false;
}

const message = document.getElementById('status-box');
const detailMessage = document.getElementById('detail-message');
const spinner = document.getElementById('spinner');
const fpsSlider = document.getElementById('fps');
const qualitySlider = document.getElementById('quality');
const widthSlider = document.getElementById('width');

const outputImage = document.getElementById('output-image');

const convertButton = document.getElementById('convert-button');
convertButton.addEventListener('click', transcode, false);

const uploadInput = document.getElementById("upload-input");
uploadInput.addEventListener("change", updateSize, false);


/**
 * Cancels any in-progress work.
 */
const cancel = () => {
  try {
    ffmpeg.exit();
  } catch(e) {}
  ffmpeg = null;
}
