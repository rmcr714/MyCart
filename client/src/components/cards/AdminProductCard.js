import React from 'react'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import laptop from '../../images/laptop.png'
import { Link } from 'react-router-dom'
import { Card } from 'antd'
const { Meta } = Card

const AdminProductCard = ({ product, handleRemove }) => {
  const { title, description, images, slug } = product

  return (
    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : laptop}
          style={{ height: '150px', objectFit: 'cover' }}
          className='p-1'
        />
      }
      actions={[
        <Link to={`/admin/product/${slug}`}>
          {' '}
          <EditOutlined key='edit' className='text-primary' />
        </Link>,
        <DeleteOutlined
          className='text-danger'
          onClick={() => {
            handleRemove(slug)
          }}
        />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 70)} . . .`}
      />
    </Card>
  )
}

export default AdminProductCard
