import axios from 'axios'

export const userCart = async (cart, authToken) =>
  await axios.post(
    `/api/user/cart`,
    { cart },
    {
      headers: {
        authToken,
      },
    }
  )

export const getUserCart = async (authToken) =>
  await axios.get(`/api/user/cart`, {
    headers: {
      authToken,
    },
  })

export const saveAddress = async (authToken, addresses) =>
  await axios.post(
    `/api/user/address`,
    { addresses },
    {
      headers: {
        authToken,
      },
    }
  )

export const deleteAddress = async (authToken, data) =>
  await axios.post(
    `/api/user/deleteaddress`,
    { data },
    {
      headers: {
        authToken,
      },
    }
  )

export const applyCoupon = async (coupon, authToken) => {
  return await axios.post(
    `/api/user/cart/coupon`,
    { coupon },
    {
      headers: {
        authToken,
      },
    }
  )
}

export const createOrder = async (order, authToken) => {
  return await axios.post(
    `/api/user/order`,
    { order },
    {
      headers: {
        authToken,
      },
    }
  )
}

export const emptyUserCart = async (authToken) => {
  return await axios.delete(`/api/user/cart`, {
    headers: {
      authToken,
    },
  })
}

export const getUserOrders = async (authToken) =>
  await axios.get(`/api/user/orders`, {
    headers: {
      authToken,
    },
  })

export const getTrackingDetails = async (authToken, orderId) =>
  await axios.get(`/api/user/tracking/${orderId}`, {
    headers: {
      authToken,
    },
  })

export const getWishList = async (authToken) =>
  await axios.get(`/api/user/wishlist`, {
    headers: {
      authToken,
    },
  })

export const removeWishList = async (productId, authToken) =>
  await axios.put(
    `/api/user/wishlist`,
    { productId },
    {
      headers: {
        authToken,
      },
    }
  )

export const addToWishList = async (productId, authToken) =>
  await axios.post(
    `/api/user/wishlist`,
    { productId },
    {
      headers: {
        authToken,
      },
    }
  )

export const createCodOrder = async (order, authToken) =>
  await axios.post(
    `/api/user/cod-order`,
    { order },
    {
      headers: {
        authToken,
      },
    }
  )
