class BarcodeScanner {
  constructor({ rootSelector = "#barcode-scanner", format = "code_128_reader", debug = false }) {
    this._init({ rootSelector, format, debug });
  }

  _init({ rootSelector, format, debug }) {
    this.debug = debug;
    this.rootSelector = rootSelector;
    this.format = format;
    this.$root = $(rootSelector);

    if (!Quagga) throw Error("Quagga instance (https://serratus.github.io/quaggaJS/#) required");
    if (!this.$root.length) throw Error(`${rootSelector}: BarcodeScanner's root element not found`);

    this._setupElements();
    this._setupEventHandlers();
  }

  _setupElements() {
    this.$paneFile = this.$root.find("[name=pane-file]");
    this.$iptFile = this.$paneFile.find("input[name=file]");

    this.$paneWebcam = this.$root.find("[name=pane-webcam]");
    this.video = this.$paneWebcam.find("[name=video]")[0];
    this.canvas = this.$paneWebcam.find("[name=canvas]")[0];
    this.ctx = this.canvas.getContext('2d');

    this.$lblProcessing = this.$root.find("[name=lbl-processing]");
  }

  _setupEventHandlers() {
    const self = this;

    this.$root.on("click", "[name=close]", () => {
      self._finish(null);
    });
  }

  open(callback) {
    this.callback = callback;
    this._togglePane("file");
    this.$lblProcessing.hide();
    this.$root.show();
  }

  _togglePane(pane = "file") {
    const isFilePane = (pane === "file");

    this.$paneFile.toggle(isFilePane);
    this.$paneWebcam.toggle(!isFilePane);
    this.$root.find("[name=btn-webcam]").toggle(isFilePane);
    this.$root.find("[name=btn-file]").toggle(!isFilePane);

    if (isFilePane) {
      this.$iptFile.val(null); // Reset file input
    }
  }

  scanFile(input) {
    const file = input.files[0];
    if (!file) return;

    this.$lblProcessing.show();

    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      const dataURL = event.target.result;
      if (!dataURL.startsWith("data:image/")) {
        this._finish(null, Error("Invalid Image File."));
        return;
      }
      this._processImage(dataURL);
    };
    fileReader.readAsDataURL(file);
  }

  _processImage(dataURL) {
    const config = {
      decoder: { readers: [{ format: this.format }] },
      locate: true,
      src: dataURL,
    };

    Quagga.decodeSingle(config, (result) => {
      const code = (result && result.codeResult) ? result.codeResult.code : null;
      const err = (code === null) ? Error("Invalid Barcode Image.") : null;
      this._finish(code, err);
    });
  }

  startFile() {
    this._stopWebcam();
    this._togglePane("file");
    this.$lblProcessing.hide();
  }

  startWebcam() {
    this._togglePane("webcam");

    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        this.video.srcObject = stream;
        this.video.onloadedmetadata = () => {
          this.video.play();
          this._snapshot();
        };
      })
      .catch((err) => {
        console.error("Error accessing webcam:", err);
        this._finish(null, err);
      });
  }

  _snapshot() {
    if (!this.video.srcObject) return;

    this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    const dataURL = this.canvas.toDataURL();

    this._processImage(dataURL);
  }

  _stopWebcam() {
    if (this.video.srcObject) {
      this.video.pause();
      this.video.srcObject.getTracks().forEach(track => track.stop());
    }
  }

  _finish(data, err) {
    this.$root.hide();
    this._stopWebcam();
    this.$lblProcessing.hide();
    if (this.callback) {
      this.callback(err, data);
    }
  }
}
