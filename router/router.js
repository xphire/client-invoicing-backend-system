const express = require('express');

const router = express.Router();

const { checkSchema, body , validationResult,param} = require('express-validator');

const {saveInvoiceData,fetchInvoiceData,updateInvoiceData,fetchInvoiceDocumentUrl,sendInvoiceEmail} = require('../controllers/controller');



////////////////save Invoice data route///////////////////////////////////////////
const saveInvoiceDataSchema =  {
    clientEmail: {
         notEmpty: {bail : true},
         isEmail: true,
         errorMessage : 'The clientEmail field is required'
    },
    clientName : {
        errorMessage : 'The clientName field is required',
        notEmpty : true

    },
    clientAddress : {
        notEmpty: {errorMessage : 'The clientAddress field is required'}
    },
    clientPhoneNumber : {
        notEmpty: {errorMessage:`clientPhoneNumber field is required`},
      //  isMobilePhone : {locale : 'en-NG',errorMessage:`must be a mobile phone number`},
    },
    descriptions : {
        notEmpty: { errorMessage: `Kindly provide a valid description array with each to include description of service,hours, rate per hour and amount`},
        isArray: { options: {min: 1 , max : 5},errorMessage: `the descriptions field must be an array of a minimum length of 1`},
        custom: {
            options: (value) => {
              // Check each object in the array
              for (const parameter of value)
               {
                if (!parameter.description || typeof parameter.description !== 'string') 
                {
                  throw new Error('The description field is required and must be a string');
                }
                if (!parameter.hours || typeof parameter.hours !== 'number')
                {
                  throw new Error('The hours field is required');
                }
                if (!parameter.ratePerHour || typeof parameter.ratePerHour !== 'number')
                {
                  throw new Error('The ratePerHour field is required');
                }
                if (!parameter.amount || typeof parameter.amount !== 'number')
                {
                  throw new Error('The amount field is required');
                }
                
              }
              return true; 
            },
          }
    }
};


router.post('/saveInvoiceData',
checkSchema(saveInvoiceDataSchema,['body']),(req,res,next) => {


    try {

        const result = validationResult(req);

        if (result.isEmpty())
        {
            next();
        }
        else
        {
    
            const resultArray = result.array();
            res.status(400).send({errors : resultArray.map((x) => {
                   return {
                       [String(resultArray.indexOf(x) + 1 )] : x.msg
                   }
            })
            });
        }
        
    } catch (error) {
        next(error);
    }   
},saveInvoiceData);


////fetch invoice data route//////////////////////////////////////////////////////

router.get('/fetchInvoiceData/:invoiceNumber',
 param('invoiceNumber').notEmpty().bail().withMessage('The invoice number is required').isString().bail().withMessage('the invoiceNumber must be a string').isLength({min:40,max:40}).withMessage('Invalid invoiceNumber length'),(req,res,next) => {

    try {
        
        const result = validationResult(req);

        if (result.isEmpty())
        {
            next()
        }
        else{
            const resultArray = result.array();
            res.status(400).send({errors : resultArray.map((x) => {
                   return {
                       [String(resultArray.indexOf(x) + 1 )] : x.msg
                   }
            })
            });
        }
    } catch (error) {
        console.log(error);
        next(error);
    }
 },fetchInvoiceData
);


//////Patch data i.e partial update of data fields//////////////////

router.patch('/updateInvoiceData/:invoiceNumber',param('invoiceNumber').notEmpty().bail().withMessage('The invoice number is required').isString().bail().withMessage('the invoiceNumber must be a string').isLength({min:40,max:40}).withMessage('Invalid invoiceNumber length'),(req,res,next) => {
    try {

        const result = validationResult(req);

        if (result.isEmpty())
        {
            next()
        }
        else{
            const resultArray = result.array();
            res.status(400).send({errors : resultArray.map((x) => {
                   return {
                       [String(resultArray.indexOf(x) + 1 )] : x.msg
                   }
            })
            });
        };
        
    } catch (error) {
        console.log(error);
        next(error);
    }
},updateInvoiceData);


//fetch invoice Document url Route

router.get('/fetchInvoiceDocumentUrl/:invoiceNumber',fetchInvoiceDocumentUrl);

router.post('/sendInvoiceMail', 
body('invoiceNumber').notEmpty().withMessage('The invoiceNumber field is required').bail().isString().withMessage('The invoiceNumber field must be a string').bail(),body('email').notEmpty().withMessage('The email field is required').bail().isEmail().withMessage('invalid email supplied'),(req,res,next)=>{

    try {

        
        const result = validationResult(req);

        if (result.isEmpty())
        {
            next()
        }
        else{
            const resultArray = result.array();
            res.status(400).send({errors : resultArray.map((x) => {
                   return {
                       [String(resultArray.indexOf(x) + 1 )] : x.msg
                   }
            })
            });
        };
        
    } catch (error) {
        console.log(error);
        next(error)
    }

},sendInvoiceEmail)

module.exports = router;



