# Order API Examples

## Create Order

Create an order from cart items. Returns `{ success: true, orderId, paymentId, total }`.

```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "items":[{"productId":74,"quantity":1}],
    "shipping":0,
    "taxes":0,
    "shippingAddress": {"name":"John","line":"123 Street"},
    "shippingPhone": "9999999999"
  }'
```

## Verify Order (mark paid)

Mark an order/payment as paid (or failed). Accepts `orderId` or `paymentId`.

```bash
curl -X POST http://localhost:3000/api/orders/verify \
  -H "Content-Type: application/json" \
  -d '{"orderId":123,"status":"paid","provider_payment_id":"manual-123"}'
```

## Calculate Order

Calculate totals for a proposed cart (returns subtotal, taxes, shipping, total).

```bash
curl -X POST http://localhost:3000/api/orders/calculate \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":74,"quantity":2}], "shipping":10, "taxes":5}'
```

## View Order (server page)

You can view an order in the app using the `order-success` page:

Open in browser:

```
http://localhost:3000/order-success?orderId=123
```

## Postman

- Import the above curl commands into Postman using `Import > Raw Text`.
- Make sure your app is running and your DB has the `orders`/`order_items`/`payments` tables created.

