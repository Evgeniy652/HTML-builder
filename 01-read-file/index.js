const fs = require('fs');
const path = require('path');
const text = path.join(__dirname, '/text.txt');

const stream = new fs.ReadStream(text);
 
stream.on('readable', function(){
    const data = stream.read();
	if(data != null) {
		 console.log(data.toString());
	}
});
 
stream.on('end', function(){
    console.log("THE END");
});