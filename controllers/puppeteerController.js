const puppeteer = require("puppeteer");
let AllGetDataArray = [];
module.exports = {
  postDataRequest: async (req, res) => {
    try {
      const URL =
        "https://sam.gov/search/?page=1&pageSize=25&sort=-modifiedDate&sfm%5Bstatus%5D%5Bis_active%5D=true&sfm%5BsimpleSearch%5D%5BkeywordRadio%5D=ALL";
      const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: false,
      });
      const page = await browser.newPage();

      await page.goto(URL, {
        waitUntil: ["networkidle2", "domcontentloaded"],
      });
      await page.type("#newSimpleSearch", req.body.search);
      await page.keyboard.press("Enter");
      await page.setDefaultNavigationTimeout(6000);
      await page.waitForTimeout(4000);

      const dataLinkArray = await page.evaluate(() => {
        let linksArray = Array.from(
          document.querySelectorAll(" div > h3 > a"),
          (a) => a?.getAttribute("href")
        );
        return linksArray;
      });

      let dataLink = dataLinkArray.slice(0, 3);
      // console.log("Data links", dataLink);

      if (dataLink.length == 0) {
        return res.status(400).send({
          status: 400,
          success: false,
          Message: "Search not found",
        });
      }

      for (let i = 0; i < dataLink.length; i++) {
        let urllink = await `https://sam.gov/${dataLink[i]}`;
        //   console.log("Link", urllink);

        const secondPage = await browser.newPage();
        await secondPage.goto(urllink, {
          waitUntil: ["networkidle2", "domcontentloaded"],
        });

        const getAllData = await secondPage.evaluate(async () => {
          function delay(time) {
            console.log("delay function Working");
            return new Promise(function (resolve) {
              setTimeout(resolve, time);
            });
          }
          let closebtn = document.querySelector(".close-btn");
          if (closebtn) {
            closebtn.click();
          }
          let header =
            document.querySelector(".sup.header")?.nextSibling?.textContent;
          let id = document.querySelector("div > .description")?.textContent;
          let originalDate = document.querySelector(
            "#general-original-response-date"
          )?.textContent;
          let subCommand = document.querySelector(
            "#header-hierarchy-level > div > div:nth-child(6)"
          )?.textContent;
          let description = document.querySelector(
            "#description > div.ng-star-inserted"
          )?.textContent;
          let contractOpportunity =
            document.querySelector("#general-type")?.textContent;
          let department = document.querySelector(
            "#header-hierarchy-level > div > div:nth-child(2)"
          )?.textContent;
          let NAICSCode = document.querySelector(
            "#classification-naics-code > ul > li"
          )?.textContent;
          let subTire = document.querySelector(
            "#header-hierarchy-level > div > div:nth-child(4)"
          )?.textContent;
          let upDatedDate = document.querySelector(
            "#general-response-date"
          )?.textContent;
          let updatedPublish = document.querySelector(
            "#general-published-date"
          )?.textContent;
          let upDatedDateOffer = document.querySelector(
            "#general-response-date"
          )?.textContent;
          let originalDateOffer = document.querySelector(
            "#general-original-response-date"
          )?.textContent;
          let productCode = document.querySelector(
            "#classification-classification-code"
          )?.textContent;
          await delay(8000);
          document
            .querySelector("#opp-view-attachments-section-title")
            .scrollIntoView();
          await delay(8000);
          let attachementLinks = Array.from(
            document.querySelectorAll("#opp-view-attachments-fileLinkId0"),
            (a) => a?.getAttribute("href")
          );
          return {
            header: header,
            id: id,
            originalDate: originalDate,
            upDatedDate: upDatedDate,
            updatedDatePublish: updatedPublish,
            upDatedDateOffer: upDatedDateOffer,
            originalDateOffer: originalDateOffer,
            subCommand: subCommand,
            contractOpportunity: contractOpportunity,
            department: department,
            productCode: productCode,
            NAICSCode: NAICSCode,
            subTire: subTire,
            description: description,
            attachementLinks: attachementLinks,
          };
        });
        //push in array
        AllGetDataArray.push(getAllData);
        console.log(AllGetDataArray);
      }
      return res.status(200).send({
        success: true,
        status: 200,
        Message: "Searched SucessFully",
      });
    } catch (error) {
      console.log(error);
      return res.send({
        success: true,
        status: 500,
        Message: "Server Error",
      });
    }
  },
  getDataRequest: async (req, res) => {
    try {
      return res.status(200).send({
        status: 200,
        success: true,
        Arraylength: AllGetDataArray.length,
        Data: AllGetDataArray,
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        success: true,
        Message: "Server Error",
      });
    }
  },
};
