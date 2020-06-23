//
//
//
// let data = [
//     {
//         field: {label: 'firstname', value: 'firstname'},
//         operator: {label:'equals', value: 'eq'},
//         value: {label: 'some label', value:'saquib'}
//     },
//     {
//         field: {label: "Date Added", value: "dateadded"},
//         operator: {label: "after", value: "gt"},
//         value: {label: "06/23/2020", value: "2020-05-19"}
//     },
// ]
//
// console.log(data)
// // console.log(data);
//
// const mongoose = require('mongoose');
//
// mongoose.connect("mongodb://localhost:27017/testFilter", {useUnifiedTopology:true, useNewUrlParser: true}, function (err, r) {
//     if(!err)
//         console.log('connected');
// });
//
// let db = {}
//
// function createFilter(data) {
//     let ft = {}
//     data.forEach(dt => {
//         switch (dt.operator.value) {
//             case 'bw':{
//                 ft[dt.field.value] = {$gt: new Date(dt.value.value), $lt: new Date(dt.value.value2)};
//             }
//             break;
//             case 'gt':{
//                 ft[dt.field.value] = {$gt: new Date(dt.value.value)}
//             }
//                 break;
//             case 'lt':
//             {
//                 ft[dt.field.value] = {$lt: new Date(dt.value.value)}
//             }
//             break;
//             case 'eq':{
//                 if(dt.operator.label == 'on')
//                 ft[dt.field.value] = new Date(dt.value.value)
//                 else
//                     ft[dt.field.value] = dt.value.value;
//             }
//             break;
//             default:{
//                 ft[dt.field.value] = dt.value.value;
//             };
//         }
//     })
//     //console.log(ft);
//
//    return ft;
// }
//
// // let obj = {
// //     _id: 'dsakahodi'
// // }
// // obj.s = 'saquib';
// // obj['d'] = 'shui';
// // console.log(obj);
//
//
// var mixedSchema = new mongoose.Schema({});
// var mix = mongoose.model('contacts', mixedSchema);
//
// const fetchData =  async ()=>{
//     try{
//        const filter = createFilter(data);
//        console.log(filter);
//
//         let res = await mix.find(filter).collation({locale:'en', strength: 2});
//         //console.log(res[0].toObject().firstname)
//         console.log(res);
//     }
//     catch (e) {
//         console.log(e);
//     }
// }
// fetchData();
//
//
//
// //route.get('/', (res, req)fujc
// var ds = {};
//
// // $.ajax({
// //     url: '/segmekkvhf',
// //     type: 'post',
// //     data: {}
// // })

//spreadsheet
//remove path later

const xlsx = require('xlsx');
const wb = xlsx.readFile('./public/files/xls/demo.xlsx', {cellDates:true});
const sheets = wb.SheetNames[0];

console.log(wb.Sheets[sheets]);
// sheets.forEach(sheet=>{
//     const currentSheet = wb.Sheets[sheet];
//     const sheetJson = xlsx.utils.sheet_to_json(currentSheet);
//     //console.log(sheetJson);
//     await
// });