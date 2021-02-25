// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: mortar-pestle;
// share-sheet-inputs: url, file-url;
// Created by Matthias Knäpper, IT Knäpper, Dortmund;
// 2021, Dortmund;
// Have Fun!;

const timeFont = Font.boldSystemFont(12);
const normalFont = Font.mediumSystemFont(12);
const titleFont = Font.boldSystemFont(12);
const smallFont = Font.mediumSystemFont(8);
var url = "https://www.midasconsoles.com/.rest/musictribe/v1/downloadcenter/solr-dldatatable?brandName=midas&modelCode=P0B3I&type=Software&subtype=Firmware&catName=C-MIDAS-MIXINGCONSOLES-DIGITALMIXERS&sEcho=6&iColumns=6&sColumns=%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=15";
var url2 = "https://www.midasconsoles.com/.rest/musictribe/v1/downloadcenter/solr-dldatatable?brandName=midas&modelCode=P0B3I&type=Software&subtype=Mac&catName=C-MIDAS-MIXINGCONSOLES-DIGITALMIXERS&sEcho=6&iColumns=6&sColumns=%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=15";
let data = await getData();
//console.log(data);
let widget = await createWidget(data);
if (config.runsInWidget) {
  Script.setWidget(widget);
  Script.complete();
} else {
  console.log(printDate());
  await showTableHTML(data);
  //Safari.open(`shortcuts://run-shortcut?name=SpringBoard`)
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
  let tr = taggify("tr",taggify("th", `Firmware`) + taggify("th", 'Software'));
  tr += taggify("tr", taggify("td", `<a href=${mv.FirmwareDownloadUrl}>${mv.FirmwareVersion}</a>`, { class: "stops" }) 
     + taggify("td", `<a href=${mv.SoftwareDownloadUrl}>${mv.SoftwareVersion}</a>`, { class: "stops" }));
  tBody.push(tr);

  let html = taggify("html", taggify("head", taggify("style", css, { type: "text/css" }))
    + taggify("body",
      taggify("h1", `Aktuellste M32 Versionen`)
      + taggify("table", tBody.join(''))));
  let view = new WebView();
  await view.loadHTML(html);
  let myview = await view.present();
  //console.log(myview);
}

async function getData() {
  let firmReq = new Request(url);
  let appReq = new Request(url2);
  let firmwaredata = await firmReq.loadJSON();
  let appdata = await appReq.loadJSON();
  let alldata = `{"FirmwareVersion":"${firmwaredata.aaData[0].releaseNotes}","FirmwareDownloadUrl":"${firmwaredata.aaData[0].url.url}","SoftwareVersion":"${appdata.aaData[0].releaseNotes}","SoftwareDownloadUrl":"${appdata.aaData[0].url.url}"}`;
  let version = new Array(firmwaredata.aaData[0].releaseNotes, appdata.aaData[0].releaseNotes);
  let midasobj = JSON.parse(alldata);
  return alldata
}

async function createWidget(midasversions) {
  let mv = JSON.parse(midasversions);
  const backGradient = new LinearGradient();
  backGradient.colors = [new Color("yellow"),new Color("white")];
  backGradient.locations = [0, 1];
  let files = FileManager.iCloud();
  const path = files.documentsDirectory() + "/header-logo-midas.svg";
  console.log("Logopfad: " + path);
  const logoPNG = Image.fromFile(path);
  
  let widget = new ListWidget();
//  widget.backgroundGradient = backGradient;
  //widget.backgroundImage = logoPNG;
  let stack = widget.addStack();
  stack.layoutVertically();
  
  let titleLine = stack.addStack();
  let title = titleLine.addText("M32 Releases");
  title.font = titleFont;
  titleLine.addSpacer();
 
  let firmText = stack.addStack();
  let firmware = stack.addStack();
  let softText = stack.addStack();
  let Software = stack.addStack();
  let FirmText = firmText.addText('Firmware');
  let midfirmware = firmware.addText(`${mv.FirmwareVersion}`);
  let SoftText = softText.addText('M32-Edit');
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
  //console.log(res)
  return res
}

function printDate() {
  let datum = new Date();
  console.log(datum);
  thisYear = datum.getFullYear();
  console.log(thisYear);
  thisMonth = datum.getMonth()+1;
  console.log(thisMonth);
  thisDay = datum.getDate();
  console.log(thisDay);
  thisHour = datum.getHours();
  console.log(thisHour);
  thisMinute = datum.getMinutes();
  console.log(thisMinute);
  thisSecond = datum.getSeconds();
  console.log(thisSecond);
  DatumString = `${thisYear}-${thisMonth}-${thisDay} ${thisHour}:${thisMinute}:${thisSecond}`;
  return DatumString
}