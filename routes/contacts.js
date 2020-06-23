const express = require('express');
//function inport
const createFilter = require('../functions/createFilter');
//form file
const formidable = require('formidable');
//import xls
const xlsx = require('xlsx');



const router = express.Router();

//save segment schema
const SegmentSchema = require('../model/segmentSchema');

const CustomerSchema = require('../model/contactSchema');
//create schema import and use.

router.get('/', async (req, res)=>{
   try {
       const itemPerPage = 30;
       var page = parseInt(req.query.page) || 1;
       //fetch data and render it later.
       const uid = '5ed67a1b0f34fb0ba43c6997';
       const totalContacts = await CustomerSchema.countDocuments();
       const totalPages = Math.ceil(totalContacts/itemPerPage);
       if(page>totalPages) page=totalPages;
       const customers = await CustomerSchema.find({uid: uid},{uid:0}).skip(itemPerPage * (page - 1)).limit(itemPerPage).sort({_id: -1});

       if(!customers || customers.length < 1) return res.render('customer.ejs',{pageTitle: 'Contacts', data: false});
       return res.render('customer', {pageTitle: 'Contacts', data: customers, currentPage: page, totalPages:totalPages});

   }catch (e) {
       console.log(e);
       res.json({status: "failed",msg: 'Error fetching data'});
   }
});

router.post('/', async(req, res)=>{
    try{
        let page= req.body.page;

        const itemPerpage = 30;
        const uid = '5ed67a1b0f34fb0ba43c6997';
        const totalContacts = await CustomerSchema.countDocuments();
        const totalPages = Math.ceil(totalContacts/itemPerpage);
        if(page>totalPages) page=totalPages;
        const customers = await CustomerSchema.find({uid: uid},{uid:0}).skip(itemPerpage * (page - 1)).limit(itemPerpage).sort({_id: -1});

        if(!customers || customers.length < 1) return res.json({msg: 'No data found!', status: 201, pageNumber: page, totalPages: totalPages});

        return res.json({msg: 'Data found!', status: 200, pageNumber: page,data: customers,totalPages:totalPages});
    }catch (e) {
        console.log(e);
        return res.json({msg: 'Failed to fetch data', status: 203});
    }

});

router.post('/filter', async(req, res)=>{
    try{
        const filter = req.body.data || {};
        const newFilter = createFilter(JSON.parse(filter));
        const uid = '5ed67a1b0f34fb0ba43c6997';

        const customers = await CustomerSchema.find(newFilter,{uid:0}).sort({_id: -1}).collation({locale:'en', strength: 2});

        if(!customers || customers.length < 1) return res.json({msg: 'No data found!', status: 201});

        return res.json({msg: 'Data found!', status: 200, data: customers});
    }catch (e) {
        //console.log(e);
        res.json({msg: 'Failed', state: 203});
    }
});

router.post('/insertone', async(req, res)=>{
    try{
        //console.log(req.body);
        const uid = '5ed67a1b0f34fb0ba43c6997';
        let {firstname, lastname, email, address, city, pin, state, country, mobile, gender, dob, tags, dateadded, source, emc, smc, total_sale_value, last_purchase_history} = req.body;

        if(!firstname || !lastname || !email) return  res.json({msg: "field empty", status: 204});
        if(!dob) dob=Date.now();
        if(!dateadded) dateadded=Date.now();
        if(!total_sale_value) total_sale_value=0;
        if(!last_purchase_history) last_purchase_history = 0;

        const contact = new CustomerSchema({uid, firstname, lastname, email, address,city,state,country,pin,mobile,gender,dob,tags,dateadded,source,emc,smc,product:{total: total_sale_value, last_purchase: last_purchase_history}});
        await contact.save();
        return res.json({msg: "Added Successfully", status: '200'});
    }catch (e) {
        console.log(e)
        res.json({msg: "Failed to update", status: '201'})
       // res.json('Error');
    }
});

//batch mode
router.post('/batchinsert', async(req, res)=>{
    try{
        const uid = '5ed67a1b0f34fb0ba43c6997';
        let form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files)=>{
            if(err){
                console.log(err);
               return res.json({msg: "Failed to upload", status: 204});
            }
            if (typeof(files.file) !== 'undefined') {
                const path = files.file.path;
                const wb = xlsx.readFile(path, {cellDates:true});
                const sheets = wb.SheetNames[0];

                const sheetJson = xlsx.utils.sheet_to_json(wb.Sheets[sheets]);

                if(sheetJson.length > 0){
                    let dataInsert = [];
                    dataInsert = sheetJson.map(data=>{
                        data['uid'] = uid;
                        return data;
                    });
                   // console.log(dataInsert);
                    CustomerSchema.insertMany(dataInsert, function (err, docs) {
                        if(err){
                            console.log(err);
                            return res.json({msg: "Failed to insert", status: 201});
                        }else{
                            return res.json({msg: "Inserted", status: 200});
                        }
                    });
                }else {
                    console.log('error here!');
                    return res.json({msg: "Check file format", status: 202});
                }
            }else{

                console.log('empty');
            }

        });
    }catch (e) {
        console.log(e);
        res.json({msg: 'Error', status: 203});
    }
});

router.post('/savesegment', async (req, res)=>{
    try{
        const uid = '5ed67a1b0f34fb0ba43c6997';
        const segmentName = req.body.name || "";
        const segmentValue = JSON.parse(req.body.data);
       // console.log(segmentName, segmentValue);
        if(segmentValue.length > 0 || segmentName.length > 0){
          const alreadyExists = await SegmentSchema.find({uid: uid,$or:[{segmentName:segmentName},{segmentValue:segmentValue}]});
          if(!alreadyExists || alreadyExists.length < 1){
              console.log(alreadyExists)
              const segmentschema = new SegmentSchema({uid,segmentName, segmentValue});
              await segmentschema.save();
              res.json({msg: 'Segment saved!', status: 200})
          }else{
              res.json({msg: 'Condition or name already exists', status: 202});
          }
        }else{
            res.json({msg: 'Empty condition or segment name', status: 201});
        }
    }catch (e) {
        console.log(e);
        res.json({msg: 'Error saving', status: 203});
    }
});



module.exports = router;