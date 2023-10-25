const Invoice = require('../model/invoice');

const uploadFile = require('../s3Upload');

const sendMail = require('../mailer');

const saveInvoiceData = async (req,res,next) => {
      // This collects the invoice information
      // saves to mongodb atlas without the s3 link yet
    
      try {

       const neededDataPoints = Object.keys(Invoice.schema.paths);

       const suppliedDataPoints = Object.keys(req.body);

       for (let index = 0; index < Object.keys(req.body).length; index++) {
                
              if (!neededDataPoints.includes(suppliedDataPoints[index]))
              {
                return res.status(400).send({"status" : "failed", "error" : `The ${suppliedDataPoints[index]} field is not needed`});
              }
        
       }

        const data = new Invoice(req.body);

        const save =   await data.save();

        return res.status(201).send({"status" : "success","message" : `Invoice ${save.invoiceNumber} successfully saved`});

      } catch (error) {
        console.log(error);
        return next(error);
      }

};


const fetchInvoiceData = async (req,res,next) => {
     
    //get the invoice information given the invoice ID

    try {

        const query = req.params.invoiceNumber;
        const data = await  Invoice.findOne({invoiceNumber : query});

        if (!data)
        {
           return res.status(404).send({"status" : "failed","invoiceData" : `${req.params.invoiceNumber} data not found or does not exist in DB`})
        }

        return res.status(200).send({"status" : "success","invoiceData" : data})


    } catch (error) {
        console.log(error);
       return next(error);
    }

};


const updateInvoiceData = async (req,res,next) => {
     
    //A patch method to update invoice data

    try {

        //check if request body contains fields that could be updated

        const possibleFields = ['descriptions','clientName','clientAddress','clientPhoneNumber','clientEmail','withVat'];

        const suppliedFields = Object.keys(req.body);

        for (let index = 0; index < suppliedFields.length; index++) {
            
            if (!possibleFields.includes(suppliedFields[index]))
            {
                return res.status(400).send({"status" : "failed", "error" : `The ${suppliedFields[index]} field is not needed or cannot be updated`});
            }
            
        };

        const query = {invoiceNumber : req.params.invoiceNumber};

        const options = {
            "new" : true
        }

        const update = await Invoice.findOneAndUpdate(query,req.body,options);

        return res.status(202).send({"status": "success","data" : update});

    } catch (error) {
       console.log(error);
       return next(error);
    }


}


const fetchInvoiceDocumentUrl = async (req,res,next) => {


    try {

         // accepts an invoice ID
     const query = {invoiceNumber : req.params.invoiceNumber};

     // fetch invoice info from mongodb

     const invoice = await Invoice.findOne(query);

     //check if invoice does not previously exist

     if (Object.keys(invoice._doc).includes('url'))
     {
        return res.status(302).send({"status": "success","msg" : "invoice already exists","data" : invoice.url}); 
     };

     // creates the pdf file and uplaod to sws s3

     const s3Url = await uploadFile(invoice);

     //now upload the s3Url to the database

     await Invoice.findOneAndUpdate(query,{url : s3Url});

     //return url to client

     return res.status(201).send({"status": "success","msg" : "invoice creation successful","data" : s3Url});

     // shorten with tinyurl api
     // send back shortened URL
        
    } catch (error) {

       console.log(error);
       return next(error);
        
    }
   
};

const sendInvoiceEmail = async (req,res,next) => {
    
    try {

     // accepts an invoice ID
     const query = {invoiceNumber : req.body.invoiceNumber};

     // fetch invoice info from mongodb

     const invoice = await Invoice.findOne(query);

     const invoiceUrl  = invoice._doc.url;

     //check if invoice number previously exists

     if (!invoice || !invoiceUrl)
     {
        return res.status(404).send({"status": "failed","msg" : "wrong invoice number supplied"}); 
     };

    


     await sendMail(req.body.email,`${'Karagandy Technology Invoice ' + req.body.invoiceNumber}`,invoiceUrl,req.body.invoiceNumber);

     return res.status(200).send({"status" : "success","message" : `invoice ${' ' + req.body.invoiceNumber} successfully sent to ${req.body.email}`});

    } catch (error) {
         next(error);
    }
};

module.exports = {saveInvoiceData,fetchInvoiceData,updateInvoiceData,fetchInvoiceDocumentUrl,sendInvoiceEmail};