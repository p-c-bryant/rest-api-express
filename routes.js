const express = require('express');
const router = express.Router();
const records = require('./records');

//middleware to handle async requests... to avoid repetitive code
function asyncHandler(cb){
    return async (req, res, next)=>{
      try {
        await cb(req,res, next);
      } catch(err){
        next(err);
      }
    };
}

  // Send a GET request to /quotes to READ (view) a list of quotes
router.get('/quotes', asyncHandler( async (req, res) => {
    const quotes = await records.getQuotes();
    res.json(quotes);
}));

// Send GET request to /quotes/:id to READ (view) a quote
router.get('/quotes/:id', asyncHandler(async (req, res) => {
        const quote = await records.getQuote(req.params.id);
        if(quote) {
            res.json(quote);
        } else {
            res.status(404).json({message: 'Quote not found.'});
        }
}));

// Send a GET request to /quotes/quote/random READ (view) a random quote
router.get('/quotes/quote/random', asyncHandler(async (req, res) => {
    const quote = await records.getRandomQuote();
    res.json(quote);
}));

// Send POST request to /quotes to CREATE a new quote
// router.post('/quotes', async (req, res) => {
//     try {
//         if(req.body.author && req.body.quote) {
//             const quote = await records.createQuote({
//                 quote: req.body.quote,
//                 author: req.body.author
//             });

//             res.status(201).json(quote);
//         } else {
//             res.status(400).json({message: 'Quote and author required.'});
//         }
//     } catch(err) {
//         res.status(500).json({message: err.message});
//     }
// });

router.post('/quotes', asyncHandler( async (req, res) => {
    if(req.body.author && req.body.quote) {
        const quote = await records.createQuote({
            quote: req.body.quote,
            author: req.body.author
        });

        res.status(201).json(quote);
    } else {
        res.status(400).json({message: 'Quote and author required.'});
    }
}));

// Send a PUT request to /quotes/:id UPDATE (edit) a quote
router.put('/quotes/:id', asyncHandler(async (req, res) => {
    const quote = await records.getQuote(req.params.id);
    if (quote) {
        quote.quote = req.body.quote;
        quote.author = req.body.author;

        await records.updateQuote(quote);
        res.status(204).end(); // no need to respond with data in a put request. Use end to complete request.
    } else {
        res.status(404).json({message: "Quote not found."});
    }
}));

// Send a DELETE request /quotes/:id to DELETE a quote
router.delete('/quotes/:id', asyncHandler( async (req, res, next) => {
    const quote = await records.getQuote(req.params.id);

    if (quote) {
        await records.deleteQuote(quote);
        res.status(204).end();
    } else {
        res.status(404).json({message: "Quote not found."});
    }
}));

module.exports = router;