'use strict';
//const uuidv1 = require('uuid/v1');
const {v1: uuidv1} = require('uuid');

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const kinesis = new AWS.Kinesis();
const TABLE_NAME = process.env.orderTableName;
const STREAM_NAME = process.env.orderStreamName;
module.exports.createOrder = body => {

  const order = {
	orderId : uuidv1(),	
	name : body.name, 
	address: body.address,
	productId: body.productId,
	quantity: body.quantity,
	orderDate: Date.now(),
	eventType : 'order_placed'
  }

  return order;
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};

module.exports.placeOrder = order => {
	return saveNewOrder(order).then(() => {
		return placeOrderStream(order);

	})
 }


 function saveNewOrder(order){
	const params = {
		TableName : TABLE_NAME,
		Item: order
	}
	//console.log("Try to insert in dynamo" + TABLE_NAME);
	//console.log(order);
	return dynamo.put(params).promise()
 }

 function placeOrderStream(order){
	const params = {
		Data : JSON.stringify(order),
		PartitionKey: order.orderId,
		StreamName: STREAM_NAME
	}
	console.log("Try to insert in kinesis");
	return kinesis.putRecord(params).promise();
 }
