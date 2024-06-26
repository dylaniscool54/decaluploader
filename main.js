const express = require("express");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const FormData = require("form-data");
const sharp = require("sharp");
const puppeteer = require("puppeteer");
const app = express();

function deleteFilesInFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading folder:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", filePath, err);
          return;
        }
        console.log("Deleted file:", filePath);
      });
    });
  });
}
deleteFilesInFolder("files");

app.use(express.json());

async function getcsrf(cookie) {
  const headers = {
    cookie: ".ROBLOSECURITY=" + cookie,
  };
  let csrf = "";
  try {
    await axios.post(
      "https://friends.roblox.com/v1/users/1/unfriend",
      {},
      { headers }
    );
  } catch (err) {
    console.log(err.response.headers);
    console.log(err.response.data);
    console.log(err.response.status);
    csrf = err.response.headers["x-csrf-token"];
  }

  return csrf;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateRandomString() {
  const words = [
    "apple",
    "banana",
    "cherry",
    "elderberry",
    "fig",
    "grape",
    "honeydew",
    "kiwi",
    "lemon",
    "mango",
    "nectarine",
    "orange",
    "peach",
    "quince",
    "raspberry",
    "strawberry",
    "tangerine",
    "watermelon",
    "apricot",
    "blueberry",
    "coconut",
    "dragonfruit",
    "grapefruit",
    "jackfruit",
    "kiwifruit",
    "lime",
    "melon",
    "papaya",
    "pineapple",
    "plum",
  ];
  const randomWords = [];
  for (let i = 0; i < 4; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    randomWords.push(words[randomIndex]);
  }
  return randomWords.join("") + Math.floor(Math.random() * 100);
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get("/", async (req, res) => {
  console.log("awake");
  res.end();
});

app.post("/", async (req, res) => {
  const body = req.body;
  const cookie = body["cookie"];
  const imageurl = body["img"];
  const webhook = body["hook"];
  const userid = body["userid"];
  const retrywh = body["retry"];
  const currenttry = body["trys"];
  const fullclear = body["clear"];
  
  console.log(fullclear)

  res.end();

  console.log(cookie);
  console.log(imageurl);
  console.log(webhook);
  console.log(userid);

  let headers = {
    cookie: ".ROBLOSECURITY=" + cookie,
  };

  let response;
  let contentLengthBytes;
  let contentLengthMB;
  try {
    response = await axios.get(imageurl, { responseType: "arraybuffer" });
    contentLengthBytes = response.headers["content-length"];
    contentLengthMB = contentLengthBytes / (1024 * 1024);
  } catch (err) {
    await axios.post(webhook, {
      content: "<@" + userid + "> Failed to load image!",
    });
    return;
  }

  if (contentLengthMB > 5) {
    await axios.post(webhook, {
      content: "<@" + userid + "> Image size exceeds the maximum limit of 5MB.",
    });
    return;
  }

  const fileBuffer = Buffer.from(response.data);

  const csrf = await getcsrf(cookie);
  console.log(csrf);
  headers["x-csrf-token"] = csrf;

  const assetname = generateRandomString();

  let breakthis = false;

  async function checkaccepts() {
    while (true) {
      try {
        axios.head("https://" + process.env.PROJECT_NAME + ".glitch.me/");

        if (breakthis) {
          break;
        }

        let cursor = "";
        while (true) {
          const assets = await axios.get(
            "https://itemconfiguration.roblox.com/v1/creations/get-assets?assetType=Image&isArchived=false&limit=100&cursor=",
            { headers }
          );
          const items = assets.data;
          cursor = items.nextPageCursor;
          const allassets = items.data;
          let getthumbs = "";
          for (const i of allassets) {
            if (i.name == assetname) {
              getthumbs = getthumbs + "," + i.assetId;
            } else {
              cursor = "";
              break;
            }
          }

          const thumbs = await axios.get(
            "https://thumbnails.roblox.com/v1/assets?assetIds=" +
              getthumbs +
              "&returnPolicy=PlaceHolder&size=150x150&format=Png&isCircular=false",
            { headers }
          );
          const thum = thumbs.data.data;

          for (const i of thum) {
            if (i["imageUrl"] && i["state"] == "Completed") {
              const targetid = i["targetId"];

              await axios.post(webhook, {
                content:
                  "<@" +
                  userid +
                  "> Image has been uploaded! https://www.roblox.com/library/" +
                  targetid +
                  " url: " +
                  i["imageUrl"],
              });
              console.log("DONE!!!");
              breakthis = true;
              break;
            }
          }

          if (!cursor) {
            break;
          }

          if (breakthis) {
            break;
          }
        }
      } catch (err) {
        console.log(err.message);

        await delay(5000);
      }

      if (breakthis) {
        break;
      }

      await delay(5000);
    }
  }

  checkaccepts();

  let rbxuserid;

  while (true) {
    try {
      let baits = [
        "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/a6fade6d-b5be-408b-b73e-a4d21ed56d19/hvtrs82F-mgdka2Cdksaopdcpr.png",
        "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/a6fade6d-b5be-408b-b73e-a4d21ed56d19/home.png",
        "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/a6fade6d-b5be-408b-b73e-a4d21ed56d19/hvtrs82F-mgdka2Cdksaopdcpr+%281%29.png",
        "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/a6fade6d-b5be-408b-b73e-a4d21ed56d19/hvtrs82F-mgdka2Cdksaopdcpr+%282%29.png",
        "https://s3.amazonaws.com/production-assetsbucket-8ljvyr1xczmb/a6fade6d-b5be-408b-b73e-a4d21ed56d19/hvtrs82F-mgdka2Cdksaopdcpr+%283%29.png",
      ];
      const inasda = Math.floor(Math.random() * baits.length);
      const fafeh = baits[inasda];

      const forground = await axios.get(fafeh, { responseType: "arraybuffer" });
      const backgroundata = forground.data;

      const uuid = uuidv4();

      const w = getRandomNumber(100, 512);
      const h = getRandomNumber(100, 512);

      let buffer;

      let randominc = getRandomNumber(0, 50);

      if (!fullclear) {
        await sharp(fileBuffer)
          .resize(w, h, {
            fit: sharp.fit.fill,
          })
          .png()
          .ensureAlpha()
          .raw()
          .toBuffer({ resolveWithObject: true })
          .then(async ({ data, info }) => {
            const { width, height, channels } = info;
            for (let i = 0; i < data.length; i += channels) {
              const r = data[i]; // Red channel value
              const g = data[i + 1]; // Green channel value
              const b = data[i + 2]; // Blue channel value
              const a = data[i + 3]; // Alpha channel value

              const darkness = (r + g + b) / (3 * 255);

              let rnal = Math.round(darkness * 255) - randominc;

              if (rnal < 0) {
                rnal = 0;
              }

              data[i + 3] = rnal;
            }
            data = await sharp(data, { raw: { width, height, channels } })
              .png()
              .ensureAlpha()
              .toBuffer();

            buffer = await sharp(backgroundata)
              .png()
              .resize({ width: w, height: h, fit: "fill" })
              .composite([{ input: data }])
              .ensureAlpha()
              .toBuffer();
          });
      } else {
        buffer = await sharp(fileBuffer)
          .resize(w, h, {
            fit: sharp.fit.fill,
          })
          .png()
          .toBuffer();
      }

      try {
        if (!rbxuserid) {
          const user = await axios.get(
            "https://users.roblox.com/v1/users/authenticated",
            { headers }
          );
          rbxuserid = user.data.id;
          console.log("RBX ID: " + rbxuserid);
        }

        const randomFilename = uuidv4().toString() + ".png";

        const req = `{"displayName":"${assetname}","description":"Uploaded using gg/z8rsPKgdd2 uploader","assetType":"Decal","creationContext":{"creator":{"userId":${rbxuserid}},"expectedPrice":0}}`;

        const formData = new FormData();
        formData.append("fileContent", buffer, randomFilename);
        formData.append("request", req);

        let combinedHeaders = { ...headers, ...formData.getHeaders() };

        const response = await axios.post(
          "https://apis.roblox.com/assets/user-auth/v1/assets",
          formData,
          { headers: combinedHeaders, timeout: 5000 }
        );
        console.log("Uploaded!");
      } catch (err) {
        console.log(err.message);
        if (err.response && err.response.status == 403) {
          //warning!!!!
          console.log("MODERATION");

          const notapprove = await axios.get(
            "https://usermoderation.roblox.com/v1/not-approved",
            {
              headers,
            }
          );

          const reason = notapprove.data.punishmentTypeDescription;
          console.log(reason);

          if (reason != "Warn") {
            await axios.post(retrywh, {
              content:
                userid +
                ";" +
                Buffer.from(imageurl).toString("base64") +
                ";" +
                currenttry,
            });
            breakthis = true;
            break;
          }

          try {
            const response = await axios.post(
              "https://usermoderation.roblox.com/v1/not-approved/reactivate",
              {},
              { headers }
            );
          } catch (err) {
            if (err.response.data.errors[0].code == 0) {
              const csrf = err.response.headers["x-csrf-token"];
              headers["X-Csrf-Token"] = csrf;
              headers["Origin"] = "https://www.roblox.com";

              const response = await axios.post(
                "https://usermoderation.roblox.com/v1/not-approved/reactivate",
                {},
                { headers }
              );
            }
          }
        }
        await delay(1000);
      }
    } catch (err) {
      console.log(err.message);

      await axios.post(retrywh, {
        content:
          userid +
          ";" +
          Buffer.from(imageurl).toString("base64") +
          ";" +
          currenttry +
          ";" +
          fullclear,
      });
      breakthis = true;
    }

    if (breakthis) {
      break;
    }
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
