var MarkovChain = require('markovchain').MarkovChain;

var starts = [ 'Elle', 'Oh', 'Je', 'Toujours' ];
for (var i = 0; i < 30; i++) {

    var start = starts[~~(Math.random() * starts.length)];

    quotes = new MarkovChain({ files: [
        'alexandrie.txt',
        'bernadette.txt',
        'chose.txt',
        'magnolia.txt',
        'toujours.txt'
    ] });

    quotes
      .start(start)
      .end(100)
      .process(function(err, s) {
        console.log(s)
      })
};
