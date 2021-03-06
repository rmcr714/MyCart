import axios from 'axios'

export const getOrders = async (authToken) =>
  await axios.get('/api/admin/orders', {
    headers: {
      authToken,
    },
  })

export const changeStatus = async (
  orderId,
  orderStatus,
  shippingBy,
  trackingId,
  deliveredAt,
  authToken
) =>
  await axios.put(
    '/api/admin/order-status',
    { orderId, orderStatus, shippingBy, trackingId, deliveredAt },
    {
      headers: {
        authToken,
      },
    }
  )
