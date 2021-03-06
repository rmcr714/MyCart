import React, { useState, useEffect } from 'react'
import { Select } from 'antd'
import AdminNav from '../../../components/nav/AdminNav'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import { getProduct, updateProduct } from '../../../functions/product'
import { getCategories, getCategorySubs } from '../../../functions/category'
import FileUpload from '../../../components/forms/FileUpload'

const { Option } = Select

const productState = {
  title: '',
  description: '',
  price: '',
  category: '',
  subs: [],
  shipping: '',
  quantity: '',
  images: [],
  colors: ['Black', 'brown', 'silver', 'white', 'blue'], //options to show in dropdown so that admin can pick one
  brands: ['Samsung', 'Microsoft', 'Apple', 'Lenovo', 'ASUS', 'DELL'], //options to show in dropdown so that admin can pick one
  color: '',
  brand: '',
}

const ProductUpdate = ({ match, history }) => {
  //redux logged in user
  const { user } = useSelector((state) => ({ ...state }))
  const { slug } = match.params
  const [values, setValues] = useState(productState)
  //Storing the subcategories
  const [subOptions, setSubOptions] = useState([])
  const [categories, setCategories] = useState([])
  const [arrayOfSubs, setArrayOfSubs] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    title,
    description,
    price,
    category,
    subs,
    shipping,
    quantity,
    images,
    colors,
    brands,
    color,
    brand,
  } = values

  useEffect(() => {
    loadProduct()
    loadCategories()
  }, [])

  const loadCategories = () => {
    getCategories().then((res) => {
      setCategories(res.data)
    })
  }

  const loadProduct = () => {
    getProduct(slug)
      .then((res) => {
        setValues({ ...values, ...res.data })

        //get all the subcategories for the fetchd product
        getCategorySubs(res.data.category._id)
          .then((p) => {
            // console.log('the data', p.data)
            setSubOptions(p.data) // on first load show all subs for the product to update
          })
          .catch((err) => {
            console.log('the data', err)
          })

        let arr = []
        res.data.subs.map((s) => {
          arr.push(s._id)
        })
        console.log('Here')
        console.log('ARR', arr)
        setArrayOfSubs(arr) //required for ant design select to work
      })
      .catch((err) => {})
  }

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value })
  }

  //when admin selects a category a api request is made to backend to fetch all the sub-categories for that category
  const handleCategoryChange = (e) => {
    e.preventDefault()
    // console.log('Clciked Category', e.target.value)

    setValues({ ...values, subs: [] })

    setSelectedCategory(e.target.value)

    getCategorySubs(e.target.value)
      .then((res) => {
        // console.log('changed category', res.data)
        setSubOptions(res.data)
      })
      .catch((err) => {
        console.log(err)
      })

    //if user clicks back to the original category then show its sub categories as default
    if (values.category._id === e.target.value) {
      loadProduct()
    }

    //clear all sub categories if new category is chosen
    setArrayOfSubs([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    values.subs = arrayOfSubs
    values.category = selectedCategory ? selectedCategory : values.category
    updateProduct(slug, user.token, values)
      .then((res) => {
        setLoading(false)
        toast.success(`${res.data.title} is updated is successfully`)
        history.push('/admin/dashboard')
      })
      .catch((err) => {
        setLoading(false)
        console.log(err)
        toast.error(err.response.data.err)
      })
  }

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-2'>
          <AdminNav />
        </div>
        <div className='col-md-10'>
          <h4>Product Update</h4>
          {/* {JSON.stringify(values)} */}
          <hr />
          <div className='p-3'>
            <FileUpload
              values={values}
              setValues={setValues}
              loading={loading}
              setLoading={setLoading}
            />
          </div>
          <form onSubmit={handleSubmit}>
            <div className='form-group'>
              <label>Title</label>
              <input
                type='text'
                name='title'
                className='form-control'
                value={title}
                onChange={handleChange}
              ></input>
            </div>
            <div className='form-group'>
              <label>Description</label>
              <input
                type='text'
                name='description'
                className='form-control'
                value={description}
                onChange={handleChange}
              ></input>
            </div>
            <div className='form-group'>
              <label>Price</label>
              <input
                type='Number'
                name='price'
                className='form-control'
                value={price}
                onChange={handleChange}
              ></input>
            </div>
            <div className='form-group'>
              <label>Shipping</label>
              <select
                name='shipping'
                className='form-control'
                value={shipping === 'Yes' ? 'Yes' : 'No'}
                onChange={handleChange}
              >
                <option value='No'>No</option>
                <option value='Yes'>Yes</option>
              </select>
            </div>
            <div className='form-group'>
              <label>Quantity</label>
              <input
                type='Number'
                name='quantity'
                className='form-control'
                value={quantity}
                onChange={handleChange}
              ></input>
            </div>
            <div className='form-group'>
              <label>Colors</label>
              <select
                name='color'
                className='form-control'
                value={color}
                onChange={handleChange}
              >
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Brand</label>
              <select
                name='brand'
                className='form-control'
                onChange={handleChange}
                value={brand}
              >
                {brands.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className='form-group'>
              <label>Category </label>
              <select
                name='category'
                className='form-control'
                onChange={handleCategoryChange}
                required
                value={selectedCategory ? selectedCategory : category._id}
              >
                {categories.length > 0 &&
                  categories.map((data) => (
                    <option value={data._id} key={data._id}>
                      {data.name}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label>Sub Categories </label>
              <Select
                mode='multiple'
                style={{ width: '100%' }}
                placeholder='Please select the subcategories'
                name='subs'
                value={arrayOfSubs}
                onChange={(value) => setArrayOfSubs(value)}
              >
                {subOptions.length > 0 &&
                  subOptions.map((s) => (
                    <Option key={s._id} value={s._id}>
                      {s.name}
                    </Option>
                  ))}
              </Select>
            </div>

            <br />
            <button type='submit' className='btn btn-outline-info'>
              Save
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductUpdate
