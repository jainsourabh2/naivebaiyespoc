var Tokenizer 	= require('sentence-tokenizer');
var tokenizer	= new Tokenizer('Chuck');
var natural	= require('natural'),
  classifier 	= new natural.BayesClassifier(),
  wordtokenizer	= new natural.WordTokenizer();
var config 	= require('./config.js');
var tokens;
var salCount=0;
var busCount=0;

//console.log(config.trainingModel.category[0]);
var trainingModel = config.trainingModel;
var salaried = config.salaried;
var businessman = config.businessman;
//console.log(salaried.length);
//console.log(businessman.length);
//console.log(trainingModel.length);
for(var i=0;i<trainingModel.length;i++)
{
//console.log(trainingModel[i].category);
//console.log(trainingModel[i].statement);
	classifier.addDocument(trainingModel[i].statement, trainingModel[i].category);
}

classifier.train();

//var sent = "He is working in amazon. His annual turnover is 20 lacs per aaanum."
tokenizer.setEntry("He is workin in amazon. His annual turnover is 20 crore per annum. He loves shopping. He has a factory");
var sent = tokenizer.getSentences();
for(var i=0;i<sent.length;i++)
{
	tokens = wordtokenizer.tokenize(sent[i]);
	console.log(tokens.length);
	salCount = 0;
	busCount = 0;
	for(j=0;j<tokens.length;j++){
		for(s=0;s<salaried.length;s++){
			var JWD = natural.JaroWinklerDistance(tokens[j],salaried[s].key);
			if(tokens[j]==salaried[s].key || (parseFloat(JWD) > 0.8)){
				//console.log(salCount);
				salCount = salCount + 1;
				}
		}		
		for(b=0;b<businessman.length;b++){
			if(tokens[j]==businessman[b].key){
				busCount = busCount + 1;
				}	
		}
		console.log(sent[i] +" - "+ classifier.classify(sent[i]) + " - " + tokens[j] + " - " +salCount + " - " + busCount);
	}
}
