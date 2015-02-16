var notifications = [];


exports.generateUUID = function generateUUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
};


exports.isValidJson = function isValidJson(data) {

    try {
        JSON.parse(data);
        return true;
    } catch (e) {

    	console.log('Exception' + e);
        return false;
    }
};

	

exports.createUserMemory = function createUserMemory() {                                                                                                                                              

};


// exports.createNotificationsList = function createNotificationsList(){

// };


exports.initializeNotificationList = function initializeNotificationList(){

};




exports.createResponse =  function createResponseBody(payload){

 var response = null;
 response = JSON.stringify({ 
        messagelistid :  "test",
        data          :  payload,
        count         :  "test"
    });
};


