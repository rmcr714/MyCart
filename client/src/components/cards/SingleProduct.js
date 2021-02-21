import React from 'react'
import { Card, Tabs } from 'antd'
import { Link } from 'react-router-dom'
import 'react-responsive-carousel/lib/styles/carousel.min.css' // requires a loader
import { Carousel } from 'react-responsive-carousel'
import { HeartOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import ProductListItems from './ProductListItems'
// import ProductRatingForm from '../forms/ProductRatingForm'
import RatingModal from '../modal/RatingModal'
import StarRating from 'react-star-ratings'
import ReviewsCard from './ReviewsCard'
import RatingsAverage from '../../functions/RatingsAverage'

import ProductListGroup from '../listgroups/ProductListGroup'

const { Meta } = Card
const { TabPane } = Tabs

const SingleProduct = ({
  product,
  onStarClick,
  star,
  userComment,
  comment,
  reviewSubmit,
}) => {
  const { title, images, description, _id, ratings } = product
  return (
    <>
      <div className='col-md-6 ml-4 mt-3 '>
        <Card>
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((data) => <img src={data.url} key={data.public_id} />)}
          </Carousel>
          <br />

          <Tabs type='card'>
            <TabPane tab='Description' key='1'>
              {description && description}
            </TabPane>
            <TabPane tab='Specification' key='2'>
              ram : 8gb
              <br />
              processor : corei7 8th gen
              <br />
              Gpu : Nividia Gtx 1080
              <br />
              cache : 10mb of l1 cache
              <br />
            </TabPane>
            <TabPane tab='Seller info'>
              Anurag mart near pluto , next to kepler belt, pin : solar294745
              <br />
              phone : solar98377656
            </TabPane>
          </Tabs>
        </Card>
        <hr />
        <ProductListGroup product={product} />
      </div>
      <div className='col-md-5 ml-2 mt-3'>
        <Card
          className='productcard'
          actions={[
            <>
              <ShoppingCartOutlined className='text-success' /> <br />
              Add to Cart
            </>,
            <Link to='/'>
              <HeartOutlined className='text-danger' />
              <br />
              Add to wishlist
            </Link>,
            <RatingModal reviewSubmit={reviewSubmit}>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor='gold'
              />
              <br />
              <form className='mt-3'>
                <div className='form-group'>
                  <label htmlFor='comment' className='h5'>
                    Comment
                  </label>
                  <hr />
                  <textarea
                    className='form-control'
                    name='comment'
                    rows='5'
                    value={comment}
                    onChange={userComment}
                  ></textarea>
                </div>
              </form>
            </RatingModal>,
          ]}
        >
          <Meta title={title} />
          <span>
            {product && product.ratings && ratings.length > 0 ? (
              <div className='pt-3'>{RatingsAverage(product)}</div>
            ) : (
              'No Ratings yet'
            )}
          </span>
          <hr />
          <ProductListItems product={product} />
        </Card>

        <br />
        <ReviewsCard ratings={ratings} />
      </div>
    </>
  )
}

export default SingleProduct