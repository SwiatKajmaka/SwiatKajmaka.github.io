// Ustaw tutaj ID arkusza (z URL)
const SHEET_ID = 'REPLACE_WITH_YOUR_SHEET_ID';
const SHEET_NAME = 'Sheet1'; // zmień jeśli inna nazwa


function doGet(e){
const action = (e.parameter.action || '').toLowerCase();
try{
if(action === 'create') return ContentService.createTextOutput(JSON.stringify(createPlant())).setMimeType(ContentService.MimeType.JSON);
if(action === 'visit' && e.parameter.id) return ContentService.createTextOutput(JSON.stringify(visitPlant(e.parameter.id))).setMimeType(ContentService.MimeType.JSON);
if(action === 'get' && e.parameter.id) return ContentService.createTextOutput(JSON.stringify(getPlant(e.parameter.id))).setMimeType(ContentService.MimeType.JSON);
return ContentService.createTextOutput(JSON.stringify({error:'invalid_action'})).setMimeType(ContentService.MimeType.JSON);
}catch(err){
return ContentService.createTextOutput(JSON.stringify({error:err.message})).setMimeType(ContentService.MimeType.JSON);
}
}


function openSheet(){
return SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
}


function createPlant(){
const sheet = openSheet();
const id = genId(8);
sheet.appendRow([id, 0]);
return {id: id, growth: 0};
}


function visitPlant(id){
const sheet = openSheet();
const data = sheet.getDataRange().getValues();
// find id in column A
for(let i=1;i<data.length;i++){
if(String(data[i][0]) === String(id)){
const current = Number(data[i][1]) || 0;
const next = current + 1;
sheet.getRange(i+1, 2).setValue(next);
return {id: id, growth: next};
}
}
// jeśli nie ma, utwórz nowy
sheet.appendRow([id, 1]);
return {id: id, growth: 1};
}


function getPlant(id){
const sheet = openSheet();
const data = sheet.getDataRange().getValues();
for(let i=1;i<data.length;i++){
if(String(data[i][0]) === String(id)){
return {id: id, growth: Number(data[i][1])||0};
}
}
return {id: id, growth: 0};
}


function genId(len){
const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
let out = '';
for(let i=0;i<len;i++) out += chars.charAt(Math.floor(Math.random()*chars.length));
return out;
}
