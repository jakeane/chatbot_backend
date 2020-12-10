import { Router } from 'express';

const data = require('../data/NRCLex.json');

const router = Router();

const elementSum = (total, curr) => {
  if (curr) {
    return total.map((num, i) => {
      return num + curr[i];
    });
  } else {
    return total;
  }
};

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the NRC Lex API' });
});

router.get('/sentiment', (req, res) => {
  const { message } = req.body;

  const result = message
    .split(' ')
    .map((word) => {
      if (word) {
        const processed = word
          .toLowerCase()
          .match(/[a-z’]+/g)
          .join('');

        return data[processed];
      } else {
        return null;
      }
    })
    .reduce(elementSum, [0, 0, 0, 0, 0, 0, 0, 0]);

  res.json({ result });
});

export default router;
