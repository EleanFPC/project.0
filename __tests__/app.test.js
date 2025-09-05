const request = require('supertest');
const app = require('../app');
const { EXCHANGE_RATE } = require('../currency');

describe('ecommerce API', () => {
  test('allows creating categories and products and lists with converted prices', async () => {
    const catRes = await request(app).post('/categories').send({ name: 'Laptops' });
    expect(catRes.status).toBe(201);
    const categoryId = catRes.body.id;

    const prodRes = await request(app)
      .post('/products')
      .send({ name: 'Laptop XYZ', priceUSD: 1000, categoryId });
    expect(prodRes.status).toBe(201);

    const listRes = await request(app)
      .get('/products')
      .set('Accept', 'application/json')
      .query({ categoryId });
    expect(listRes.status).toBe(200);
    expect(listRes.body.products).toHaveLength(1);
    const product = listRes.body.products[0];
    expect(product.priceNIO).toBeCloseTo(1000 * EXCHANGE_RATE);
  });
});
