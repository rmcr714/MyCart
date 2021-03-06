import Category from '../models/categoryModel.js'
import Subs from '../models/subModel.js'
import Product from '../models/productModel.js'
import slugify from 'slugify'
import redis from 'redis'

//connection to redis
const redisClient = redis.createClient({
  retry_strategy: function (options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 3) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  },
})

redisClient.on('error', (err) => {
  console.log('redis disconnected')
})

//@desc create a category
//@route POST /api/category
//@access  Admin
export const create = async (req, res) => {
  try {
    const { name } = req.body
    const category = await new Category({
      name,
      slug: slugify(name),
    }).save()

    res.json(category)
  } catch (error) {
    // console.log(error)
    res.status(400).send('create category failed')
  }
}

//@desc get all categories
//@route GET /api/categories
//@access  public
export const list = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 }).exec()

    if (categories !== null && redisClient.connected) {
      redisClient.setex('categories', 600, JSON.stringify(categories))
    }

    res.json(categories)
  } catch (err) {
    res.status(400).send('No category found')
  }
}

//@desc read a category
//@route GET /api/category/:slug
//@access  Admin
export const read = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug }).exec()
    //get all products in the category
    const products = await Product.find({ category: category._id })
      .populate('category')
      .exec()
    if (category !== null && products !== null && redisClient.connected) {
      const data = { category, products }
      redisClient.setex(req.params.slug, 600, JSON.stringify(data))
    }
    res.json({ category, products })
  } catch (err) {
    res.status(403).send('No Such category found')
  }
}

//@desc update a category
//@route PUT /api/category/:slug
//@access  Admin
export const update = async (req, res) => {
  const { name } = req.body

  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true } //this new parameter is set so that we get the updated document as response, withhout this we will get the old document before the update
    )
    res.json(updated)
  } catch (err) {
    res.status(403).send('Category update failed')
  }
}

//@desc delete a category
//@route DELETE /api/category/:slug
//@access  Admin
export const remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug })
    res.json(deleted)
  } catch (err) {
    res.status(403).send('Category delete failed')
  }
}

//@desc get all the sub categories for the passed parent category
//@route DELETE /api/category/subs/:_id
//@access  Public
export const getSubs = async (req, res) => {
  try {
    const subs = await Subs.find({ parent: req.params._id })
    res.json(subs)
  } catch (err) {
    res.status(400).send('Sub categories dont exist')
  }
}
