import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '../ui/button'  // Adjust with your Button import path
import { Input } from '../ui/input'  // Adjust with your Input import path
import { Card } from '../ui/card'  // Adjust with your Card import path
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form'

function AddCategoryForm() {
  const methods = useForm()
  const { control, handleSubmit, formState: { errors } } = methods

  const onSubmit = (data) => {
    console.log(data) // Handle form submission
  }

  return (
    <div className="max-w-2xl p-6 md:p-8 w-full mx-auto">
      {/* Add Category Form */}
      <Card className="p-8 shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Category</h3>

        {/* Wrap the form with FormProvider */}
        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="category_name"
              rules={{ required: "Category Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="p-4 border border-gray-300 rounded-md shadow-sm w-full"
                      placeholder="Enter category name"
                    />
                  </FormControl>
                  <FormMessage>{errors.category_name?.message}</FormMessage>
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
            >
              Add Category
            </Button>
          </form>
        </FormProvider>
      </Card>
    </div>
  )
}

export default AddCategoryForm
