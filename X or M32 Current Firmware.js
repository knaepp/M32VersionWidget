// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: brown; icon-glyph: magic;
// Created by Matthias Knäpper, IT Knäpper, Dortmund;
// 2021, Dortmund;
// Some code comes from an Article of c't magazine. Thank you for the inspiration.
// This widget requests the current firmware version of X/M32 mixing consoles
// and the current version of the X/M32-Edit version (for macOS devices. Should be the same for
// Windows and Linux devices as well) using the rest-api from Musictribe website
// Have Fun!;

const fs = require('fs');
var fileReader=new FileReader();
const timeFont = Font.boldSystemFont(12);
const normalFont = Font.mediumSystemFont(12);
const titleFont = Font.boldSystemFont(12);
const smallFont = Font.mediumSystemFont(8);
var url = "https://www.midasconsoles.com/.rest/musictribe/v1/downloadcenter/solr-dldatatable?brandName=midas&cat-name=C-MIDAS-MIXINGCONSOLES-DIGITALMIXERS&modelCode=P0B3I&type=Software&subtype=Firmware&iDisplayStart=0&iDisplayLength=1000"
var url2 = "https://www.midasconsoles.com/.rest/musictribe/v1/downloadcenter/solr-dldatatable?brandName=midas&cat-name=C-MIDAS-MIXINGCONSOLES-DIGITALMIXERS&modelCode=P0B3I&type=Software&subtype=Mac&iDisplayStart=0&iDisplayLength=1000";
var ModelName;
var SoftwareType1;
var SoftwareTitle1;
var SoftwareType2;
var SoftwartTitle2;

let actualFirmwareVersion=readData("actualVersion.csv")
let data = await getData();
let widget = await createWidget(data);
if (config.runsInWidget) {
  Script.setWidget(widget);
  Script.complete();
} else {
  await showTableHTML(data);
}

readData(fileName){
   fileReader.
}

async function showTableHTML(midasversions) {
  let mv = JSON.parse(midasversions);
  let tBody = [];
  let css = `
  body,table { font-family: Helvetica, Arial, "sans serif"; margin-left: 5px; margin-right: 10px;}
  th { font-size: 130%; text-align: left; padding-left: 0.5em }
  span.station { font-weight: bold; }
  span.start { text-decoration: underline;}
  td.stops { padding-bottom: 2em; }
`;
  let tr = taggify("tr",taggify("th", SoftwareTitle1) + taggify("th", SoftwareTitle2));
  tr += taggify("tr", taggify("td", `<a href=${mv.FirmwareDownloadUrl}>${mv.FirmwareVersion}</a>`, { class: "stops" }) 
     + taggify("td", `<a href=${mv.SoftwareDownloadUrl}>${mv.SoftwareVersion}</a>`, { class: "stops" }));
  tBody.push(tr);

  let html = taggify("html", taggify("head", taggify("style", css, { type: "text/css" }))
    + taggify("body",
      taggify("h1", `Current `+ ModelName + ` versions`)
      + taggify("table", tBody.join(''))));
  let view = new WebView();
  await view.loadHTML(html);
  let myview = await view.present();
}

async function getData() {
  let firmReq = new Request(url);
  let appReq = new Request(url2);
  let firmwaredata = await firmReq.loadJSON();
  let appdata = await appReq.loadJSON();
  ModelName = `${ firmwaredata.aaData[0].modelName}`;
  SoftwareType1 = `${firmwaredata.aaData[0].groupName}`;
  SoftwareTitle1 = `${firmwaredata.aaData[0].title}`;
  SoftwareType2 = `${appdata.aaData[0].groupName}`;
  SoftwareTitle2 = `${appdata.aaData[0].title}`;
  let alldata = `{"FirmwareVersion":"${firmwaredata.aaData[0].releaseNotes}","FirmwareDownloadUrl":"${firmwaredata.aaData[0].url.url}","SoftwareVersion":"${appdata.aaData[0].releaseNotes}","SoftwareDownloadUrl":"${appdata.aaData[0].url.url}"}`;
  let version = new Array(firmwaredata.aaData[0].releaseNotes, appdata.aaData[0].releaseNotes);
  let midasobj = JSON.parse(alldata);
  return alldata
}

async function createWidget(midasversions) {
  let mv = JSON.parse(midasversions);
/*   const backGradient = new LinearGradient();
  backGradient.colors = [new Color("yellow"),new Color("white")];
  backGradient.locations = [0, 1];
  let files = FileManager.iCloud();
  const path = files.documentsDirectory() + "/header-logo-midas.svg";
  const logoPNG = Image.fromFile(path);
 */  
  let widget = new ListWidget();
  //widget.backgroundGradient = backGradient;
  //widget.backgroundImage = logoPNG;
  let stack = widget.addStack();
  stack.layoutVertically();
  
  let titleLine = stack.addStack();
  let title = titleLine.addText(ModelName + ": " + SoftwareType1);
  title.font = titleFont;
  titleLine.addSpacer();
 
  let firmText = stack.addStack();
  let firmware = stack.addStack();
  let softText = stack.addStack();
  let Software = stack.addStack();
  let FirmText = firmText.addText(SoftwareTitle1);
  let midfirmware = firmware.addText(`${mv.FirmwareVersion}`);
  let SoftText = softText.addText(SoftwareTitle2);
  let midSoft = Software.addText(`${mv.SoftwareVersion}`);
  let spacer = stack.addStack();
  let dateTime = stack.addStack();
  let TextTime = dateTime.addText("Reloaded: " + printDate());
  TextTime.font = smallFont;
  FirmText.font = titleFont;
  midfirmware.font = normalFont;
  SoftText.font = timeFont;
  midSoft.font = normalFont;
  return widget;
}

function taggify(el, str, atts) {
  let attributes = [];
  if (atts) {
    for (const [key, value] of Object.entries(atts)) {
      attributes.push(`${key}="${value}"`);
    }
  }
  let res = `<${el}` + (atts ? " " + attributes.join(" ") : "")
    + `>${str}</${el}>`;
  return res
}

function printDate() {
  let datum = new Date();
  let thisYear = datum.getFullYear();
  let thisMonth = changeLength(datum.getMonth()+1);
  let thisDay = changeLength(datum.getDate());
  let thisHour = changeLength(datum.getHours());
  let thisMinute = changeLength(datum.getMinutes());
  let thisSecond = changeLength(datum.getSeconds());
  let DatumString = `${thisYear}-${thisMonth}-${thisDay} ${thisHour}:${thisMinute}:${thisSecond}`;
  return DatumString
}

function changeLength(numVal) {
  if (`${numVal}`.length == 1) {
    numVal = "0" + `${numVal}`;
  }
  return numVal;
}

function writeFile(fContent, fileName) {
  let test = FileManager.local();
  //console.log(test.listContents());
  console.log(test.documentsDirectory());
  var documents = test.documentsDirectory();
  test.createDirectory(documents + "/ITKnaepper", true);
  test.write(documents + "/ITKnaeper/" + fileName, fContent);
  console.log(test.listContents(documents + "/ITKnaepper"));
  console.log(test.listContents(documents));
  var filePath = documents + "/ITKnaepper/";
  test.addTag(filePath + fileName, "Red");
  let newTest = test.read(filePath + fileName);
  console.log(newTest.toRawString());
  console.log(test.allFileBookmarks());
  console.log(test.allTags(filePath + fileName));
  console.log(test.creationDate(filePath + fileName));
  test.remove(filePath + fileName);
  test.remove(filePath);
}

function getDevice() {
  let Geraet = Device;
  if (Geraet.isPad()) {
    console.log("Dies ist ein iPad");
    console.log(Geraet.model());
    console.log(Geraet.systemName() + Geraet.systemVersion());
  } else if (Geraet.isPhone()) {
    console.log("Dies ist ein iPhone");
    console.log(Geraet.model());
    console.log(Geraet.systemName() + Geraet.systemVersion());
  };
}
