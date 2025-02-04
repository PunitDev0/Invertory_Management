import React from 'react'
import { AddProductForm } from './Forms/add-product-form'
import AddCategoryForm from './Forms/add-category-form'
import AddProductName from './Forms/add-product-name'

function MainFrom() {
  return (
    <div className='grid grid-cols-2'>
      <AddProductForm/>
      <div>
        <AddCategoryForm/>
        <AddProductName/>
      </div>
    </div>
  )
}

export default MainFrom
