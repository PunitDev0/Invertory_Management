import React from 'react'
import { useForm, Controller, FormProvider } from 'react-hook-form'
import { Button } from '../ui/button'  // Adjust with your Button import path
import { Input } from '../ui/input'  // Adjust with your Input import path
import { Card } from '../ui/card' // Adjust with your Card import path
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/Components/ui/select' // Replace with your actual path

function AddProductName() {
  const methods = useForm()
  const { control, handleSubmit, formState: { errors } } = methods

  const onSubmit = (data) => {
    console.log(data) // Handle form submission here
  }

  return (
    <div className="p-6 md:p-8 w-full mx-auto max-w-2xl">
      {/* Add Product Name with Category Form */}
      <Card className="p-8 shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add Product Name with Category</h3>
        
        {/* Wrap the form with FormProvider */}
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Product Name */}
            <FormField
              control={control}
              name="product_category_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name with Category</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="p-4 border border-gray-300 rounded-md shadow-sm w-full"
                      placeholder="Enter product name with category"
                    />
                  </FormControl>
                  <FormMessage>{errors.product_category_name?.message}</FormMessage>
                </FormItem>
              )}
            />

            {/* Category */}
            <FormField
              control={control}
              name="category"
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Controller
                      {...field}
                      render={({ field: { onChange, value } }) => (
                        <Select onValueChange={onChange} value={value} className="w-full">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="electronics">Electronics</SelectItem>
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="home">Home & Garden</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </FormControl>
                  <FormMessage>{errors.category?.message}</FormMessage>
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Add Product Name
            </Button>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}

export default AddProductName
