import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../ui/button'; // Adjust the path
import { Input } from '../ui/input'; // Adjust the path
import { Card } from '../ui/card'; // Adjust the path
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form';
import { addCategory } from '@/lib/Apis'; // Import API utility
import { toast } from 'react-toastify'; // Import toast from react-toastify

// Make sure to import the CSS for react-toastify
import 'react-toastify/dist/ReactToastify.css';

function AddCategoryForm() {
  const methods = useForm();
  const { control, handleSubmit, formState: { errors }, reset } = methods;

  const onSubmit = async (data) => {
    try {
      const result = await addCategory(data); // Call the addCategory function from api.js
      console.log(result); // Optionally log the response

      // Show toast notification
      reset();
      toast.success('Category added successfully!');

      // Reset form after successful submission
    } catch (error) {
      console.error('Error adding category:', error.response?.data || error.message);
      toast.error('Failed to add category'); // Show error toast if adding category fails
    }
  };

  return (
    <div className="max-w-2xl p-6 md:p-8 w-full mx-auto">
      <Card className="p-8 shadow-lg rounded-lg bg-white">
        <h3 className="text-2xl font-semibold mb-4 text-gray-800">Add New Category</h3>

        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <FormField
              control={control}
              name="name" // Matches the Laravel API field
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
                  <FormMessage>{errors.name?.message}</FormMessage>
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
  );
}

export default AddCategoryForm;
