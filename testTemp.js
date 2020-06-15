
//test data.
//insert into mongo


#use testFilter

db.contacts.insertMany([
    {
        firstname: 'saquib',
        lastname: 'shaikh',
        email: 'saquib@gmail.com',
        dob: new Date("12-02-1997"),
        dateadded: new Date('2020-10-01'),
        emc: true,
        smc: false
    },
    {
        firstname: 'saquib1',
        lastname: 'shaikh1',
        email: 'saquib1@gmail.com',
        dob: new Date("10-08-1992"),
        dateadded: new Date('2020-05-20'),
        emc: true,
        smc: true
    },
    {
        firstname: 'saquib3',
        lastname: 'shaikh3',
        email: 'saquib3@gmail.com',
        dob: new Date("19-12-1999"),
        dateadded: new Date('2020-03-29'),
        emc: false,
        smc: true
    },
    {
        firstname: 'saquib4',
        lastname: 'shaikh4',
        email: 'saquib4@gmail.com',
        dob: new Date("20-08-2000"),
        dateadded: new Date('2020-03-21'),
        emc: true,
        smc: false
    }
]);