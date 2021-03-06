import React from 'react'

import NewArrivals from '../components/home/NewArrivals'
import BestSellers from '../components/home/BestSellers'
import CategoryList from '../components/MenuCategory/CategoryList'
import SubList from '../components/MenuSub/SubList'

// import Typewriter from 'typewriter-effect'
import { Carousel } from 'antd'

const Home = () => {
  const contentStyle = {
    height: '200px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: 'black', //original #232222
  }

  return (
    <>
      {/* <div className='jumbotron text-primary h1 font-weight-bold text-center'>
        <Typewriter
          options={{
            strings: ['MY CART ', 'BEST SELLERS', 'NEW ARRIVALS'],
            autoStart: true,
            loop: true,
          }}
        />
      </div> */}
      {/* <div className='container-fluid m-2'>
        <Carousel autoplay style={{ backgroundColor: 'black' }}>
          {products.length > 0 &&
            products.map((product) => (
              <div className='text-center'>
                <img
                  src={
                    product.images && product.images.length
                      ? product.images[0].url
                      : laptop
                  }
                  style={{
                    width: '50%',
                    height: '350px',
                    imageAlign: 'center',
                    margin: '0 auto',
                    color: 'black',
                  }}
                  fluid
                />
              </div>
            ))}
        </Carousel>
      </div> */}

      <Carousel autoplay className='mt-1'>
        <div style={{ color: 'yellow' }}>
          <h3 style={contentStyle} className='mt-5'>
            WELCOME TO MY CART!! <i className='fas fa-laptop-house'></i>
          </h3>
        </div>
        <div>
          <h3 style={contentStyle} className='mt-5'>
            50% OFF ALL MONTH!!!
          </h3>
        </div>
        <div>
          <h3 style={contentStyle} className='mt-5'>
            <i className='fab fa-apple fa-2x'></i>
          </h3>
        </div>
        <div>
          <h3 style={contentStyle} className='mt-5'>
            Powered by : &nbsp;<i className='fab fa-node fa-2x'></i>
          </h3>
        </div>
      </Carousel>
      <CategoryList />
      <br />

      <hr />
      <NewArrivals />
      <BestSellers />

      <h4 className='text-center p-3 mt-5 mb-2 display-5 jumbotron'>
        Sub Categories
      </h4>
      <SubList />
      <br />
      <br />
    </>
  )
}

export default Home
