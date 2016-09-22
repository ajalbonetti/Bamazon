var mysql = require('mysql');
var inquirer = require('inquirer');
var AsciiTable = require('ascii-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root", 
    password: "", 
    database: "BamazonDB"
});

connection.connect(function(err) {
    if (err) throw err;
});

connection.query('SELECT * FROM Products', function(err, res) {
	var table = new AsciiTable('Welcome to Bamazon');
	
		 for(var i = 0; i < res.length; i++) {
		 	table
		 	.setHeading('ID', 'Product Name', 'Price', 'Quantity')
        	.addRow(res[i].ID, res[i].ProductName, res[i].Price, res[i].StockQuantity)
        }
    console.log(table.toString());
        inquirer.prompt([{
        name: "ID",
        type: "input",
        message: "Please enter the ID of the product you would like to buy:"
    }, {
        name: "quantity",
        type: "input",
        message: "How many units would you like to purchase?"
    
    }]).then(function(answer) {
    	var userID = answer.ID;
    	var userQuantity = answer.quantity;
    	for (i = 0; i < res.length; i++) {
    		if(res[i].ID == userID) {
    			if  (userQuantity > res[i].StockQuantity) {
    			console.log('We apologize. We do not have enough of this item for that amount');
    			} else {
    			console.log('Thank you for your purchase.');
    			var newQuantity = res[i].StockQuantity - userQuantity;
    			var totalPrice = res[i].Price * userQuantity;
    			}
    		}
    	}
		connection.query("UPDATE Products SET ? WHERE ?", [{
		    StockQuantity: newQuantity
		}, {
		    ID: userID
		}], function(err, res) {
			console.log('Your total purchase was: $' + totalPrice);
		});
    	
    });

});
