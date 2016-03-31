var _				= require('underscore');
var sql				= require('mssql');
var Tokenizer 		= require('sentence-tokenizer');
var tokenizer		= new Tokenizer('Chuck');
var natural			= require('natural'),
  classifier 		= new natural.BayesClassifier(),
  wordtokenizer		= new natural.WordTokenizer();
var config 			= require('./config.js');
var sanitizeHtml 	= require('sanitize-html');
var node_ner 		= require('node-ner');
var fs 				= require('fs');
var async			= require('async');
var ner 			= new node_ner({
						classifier:	config.classifier
						});

//Initialize Collections
var 	trainingModel 		= config.trainingModel,
		salaried 			= config.salaried,
		businessman 		= config.businessman,
		salaried2words 		= config.salaried2words,
		businessman2words 	= config.businessman2words,
		recordset			= config.recordset,
		classBusinessman 	= config.classBusinessman,
		classSalaried 		= config.classSalaried,
		classNone			= config.classNone;
	
	
//Adding Documents to the New Model.
_.each(trainingModel,function(modeldata){
	classifier.addDocument(modeldata.statement,modeldata.category);
});

//Train the classifier
classifier.train();

async.waterfall([
    function(callback) {
		//console.log("1");
		recordset = config.recordset;
		callback(null, recordset ,'Complete');		
		
		/*
		sql.connect("mssql://EDW:default@123@10.226.210.147/CRMnext_Supervisory").then(function() {
		// Query 		
			new sql.Request().query('SELECT top 15 NoteItemID,Details FROM dbo.Notes').then(function(recordset) {	
				callback(null, recordset ,'Complete');
			}).catch(function(err) {
				// ... query error checks
				console.log(err);	
			});
		});
		*/		
    },
    function(sqldata, statusop, callback) {
		
		async.forEachOf(sqldata, function (value, key, callback) {
		console.log("Input Text : " + value.Details);		
	
		var date = new Date();
		console.log("Process Start Time : " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());			
			
			//Declare Variables
			var 	salCount=0,
					busCount=0,
					sal2Count=false,
					bus2Count=false,
					confPercentage=0,
					derClass,
					bayesclassifier,
					tokens,
					outputjson,
					sent;

			//Data Cleansing for the HTML tags
			
			var input = sanitizeHtml(value.Details, {
				allowedTags: [],
				allowedAttributes: []
			});

			input = input.replace(/&amp;/gi,'&').trim();
			input = input.replace(/&lt;/gi,'<').trim();
			input = input.replace(/p&gt;/gi,'>').trim();
			input = input.replace(/Â/,'').trim();
                	
			if(input.trim().length == 0 ){
                        	input = 'None None';
                	}			
	
			tokenizer.setEntry(input);

			//Tokenizing the sentence from the paragraph.
			sent = tokenizer.getSentences();
			
			// Looping through all the formed sentences.
			for(var i=0;i<sent.length;i++)
			{
				//Tokenizing the words from the sentence
				tokens = wordtokenizer.tokenize(sent[i]);
				// Looping through the generated words.
				for(j=0;j<tokens.length;j++){
					//Looping through to match the word with the salaried keywords.
					for(s=0;s<salaried.length;s++){
						//Finding String Distance using the JaroWinklerDistance API.
						var JWD = natural.JaroWinklerDistance(tokens[j].toLowerCase(),salaried[s].key.toLowerCase());
						// Checking if the word matches salaried dictionary or if the string distance id greater than 0.8.
						if(tokens[j].toLowerCase()==salaried[s].key.toLowerCase() || (parseFloat(JWD) > 0.9)){
							//Incrementing the counter.
							salCount = salCount + 1;
							}
					}		

					//Looping through to match the word with the businessman keywords.
					for(b=0;b<businessman.length;b++){
						//Finding String Distance using the JaroWinklerDistance API.
						var JWD = natural.JaroWinklerDistance(tokens[j].toLowerCase(),businessman[b].key.toLowerCase());
						// Checking if the word matches businessman dictionary or if the string distance id greater than 0.8.
						if(tokens[j].toLowerCase()==businessman[b].key.toLowerCase() || (parseFloat(JWD) > 0.9)){
							//Incrementing the counter.
							busCount = busCount + 1;
							}	
					}
				
					//Spitting the results.
					//console.log(sent[i] +" - "+ classifier.classify(sent[i]) + " - " + tokens[j] + " - " +salCount + " - " + busCount);
				}

				//Tokenizing the words from the sentence
				var tokens2words = wordtokenizer.tokenize(sent[i]);

				//Making the array lower case.
				for(var t2w=0;t2w<tokens2words.length;t2w++){
					tokens2words[t2w] = tokens2words[t2w].toLowerCase(); 
				}

				//Looping through to match the sentence with the businessman2words keywords.
				for(ss=0;ss<salaried2words.length;ss++){
							
					//checking existence in the array.
					if(tokens2words.indexOf(salaried2words[ss].key1.toLowerCase()) > -1 && tokens2words.indexOf(salaried2words[ss].key2.toLowerCase()) > -1){
						sal2Count = true;
					} else{
						//console.log("2 Words not Present in Salary2Words");
					}	
				}
				
				
				//Looping through to match the sentence with the businessman2words keywords.
				for(bb=0;bb<businessman2words.length;bb++){
				
					//checking existence in the array.
					if(tokens2words.indexOf(businessman2words[bb].key1.toLowerCase()) > -1 && tokens2words.indexOf(businessman2words[bb].key2.toLowerCase()) > -1){
						bus2Count = true;
					} else{
						//console.log("2 Words not Present in Business2Words");
					}	
				}

			}
			
			//Deriving the Confidence Percentage and Class.
			//---------------------------------------------
			bayesclassifier = classifier.classify(config.statement);
			if(bayesclassifier.toLowerCase() == classBusinessman.toLowerCase()){
				derClass = classBusinessman; 
				if(bus2Count == true && parseInt(busCount) > 0){
					confPercentage = config.confidencePercentage.ninety; 
				} else if (bus2Count == true && parseInt(busCount) == 0) {
					confPercentage = config.confidencePercentage.sixty;
				} else if (bus2Count == false && parseInt(busCount) > 0)  {
					confPercentage = config.confidencePercentage.thirty;
				} else if (bus2Count == false && parseInt(busCount) == 0 && sal2Count == false && parseInt(salCount) == 0 ) {
					confPercentage = config.confidencePercentage.zero;
					derClass = classNone;
				} else if (sal2Count == true && parseInt(salCount) > 0) {
					confPercentage = config.confidencePercentage.seventy;
					derClass = classSalaried;
				} else if (sal2Count == true && parseInt(salCount) == 0) {
					confPercentage = config.confidencePercentage.forty;
					derClass = classSalaried;
				} else if (sal2Count == false && parseInt(salCount) > 0)  {
					confPercentage = config.confidencePercentage.twenty;
					derClass = classSalaried;
				} else if (sal2Count == false && parseInt(salCount) == 0) {
					confPercentage = config.confidencePercentage.zero;
					derClass = classNone;
				}
			} else if (bayesclassifier.toLowerCase() == classSalaried.toLowerCase()) {
				derClass = classSalaried;
				if(sal2Count==true && parseInt(salCount) > 0){ 
					confPercentage = config.confidencePercentage.ninety; 
				} else if (sal2Count==true && parseInt(salCount) == 0) {
					confPercentage = config.confidencePercentage.sixty;
				} else if (sal2Count==false && parseInt(salCount) > 0)  {
					confPercentage = config.confidencePercentage.thirty;
				} else if (sal2Count==false && parseInt(salCount) == 0 && bus2Count ==false && parseInt(busCount) == 0 ) {
					confPercentage = config.confidencePercentage.zero;
					derClass = classNone;
				} else if (bus2Count == true && parseInt(busCount) > 0) {
					confPercentage = config.confidencePercentage.seventy;
					derClass = classBusinessman;
				} else if (bus2Count == true && parseInt(busCount) == 0) {
					confPercentage = config.confidencePercentage.forty;
					derClass = classBusinessman;
				} else if (bus2Count == false && parseInt(busCount) > 0)  {
					confPercentage = config.confidencePercentage.twenty;
					derClass = classBusinessman;
				} else if (bus2Count == false && parseInt(busCount) == 0) {
					confPercentage = config.confidencePercentage.zero;
					derClass = classNone
				}		
			}			

			
			fs.writeFile(config.filename + "_" + value.NoteItemID + "_" + key, input, function(err) {
				if(err) {
					return console.log(err);
					}
					
				ner.fromFile(config.filename + "_" + value.NoteItemID + "_" + key, function(entities) {
					
					fs.unlink(config.filename + "_" + value.NoteItemID + "_" + key);
					
					outputjson = "{\"NoteItemID\":\"" + value.NoteItemID + "\",\"input\":\"" + input + "\",\"BC\":\"" + bayesclassifier + "\",\"DC\":\"" + derClass + "\",\"CP\":\"" + confPercentage + "\",\"NER\":" + JSON.stringify(entities) + "}\n";
					
					fs.appendFile(config.output, outputjson, function(err) {
					if(err) {
						return console.log(err);
					}
					
					var date1 = new Date();
					console.log("Process End Time : " + date1.getDate() + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() + " " + date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds());

					callback();

					});	

				});
						
			});			
		}, function (err) {
			if (err) console.error(err.message);
			// configs is now a map of JSON data
			// Write data to JSON file from array
		})
    callback(null, 'three');
    },
    function(arg1, callback) {
        // arg1 now equals 'three'
        callback(null, 'done');
    }
], function (err, result) {
    // result now equals 'done'
});