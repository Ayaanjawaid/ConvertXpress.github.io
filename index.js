let express = require("express");
let bodyparser = require("body-parser");
const path = require("path");
const multer = require("multer");

let docxtopdf = require("docx-pdf");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("uploads"));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

var upload = multer({ storage: storage });

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/docxtopdf", upload.single("file"), (req, res) => {
  console.log(req.file.path);
  let outputfilepath = Date.now() + "output.pdf";

  docxtopdf(req.file.path, outputfilepath, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.download(outputfilepath, () => {});
    }
  });
});

app.listen(5000, () => {
  console.log("app is running on port 5000");
});
