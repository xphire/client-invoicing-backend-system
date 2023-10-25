require('dotenv').config();

const fs = require('fs');

const path = require('path');

const puppeteer = require('puppeteer');

const Handlebars = require('handlebars');


Handlebars.registerHelper('multiply', function(value, multiplier) {
    return value * multiplier;
});


Handlebars.registerHelper('dollarize', function(value) {

    if(value === undefined)
    {
        return '';
    }
    else
    {
        return `${'$' + value}`;
    }
    
});


Handlebars.registerHelper('empty', function(value) {

    const revalue = String(value);
    const regex = /NaN/g;
    if (revalue.match(regex) || value === undefined || !value || value === null)
    {
        return ''
    }
    else
    {
        return value;
    }
});




async function generatePDF(query){


    try {
  
      // Read the HTML template file
    const templateHtml = fs.readFileSync(path.join(__dirname,'template.html'), 'utf-8');
  
    // Compile the template using Handlebars
    const template = Handlebars.compile(templateHtml);
  
  
    // Define the dynamic data for the template

    //const data = query;
  /*  const data = 
    {
        "clientEmail" : query.clientEmail,
        "withVat" : query.withVat,
        "clientName" : query.clientName,
        "clientAddress" : query.clientAddress,
        "clientPhoneNumber" : query.clientPhoneNumber,
        "descriptions" : query.descriptions
    };
 */

const data = query;

data.totalAmount = data.descriptions.reduce((total,x) => total + (x.hours * x.ratePerHour),0).toFixed(2);


let taxAmount;

if (data.withVat)
{
    taxAmount = (0.075 * data.totalAmount).toFixed(2);
}
else
{
    taxAmount = 0.00;
};


data.taxAmount = taxAmount;


data.amountDue = (data.totalAmount - data.taxAmount).toFixed(2);






  /*
  
     // Calculate the total quantity and total price
     const totalQuantity = data.items.reduce((acc, item) => acc + item.quantity, 0);
     const totalPrice = data.items.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
   
     // Add the total quantity and total price to the data
     data.totalQuantity = totalQuantity;
     data.totalPrice = totalPrice;
  
     */
    // Render the template with the data
    const renderedHtml = template(data,{allowProtoPropertiesByDefault : true});
  
    const browser = await puppeteer.launch({headless:"new"});
    const page = await browser.newPage();
  
  
    // Set the HTML content of the page
    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });
  
  
     // Generate PDF from the page
    const buffer =  await page.pdf({
      format: 'A4',
      printBackground: true
    });
  
    //console.log('PDF generated successfully.');

    await browser.close();

    return buffer;

      
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  
  
  };
  
  
module.exports = generatePDF;