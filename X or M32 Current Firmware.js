// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: magic;
// share-sheet-inputs: url, file-url;
// Created by Matthias Knäpper, IT Knäpper, Dortmund;
// 2021, Dortmund;
// Have Fun!;

const timeFont = Font.boldSystemFont(12);
const normalFont = Font.mediumSystemFont(12);
const titleFont = Font.boldSystemFont(12);
var url = "https://www.midasconsoles.com/.rest/musictribe/v1/downloadcenter/solr-dldatatable?brandName=midas&modelCode=P0B3I&type=Software&subtype=Firmware&catName=C-MIDAS-MIXINGCONSOLES-DIGITALMIXERS&sEcho=6&iColumns=6&sColumns=%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=15";
var url2 = "https://www.midasconsoles.com/.rest/musictribe/v1/downloadcenter/solr-dldatatable?brandName=midas&modelCode=P0B3I&type=Software&subtype=Mac&catName=C-MIDAS-MIXINGCONSOLES-DIGITALMIXERS&sEcho=6&iColumns=6&sColumns=%2C%2C%2C%2C%2C&iDisplayStart=0&iDisplayLength=15";
let data = await getData();
//console.log(data);
let widget = await createWidget(data);
if (config.runsInWidget) {
  Script.setWidget(widget);
  Script.complete();
} else {
  await showTableHTML(data);
  //Safari.open(`shortcuts://run-shortcut?name=SpringBoard`)
}
//console.log(data);

/* async function showTable(midbehvers) {
  let isIphone = Device.isPhone();

  let table = new UITable();
  for (const d of midbehvers) {
    let row = new UITableRow();
    let midbehstop = d.releaseNotes;
    console.log(midbehstop);
    let cell = row.addText(midbehstop);
    row.height = (isIphone ? 30 : 22) * d.stops.length / 3;
    cell.titleFont = titleFont;
    cell.subtitleFont = normalFont;
    table.addRow(row);
  }
  return table
} */

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
  backGradient.colors = [new Color("green"),new Color("white")];
  backGradient.locations = [0, 1];
  let files = FileManager.iCloud();
  const path = files.documentsDirectory() + "/header-logo-midas.svg";
  //console.log("Logopfad: " + path);
  const logoPNG = Image.fromFile(path);
  
  let wide = config.widgetFamily !== "small";
  let widget = new ListWidget();
  widget.backgroundGradient = backGradient;
  widget.backgroundImage = logoPNG;
  if (! wide) {
    widget.setPadding(8, 5, 3, 3);
  }
  let stack = widget.addStack();
  stack.layoutVertically();
  
  let titleLine = stack.addStack();
  let title = titleLine.addText("M32 Releases");
  title.font = titleFont;
  titleLine.addSpacer();
 
/* let logo = titleLine.addImage(logoPNG);
  if (! wide) {
    logo.imageSize = new Size(20, 20);
  } */
  
  //stack.addSpacer(10);
  
  
    //let line = stack.addStack();
    if (wide) {
      let firmText = stack.addStack();
      let firmware = stack.addStack();
      let softText = stack.addStack();
      let Software = stack.addStack();
      let FirmText = firmText.addText('Firmware');
      let midfirmware = firmware.addText(`${mv.FirmwareVersion}`);
      let SoftText = softText.addText('M32-Edit');
      let midSoft = Software.addText(`${mv.SoftwareVersion}`);
      //Dies ist ein TEst
      FirmText.font = titleFont;
      midfirmware.font = normalFont;
      SoftText.font = timeFont;
      midSoft.font = normalFont;
      //firmware.addSpacer();
    }
  return widget;
}

/* function createLine(parent, data, wide) {
  let line = parent.addStack(); 
  if (wide) {
    let firmware = line.addStack();
    let train = firmware.addText("Midas Firmware");
    train.font = normalFont;
    firmware.addSpacer();
  }
  return line;
} */

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