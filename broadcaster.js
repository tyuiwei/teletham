var chalk = require('chalk');
var telegram = require('telegram-bot-api');
var fs = require('fs');
var admin = require('./admin')
var logger = require('./logger')
var api = new telegram({
    token: '111443989:AAG2biy7U2_HuEp-akem07XtFNnbpHcDL20',
    updates: {
        enabled: true
    }
});

var studentsInfoFilepath =  './private/students_info.json';
var students =  JSON.parse(fs.readFileSync(studentsInfoFilepath).toString()); //OBJECT


var houses = {};

populateHouseList();

function populateHouseList() {
    houses.aviur = []
    houses.amaranth = []
    houses.varjo = []
    houses.levian = []
    houses.arete = []
    houses.nidhogg = []
    Object.keys(students).forEach(function (student) {
	var house = students[student].house
	houses[house].push(student)
});
}


function broadcast(msg, house) {
    students =  JSON.parse(fs.readFileSync(studentsInfoFilepath).toString());
    populateHouseList();
	house = house.replace(/ /g,'');
    if (!admin.isValidHouse(house) && house != "all") {
    	console.log(chalk.yellow("invalid house:", house))
        return "invalid house"
    }
    if (house != "all") {
        houses[house].forEach(function(num) {
        	broadcastObj = {}
        	broadcastObj.chat_id = num;
        	broadcastObj.text = msg;
            api.sendMessage(broadcastObj, function(err, data) {
                if (err) {
               		console.log(chalk.red("Error Broadcasting Text Message: ") + err);
               	}
            });

            logger.logMessage("broadcastMessage", broadcastObj);
    		logger.storeLogs();
        });
        return null;
    } else {
        Object.keys(houses).forEach(function(house) {
            houses[house].forEach(function(num) {
                broadcastObj = {}
	        	broadcastObj.chat_id = num;
	        	broadcastObj.text = msg;
	            api.sendMessage(broadcastObj, function(err, data) {
                	if (err) {
                		console.log(chalk.red("Error Broadcasting Text Message: ") + err);
                	}
                });

                logger.logMessage("broadcastMessage", broadcastObj);
	    		logger.storeLogs();
            });
        })
        return null;
    }
}

module.exports = {
    broadcast: broadcast,
}