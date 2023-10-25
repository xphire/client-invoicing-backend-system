const mongoose = require('mongoose');

const { v4: uuidv4 } = require('uuid');

const { Schema } = mongoose;

const descriptionSchema = new Schema (
    {
        description: {
            type: String,
            required : [true, 'the description field is required']
        },

        hours: {
            type: Number,
            required: [true, 'the number of hours worked is required']
        },

        ratePerHour: {
            type: Number,
            required: [true, 'hourly rate is required']


        },

        amount: {
            type: Number,
            required: [true, 'the amount field is required']
        }
    }
)

const invoiceSchema = new Schema(
    {
        clientName: {
            type: String,
            required : [true, 'the client name field is required']
        },

        invoiceNumber: {
            type: String,
            default : `${"INV" + "-" + uuidv4()}`

        },

        issueDate: {
            type: Date,
            default: Date.now()

        },
        clientAddress: {
            type: String,
            required: true
        },
        clientPhoneNumber: {
            type: String,
            required : [true, 'the phone number field is required']
        },

        descriptions: {
            type: [descriptionSchema],
            required: true
        },

        withVat: {
            type: Boolean,
            default: false
        },

        clientEmail:{
            type: String,
            validate: {
                validator: function(v) {
                  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(v);
                },
                message: props => `${props.value} is not a valid email address!`
              },
              required : [true, 'the email field is required']

        },

        url: {
            type: String
        }



    }
);


module.exports = mongoose.model('Invoice', invoiceSchema, 'Invoices')
