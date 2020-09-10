var aws = require("aws-sdk");
var multer = require("multer");
var multerS3 = require("multer-s3");

aws.config.update({});

var s3 = new aws.S3({});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "upload-testing-edjustice",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + file.fieldname);
    },
  }),
  limits: { fileSize: 2000000 },
});

module.exports = upload;
