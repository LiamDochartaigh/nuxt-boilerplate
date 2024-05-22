import formData from 'form-data';
import Mailgun from 'mailgun.js';
import CurrencyToSymbolMap from  '../util/currencyMaps';
import {IOrder} from '../models/orderModel';

const config = useRuntimeConfig();
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: config.mailgun_api_key });
const organzationName = config.organization_name; 

export async function sendNewOrderEmail(to: string, order: IOrder) {
  try {
    await mg.messages.create(config.mailgun_domain, {
      from: `${organzationName} <${config.mailgun_from}>`,
      to: to,
      subject: `Your ${organzationName} Order Is Now Complete`,
      template: "new_order_template",
      'h:X-Mailgun-Variables': JSON.stringify(
        { order_details: createHTMLOrderTable(order),
          organization_name: organzationName,
          customer_details: order.customer_email

         }
      )
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email', error);
  }

}

//TODO - Total costs
function createHTMLOrderTable(order: IOrder) {
  const currencySymbol = CurrencyToSymbolMap(order.currency);
  const orderTotal = order.order_Total / 100;
  const tableStyle = `border:1px solid #e5e5e5; vertical-align:middle; width:100%; margin-bottom:40px;`;
  const thStyle = `border:1px solid #e5e5e5; vertical-align:middle; padding:12px; text-align:left;`;
  const tdStyle = `border:1px solid #e5e5e5; vertical-align:middle; padding:12px; text-align:left;`;
  let htmlTable = `<table cellspacing="0" style="${tableStyle}">
  <thead>
    <tr>
      <th style="${thStyle}">Product</th>
      <th style="${thStyle}">Price</th>
      <th style="${thStyle}">Download</th>
    </tr>
    </thead>
    <tbody>`;

  // Loop through each product and add a row to the table
  order.products.forEach(product => {
    htmlTable += `
      <tr>
        <td style="${tdStyle}">${product.name}</td>
        <td style="${tdStyle}">${currencySymbol + (product.unit_Price /100)}</td>
        <td style="${tdStyle}"></td> <!-- Blank cell for 'Download' link -->
      </tr>`;
  });

  htmlTable += `</tbody>
  <tfoot>
    <tr>
      <th scope="row" colspan="2" align="left" style="${thStyle}; border-top-width:4px">Subtotal:</th>
        <td align="left" style="${tdStyle}; border-top-width:4px">
          <span>
            <span>${currencySymbol}</span>${orderTotal}</span>
        </td>
      </tr>
      <tr>
        <th scope="row" colspan="2" align="left" style="${thStyle}">Total:</th>
        <td align="left" style="${tdStyle}">
          <span>
            <span>${currencySymbol}</span>${orderTotal}</span>
        </td>
      </tr>
  </tfoot>
  </table>`;
  return htmlTable;
}

export async function sendWelcomeEmail(to: string) {
  try {
    await mg.messages.create(config.mailgun_domain, {
      from: `${organzationName} <${config.mailgun_from}>`,
      to: to,
      subject: `Welcome To ${organzationName}`,
      template: "welcome_template",
      'h:X-Mailgun-Variables': JSON.stringify(
        { organization_name: organzationName }
      )
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email', error);
  }
}

export async function sendConfirmationEmail(to: string, confirmationToken: string) {
  try {
    await mg.messages.create(config.mailgun_domain, {
      from: `${organzationName} <${config.mailgun_from}>`,
      to: to,
      subject: 'Please Verify Your Hexeum Account',
      template: "confirmation_template",
      'h:X-Mailgun-Variables': JSON.stringify(
        { account_confirmation_link: `${config.client_url}activate/?token=${confirmationToken}`,
        organization_name: organzationName}
      )
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email', error);
  }
}

export async function sendPasswordResetEmail(to: string, resetToken: string) {
  try {
    await mg.messages.create(config.mailgun_domain, {
      from: `${organzationName} <${config.mailgun_from}>`,
      to: to,
      subject: 'Password Reset Request',
      template: "password_reset_template",
      'h:X-Mailgun-Variables': JSON.stringify(
        { password_reset_link: `${config.client_url}recovery/?token=${resetToken}`,
        organization_name: organzationName}

      )
    });
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error('Error sending email', error);
  }
}

export default {
  sendConfirmationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendNewOrderEmail
}