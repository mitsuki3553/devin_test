const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

let todos = [];
let nextId = 1;

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Task text is required' });
  }
  
  if (text.trim().length === 0) {
    return res.status(400).json({ error: 'Task text cannot be empty' });
  }
  
  if (text.length > 100) {
    return res.status(400).json({ error: '100文字以内で入力してください' });
  }
  
  if (/\s{2,}/.test(text)) {
    return res.status(400).json({ error: '空白は続けて入力できません' });
  }
  
  const newTodo = {
    id: nextId++,
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
