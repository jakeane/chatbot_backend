import { Router } from 'express';

const router = Router();

const data = {};

const elementSum = (total, curr) => {
  return total.map((num, i) => {
    return num + curr[i];
  });
};

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the NRC Lex API' });
});

router.get('/sentiment', (req, res) => {
  const { message } = req.body;

  const result = message
    .split(' ')
    .map((word) => {
      const processed = word
        .toLowerCase()
        .match(/[a-z’]+/g)
        .join('');

      if (data[processed]) {
        return data[processed];
      } else {
        return [0, 0, 0, 0, 0, 0, 0, 0];
      }
    })
    .reduce(elementSum, [0, 0, 0, 0, 0, 0, 0, 0]);

  res.json({ result });
});

export default router;

/* eslint-disable comma-dangle */
const fs = require('fs');

let currWord = '';
let wordData;

const lineReader = require('readline').createInterface({
  input: fs.createReadStream('data/NRCLex.txt'),
});

// Emotions: [anger, anticipation, disgust, fear, joy, sadness, surprise, trust]

lineReader
  .on('line', (line) => {
    const currLine = line.split('\t');

    if (currWord !== currLine[0]) {
      if (wordData) {
        data[currWord] = wordData;
      }

      // eslint-disable-next-line prefer-destructuring
      currWord = currLine[0];

      wordData = [];

      wordData.push(parseInt(currLine[2], 10));
    } else if (!['positive', 'negative'].includes(currLine[1])) {
      wordData.push(parseInt(currLine[2], 10));
    }
  })
  .on('close', () => {
    data[currWord] = wordData;
    // console.log(data);
    console.log('processed');
  });
