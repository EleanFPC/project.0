const express = require('express');
const path = require('path');
const { usdToCordobas } = require('./currency');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const categories = [];
const products = [];
let nextCategoryId = 1;
let nextProductId = 1;

app.get('/', (req, res) => {
  res.render('index', { categories });
});

app.get('/categories', (req, res) => {
  res.json({ categories });
});

app.post('/categories', (req, res) => {
  const name = req.body.name;
  if (!name) return res.status(400).json({ error: 'name required' });
  const category = { id: nextCategoryId++, name };
  categories.push(category);
  if (req.is('application/json')) {
    res.status(201).json(category);
  } else {
    res.redirect('/');
  }
});

app.get('/products', (req, res) => {
  const categoryId = parseInt(req.query.categoryId);
  let filtered = products;
  if (categoryId) {
    filtered = products.filter(p => p.categoryId === categoryId);
  }
  const result = filtered.map(p => ({
    ...p,
    priceNIO: usdToCordobas(p.priceUSD),
  }));
  if (req.accepts('html') && !req.is('application/json')) {
    const category = categories.find(c => c.id === categoryId);
    res.render('category', { category, products: result, categories });
  } else {
    res.json({ products: result });
  }
});

app.post('/products', (req, res) => {
  const { name, priceUSD, categoryId } = req.body;
  if (!name || !priceUSD || !categoryId) {
    return res.status(400).json({ error: 'name, priceUSD, categoryId required' });
  }
  const product = {
    id: nextProductId++,
    name,
    priceUSD: parseFloat(priceUSD),
    categoryId: parseInt(categoryId),
  };
  products.push(product);
  if (req.is('application/json')) {
    res.status(201).json(product);
  } else {
    res.redirect('/products?categoryId=' + product.categoryId);
  }
});

const port = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

module.exports = app;
