var Tokenizer 	= require('sentence-tokenizer');
var tokenizer	= new Tokenizer('Chuck');
var natural	= require('natural'),
  classifier 	= new natural.BayesClassifier(),
  wordtokenizer	= new natural.WordTokenizer();
var Ngrams	= natural.NGrams;
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

//tokenizer.setEntry("<BR> He runs a garment factory. His annual salary is 5 crores. He has a son and a daughter. He has an account with ICICI. He is retired RBI officer. He is a partner with milan supari");

//tokenizer.setEntry("&nbsp;Family Size: 2,Antointte nagpal &amp; her son...");
tokenizer.setEntry("Cust touches senior citizen level; <BR> Cust still working in potans company. <BR> Daughter going abroad on jan 09; <BR>.");
//console.log(Ngrams.bigrams("How are you?"));

var sent = tokenizer.getSentences();
for(var i=0;i<sent.length;i++)
{
	console.log((sent[i]));
	sent[i] = sent[i].replace('<BR>','').trim();
	sent[i] = sent[i].replace('&nbsp;','').trim();
	sent[i] = sent[i].replace('&amp;','').trim();
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
