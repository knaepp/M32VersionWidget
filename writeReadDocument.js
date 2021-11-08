// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: cyan; icon-glyph: magic;
var nur="Nur der BVB";
var nil="Nie der S04";
let bvb = Data.fromString(nur);
let s04 = Data.fromString(nil);
writeFile(bvb, "Firmware.txt");
writeFile(s04, "Edit.txt");

function writeFile(fContent, fileName) {
   let test = FileManager.local();
   //console.log(test.listContents());
   console.log(test.documentsDirectory());
   var documents=test.documentsDirectory();
   test.createDirectory(documents + "/Midas",true);
   test.write(documents + "/Midas/" + fileName, fContent);
   console.log(test.listContents(documents + "/Midas"));
   console.log(test.listContents(documents));
   var filePath=documents + "/Midas/";
   test.addTag(filePath + fileName,"Rot");
   let newTest=test.read(filePath + fileName);
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