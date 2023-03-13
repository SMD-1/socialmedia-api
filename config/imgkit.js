const ImageKit = require("imagekit");
const dotenv = require("dotenv");
dotenv.config();

const imageKit = new ImageKit({
  publicKey: process.env.imagekit_public_key,
  privateKey: process.env.imagekit_private_key,
  urlEndpoint: process.env.imagekit_url_endpoint,
});
// module.exports removeImgFromImageKit = (imageName) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       //find the image in imageKit
//       const images = await imageKit.listFiles({ name: imageName });
//       console.log(images);
//       //if there is an image, delete it
//       if (images.length > 0) {
//         const deletedImg = await imageKit.deleteFile(images[0].fileId);
//         console.log("deletedImg", deletedImg);
//       }
//       resolve();
//     } catch (err) {
//       console.log(err);
//       reject();
//     }
//   });
// };

module.exports = imageKit;
