var { NlpManager, NluManager, ConversationContext } = require('node-nlp');

var classifier = new NluManager({ languages: ['en'] });
async function train() {

  classifier.assignDomain('en', 'internet', 'support');
  classifier.addDocument('en', 'internet not working', 'internet');
  classifier.addDocument('en', 'no internet', 'internet');
  classifier.addDocument('en', 'slow internet', 'internet');

  classifier.assignDomain('en', 'ac', 'support');
  classifier.addDocument('en', 'AC not working ', 'ac');
  classifier.addDocument('en', 'AC stopped ', 'ac');
  classifier.addDocument('en', 'rooms not cooling', 'ac');

  classifier.assignDomain('en', 'newlead', 'leads');
  classifier.addDocument('en', 'looking for office space', 'newlead');
  classifier.addDocument('en', 'need desks', 'newlead');
  classifier.addDocument('en', 'we are looking for 5 desks in hsr layout', 'newlead');
  classifier.addDocument('en', 'form submission', 'newlead');
  classifier.addDocument('en', 'new lead', 'newlead');
  classifier.addDocument('en', 'new message', 'newlead');
  classifier.addDocument('en', 'contact form', 'newlead');

  classifier.train();
}
train();

exports.classifier = classifier;