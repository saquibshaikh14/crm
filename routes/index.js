const express = require('express');
const router = express.Router();
const session = require('express-session');
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');
const Customer = require('../models/customer');

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('home'));

// Dashboard
// ensureAuthenticated,
var sess;
router.get('/customer',ensureAuthenticated, (req, res) => {
	sess = req.session;
	sess.user = req.user;
	Customer.find({uid:sess.user._id},function(err,found){
		if(found){
			res.render('customer',{
				user:sess.user,
				customers:found
			})
		}else{
			res.send(err);
		}
	});

});
router.get('/addCustomer', ensureAuthenticated, (req, res) => res.render('addCustomer'));

router.post('/addCustomer', (req, res) => {
  const { firstName, lastName, email, address, state, pin, country, mobile, gender, dob, source, emc, smc } = req.body;
  let errors = [];

  if (!firstName || !lastName || !email || !address || !state || !pin || !country || !mobile || !gender || !dob || !source || !emc || !smc) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (errors.length > 0) {
    res.render('addCustomer', {
      errors,
      firstName, 
	  lastName,
	  email,
	  address,
	  state,
	  pin,
	  country,
	  mobile,
	  gender,
	  dob,
	  source,
	  emc,
	  smc
    });
  } else {
	    sess = req.session;
	    sess.user = req.user;
	    uid=sess.user._id;
        const newCustomer = new Customer({
		  uid,
          firstName, 
		  lastName, 
		  email,
		  address,
		  state, 
		  pin, 
	      country,
	      mobile, 
		  gender,
		  dob,
		  source,
	      emc,
		  smc
        });
            newCustomer.save().then(customer => {
                req.flash(
                  'success_msg',
                  'New Customer added'
                );
                res.redirect('/customer');
              }).catch(err => console.log(err));
      }
    });


		//segment
	
		router.get('/customer/segment',ensureAuthenticated, (req, res) => {
			sess = req.session;
			sess.user = req.user;
			var method = req.query.method.toLowerCase();
			
			switch(method){
				case 'date_added': method = 'dateAdded';
					break;
				case 'first_name': method = 'firstName';
					break;
				case 'last_name': method = 'lastName';
					break;
				case 'date_of_birth': method = 'dob';
					break;
				case 'order_date': method = 'orderDate';
					break;
				case 'contact': method='mobile';
					break;
				case 'email_sub': method = 'emc';
					break;
				case 'sms_sub': method= 'smc';
			}
	

			if(['email', 'firstName', 'lastName', 'mobile', 'state', 'city', 'country', 'zip', 'tag', 'product', 'emc', 'smc'].includes(method)){
				var val = req.query.val;
				if(method == 'emc'){
					val = (val=='yes')?'emc':'';
				}
				if(method == 'smc'){
					val = (val=='yes')?'smc':'';
				}
				Customer.find({uid:sess.user._id, [method]: val},function(err,found){
				
					if(found){
						return res.render('customer',{
							user:sess.user,
							customers:found
						});	
					}else{
						res.send(err);
					}
				}).collation( { locale: 'en_US', strength: 2 } );
			
			} else if(['dob', 'orderDate', 'dateAdded'].includes(method)){
				var dinit = req.query.dinit;
				var dfinal = req.query.dfinal;
				Customer.find({uid:sess.user._id, [method]:{$gte: new Date(dinit), $lte: new Date(dfinal)}}, function(err, found){
				
					if(found){
						return res.render('customer',{
							user:user,
							customers:found
						});	
					}else{
						res.send(err);
					}
				});
			}else{
				res.send('Error');
			}		

		});

//contact edit'
	router.get('/customer/contact/edit/:id',ensureAuthenticated, (req, res)=>{
		Customer.findOne({_id: req.params.id}, function(err,found){
			//console.log(err,found)
			if(found){
				return res.render('editcontact', {found})
			}
			return res.send('error');
		});
	});
//update
router.post('/update/customer', ensureAuthenticated,(req, res)=>{

	const {ctId, firstName, lastName, email, address, state, pin, country, mobile, gender, dob, source, emc, smc} = req.body;
	const update = {
		firstName: firstName,
		lastName: lastName,
		email: email,
		address: address,
		state: state,
		pin: pin,
		country: country,
		mobile: mobile,
		gender: gender,
		dob: dob,
		source: source,
		emc: emc,
		smc: smc
	};
	Customer.findOneAndUpdate({_id: ctId}, update, {new: true}, function(err, found){
		if(found){
			req.flash(
				'success_msg',
				'Updated successfully'
			);
			res.redirect('/customer')
		}else {
			res.send('Error');
		}
	});

});

module.exports = router;
