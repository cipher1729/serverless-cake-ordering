'use strict';
const orderManager = require('./orderManager');

function createResponse(statusCode, message) {

  //console.log(message);
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
  return response;
}

module.exports.createOrder = async event => {
  console.log(event)
  const body = event;
  const order = orderManager.createOrder(body);

   return orderManager.placeOrder(order).then(() => {

    return createResponse(200, order);
  }).catch(error => {

    //console.log("Error :(");
    return createResponse(400, error);
  })
  
};
