import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import Address from '../components/cards/Address'
import {
  getUserCart,
  saveAddress,
  applyCoupon,
  createCodOrder,
  emptyUserCart,
} from '../functions/user'
import _ from 'lodash'

const Checkout = ({ history }) => {
  //redux state
  const { user, cart, userAddress } = useSelector((state) => ({
    ...state,
  }))

  const couponStatus = useSelector((state) => state.coupon)
  const dispatch = useDispatch()

  //coupon
  const [coupon, setCoupon] = useState('')
  const [totalAfterDiscount, setTotalAferDiscount] = useState(0)
  const [discountError, setDiscountError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')

  //address states
  //first Name
  const [firstName, setFirstName] = useState('')
  //last Name
  const [lastName, setLastName] = useState('')
  //Address
  const [address, setAddress] = useState('')
  //zip
  const [zip, setZip] = useState('')
  //city
  const [city, setCity] = useState('')
  //state
  const [state, setState] = useState('')
  //phone
  const [phone, setPhone] = useState('')
  //email
  const [email, setEmail] = useState(user.email)
  //type of address
  const [addressType, setAddressType] = useState('home')
  //address saved
  const [addressSaved, setSavedAddress] = useState(false)
  //user addresses
  const [savedUserAddresses, setSavedUserAddresses] = useState([])

  //received cart state
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)

  //payment states
  const [card, setCard] = useState(true)
  const [cod, setCod] = useState(false)

  useEffect(() => {
    if (cart.length == 0) {
      history.push('/')
    }

    getUserCart(user.token)
      .then((res) => {
        if (res == null) {
          toast.error('oops something wrong happened pls go bakc and try again')
        } else {
          console.log(res.data)
          if (res.data.addresses !== null) {
            setSavedUserAddresses(res.data.orderedBy.addresses)
          }
          setProducts(res.data.products)
          setTotal(res.data.cartTotal)
        }
      })
      .catch((error) => toast.error('something happened pls go back'))
  }, [addressSaved])

  const checkPin = async () => {
    console.log(zip)
    if (zip.length < 6) {
      toast.error('zip code should be 6 characters long')
      return
    }
    // const back = `https://cors-anywhere.herokuapp.com/`
    const { data } = await axios.post(`/api/zip`, { zip })
    console.log(data)
    if (data.Status === 'Success') {
      setCity(data.PostOffice[0].Division)
      setState(data.PostOffice[0].State)
    } else if (data.Status == 'Error') {
      toast.error('Please provide a valid pin code')
    } else {
      toast.error('something went wrong pls try again')
    }
  }

  const saveAddressToDb = (e) => {
    e.preventDefault()

    const addressToSave = {
      firstName,
      lastName,
      address,
      zip,
      state,
      city,
      phone,
      email,
      addressType,
    }
    saveAddress(user.token, addressToSave).then((res) => {
      if (res == null) {
        toast.error('oops something went wrong, pls try again')
      } else if (res.data.message == 'address successfully saved') {
        toast.success(res.data.message)
        dispatch({
          type: 'CHECKOUT_ADDRESS_SAVED',
          payload: {
            firstName,
            lastName,
            address,
            zip,
            state,
            city,
            phone,
            email,
            addressType,
          },
        })
        setSavedAddress(!addressSaved)
      } else {
        toast.error(res.data.message)
      }
    })
  }

  //apply coupon
  const couponApply = () => {
    console.log('hidsds', coupon)
    applyCoupon(coupon, user.token)
      .then((res) => {
        console.log('Response applied', res.data)
        if (res.data.err) {
          setDiscountError(res.data.err)
          setTotalAferDiscount(0)
          dispatch({ type: 'COUPON_APPLIED', payload: false })
        }
        if (res.data.totalAfterDiscount) {
          setTotalAferDiscount(res.data.totalAfterDiscount)
          setCouponSuccess('coupon applied')
          dispatch({ type: 'COUPON_APPLIED', payload: true })
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const placeOrder = () => {
    if (cod == true) {
      console.log('cod')
      createCodOrder(
        {
          shippingAddress: userAddress,
          paymentMethod: 'cash on delivery',
          couponApplied: couponStatus,
        },
        user.token
      ).then((res) => {
        if (res.data.ok) {
          //empty cart from localstorage
          if (typeof window !== 'undefined') localStorage.removeItem('cart')
          //empty cart from redux
          dispatch({
            type: 'ADD_TO_CART',
            payload: [],
          })
          //reset coupon to false
          dispatch({ type: 'COUPON_APPLIED', payload: false })

          //empty cart from backend
          emptyUserCart(user.token)
        }
        history.push('/user/history')
        console.log(res)
      })
    } else {
      history.push('/payment')
    }
  }
  return (
    <>
      <br />

      <section className='mt-5 ml-4'>
        <div className='row'>
          <div className='col-lg-8 mb-4'>
            <div className='card wish-list pb-1'>
              <div className='card-body'>
                <form onSubmit={saveAddressToDb}>
                  <h5 className='mb-2'>Billing details</h5>

                  <div className='row'>
                    <div className='col-lg-6'>
                      <div className='md-form md-outline mb-0 mb-lg-4'>
                        <input
                          type='text'
                          name='firstName'
                          className='form-control mb-0 mb-lg-2'
                          title='Only alphabets are allowed'
                          pattern='^[A-Za-z]+$'
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                        <label for='firstName'>
                          First name<sup>*</sup>
                        </label>
                      </div>
                    </div>

                    <div className='col-lg-6'>
                      <div className='md-form md-outline'>
                        <input
                          type='text'
                          name='lastName'
                          className='form-control'
                          title='Only alphabets are allowed'
                          pattern='^[A-Za-z]+$'
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                        <label htmlFor='lastName'>
                          Last name<sup>*</sup>
                        </label>
                      </div>
                    </div>
                  </div>
                  {/* <div className='d-flex flex-wrap'>
                  <div className='select-outline position-relative w-100'>
                    <select className='mdb-select md-form md-outline form-control'>
                      <option value='' disabled selected>
                        Choose your option
                      </option>
                      <option value='1'>Option 1</option>
                      <option value='2'>Option 2</option>
                      <option value='3'>Option 3</option>
                    </select>
                    <label>Country</label>
                  </div>
                </div>
                <br /> */}

                  <div className='md-form md-outline mt-0'>
                    <input
                      type='text'
                      name='address1'
                      // placeholder='House number and street name'
                      className='form-control'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                    <label htmlFor='address1'>
                      House number and street name<sup>*</sup>
                    </label>
                  </div>
                  <br />

                  {/* <div className='md-form md-outline'>
                    <input
                      type='text'
                      name='address2'
                      // placeholder='Apartment, suite, unit etc. (optional)'
                      className='form-control'
                    />
                    <label for='address2'>
                      Apartment, suite, unit etc. (optional)
                    </label>
                  </div> */}

                  <div className='md-form md-outline mb-2'>
                    <input
                      type='text'
                      name='zip'
                      className='form-control'
                      pattern='^[1-9][0-9]{5}$'
                      title='Invalid pincode'
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      required
                    />
                    <label htmlFor='zip'>
                      Postcode / ZIP<sup>*</sup>
                    </label>
                  </div>

                  <button
                    type='button'
                    className='text-center btn btn-info btn-raised btn-sm'
                    disabled={!zip}
                    onClick={() => checkPin()}
                  >
                    Check pincode
                  </button>
                  <br />
                  <br />

                  <div className='md-form md-outline'>
                    <input
                      type='text'
                      name='city'
                      className='form-control'
                      //   pattern='^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$'
                      //   title='please provide a valid city name'
                      readonly='readonly'
                      value={city}
                    />
                    <label htmlFor='city'>Town / City</label>
                  </div>
                  <br />
                  <div className='md-form md-outline my-0'>
                    <input
                      type='text'
                      name='companyName'
                      className='form-control mb-0'
                      readonly='readonly'
                      value={state}
                    />
                    <label htmlFor='companyName'>state</label>
                  </div>

                  <div className='md-form md-outline'>
                    <input
                      type='tel'
                      name='phone'
                      className='form-control'
                      pattern='^[6-9]\d{9}$'
                      title='Please provide  a valid number'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                    <label htmlFor='phone'>
                      Phone<sup>*</sup>
                    </label>
                  </div>

                  <div className='md-form md-outline'>
                    <input
                      type='email'
                      name='email'
                      className='form-control'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor='email'>
                      Email address<sup>*</sup>
                    </label>
                  </div>
                  <br />
                  <div class='d-flex flex-wrap'>
                    <div class='select-outline position-relative w-100'>
                      <select
                        class='mdb-select md-form md-outline form-control'
                        value={addressType}
                        onChange={(e) => setAddressType(e.target.value)}
                      >
                        <option defaultValue='' disabled selected>
                          Select an Address Type
                        </option>
                        <option defaultValue='home'>home</option>
                        <option defaultValue='office'>office</option>
                      </select>
                      <label>Address type</label>
                    </div>
                  </div>
                  <br />
                  <div className='form-check pl-0 mb-4 mb-lg-0'>
                    <button
                      type='submit'
                      className='text-center btn btn-primary btn-raised '
                      disabled={
                        !(zip && city && state && address && phone && email)
                      }
                    >
                      save Address
                    </button>
                  </div>
                  <br />
                  <p className='text-primary mb-0'>
                    <sup>*</sup> required fields
                  </p>
                </form>
              </div>
            </div>
          </div>

          <div className='col-lg-4'>
            <div className='card mb-4'>
              <div className='card-body'>
                <h5 className='mb-2'>Order Summary</h5>
                <hr />

                <ul className='list-group list-group-flush'>
                  {products.length > 0 ? (
                    products.map((c, i) => (
                      <div key={i}>
                        <li className='list-group-item d-flex justify-content-between align-items-center border-0 px-0 pb-0'>
                          {c.product.title} ({c.color})&nbsp;x {c.count}
                          <span>${c.price * c.count}</span>
                        </li>
                      </div>
                    ))
                  ) : (
                    <li>No items in cart, add some items to show here</li>
                  )}
                  <li className='list-group-item d-flex justify-content-between align-items-center px-0'>
                    Shipping
                    {products.length > 0 ? (
                      <span>free</span>
                    ) : (
                      <span>no items </span>
                    )}
                  </li>
                  <li className='list-group-item d-flex justify-content-between align-items-center border-0 px-0 mb-3'>
                    <div>
                      <strong>The total amount of</strong>
                      <strong>
                        <p className='mb-0'>(including VAT)</p>
                      </strong>
                    </div>
                    <span>
                      <strong>{total ? total : 'no items in cart'}</strong>
                    </span>

                    {totalAfterDiscount > 0 && (
                      <>
                        <div>
                          <br />
                          <br />
                          <h5 className='text-success'>
                            New price after discount
                          </h5>
                        </div>
                        <span>
                          <br />
                          <h5 className='text-danger'>${totalAfterDiscount}</h5>
                        </span>
                      </>
                    )}
                  </li>
                </ul>

                <button
                  type='button'
                  className='text-center btn btn-primary btn-raised btn-block'
                  disabled={
                    savedUserAddresses.length == 0 || _.isEmpty(userAddress)
                  }
                  // onClick={() => history.push('/payment')}
                  onClick={() => {
                    placeOrder()
                  }}
                >
                  Place Order
                </button>
              </div>
            </div>

            <div className='card mb-4'>
              <div className='card-body'>
                <a
                  className='dark-grey-text d-flex justify-content-between'
                  data-toggle='collapse'
                  href='#collapseExample'
                  aria-expanded='false'
                  aria-controls='collapseExample'
                >
                  Add a discount code (optional)
                  <span>
                    <i className='fas fa-chevron-down pt-1'></i>
                  </span>
                </a>

                <div className='collapse' id='collapseExample'>
                  <div className='mt-3'>
                    <div className='md-form md-outline mb-0'>
                      <input
                        type='text'
                        id='discount-code'
                        className='form-control font-weight-light'
                        placeholder='Enter discount code'
                        value={coupon}
                        onChange={(e) => {
                          setCoupon(e.target.value)
                          setDiscountError('')
                          setCouponSuccess('')
                        }}
                        autoComplete='off'
                      />
                      {discountError && (
                        <p className='text-danger'>{discountError}</p>
                      )}
                      {couponSuccess && (
                        <p className='text-success'>{couponSuccess}&nbsp;!!!</p>
                      )}
                      <br />
                      <button
                        type='button'
                        className='text-center btn btn-success btn-raised '
                        disabled={!coupon.length}
                        onClick={() => {
                          couponApply()
                        }}
                      >
                        Apply coupon
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='card mt-2'>
              <div className='card-header h5 bg-light'>Payment method</div>
              <div className='card-body'>
                <div class='form-check'>
                  <input
                    class='form-check-input'
                    type='radio'
                    name='paymentMethod'
                    id='exampleRadios1'
                    onClick={() => setCod(false)}
                    checked
                  />
                  <label class='form-check-label' for='exampleRadios1'>
                    Card
                  </label>
                </div>
                <div class='form-check'>
                  <input
                    class='form-check-input'
                    type='radio'
                    name='paymentMethod'
                    id='exampleRadios2'
                    onClick={() => setCod(true)}
                  />
                  <label class='form-check-label' for='exampleRadios2'>
                    Cash on delivery
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        <h5>Your addresses</h5>

        {savedUserAddresses.length > 0 ? (
          <div className='row mt-4 ml-1 mb-3'>
            {savedUserAddresses.map((data, i) => (
              <div className='col-md-3'>
                <Address
                  data={data}
                  setSavedAddress={setSavedAddress}
                  addressSaved={addressSaved}
                  authToken={user.token}
                />
              </div>
            ))}
          </div>
        ) : (
          <></>
        )}
      </section>
    </>
  )
}

export default Checkout
