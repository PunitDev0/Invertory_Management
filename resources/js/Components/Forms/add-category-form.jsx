import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '../ui/button'; // Adjust the path
import { Input } from '../ui/input'; // Adjust the path
import { Card } from '../ui/card'; // Adjust the path
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/Components/ui/form';
import { addCategory, fetchCategories } from '@/lib/Apis'; // Import API utility
import { toast } from 'react-toastify'; // Import toast from react-toastify

// Make sure to import the CSS for react-toastify
import 'react-toastify/dist/ReactToastify.css';

function AddCategoryForm({setCategories}) {
  const methods = useForm();
  const { control, handleSubmit, formState: { errors }, reset } = methods;
  const [image, setImage] = useState(null); // State for storing the selected image
  const [imagePreview, setImagePreview] = useState(null); // State for storing image preview URL

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);

      // Create a preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    }
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData(); // Using FormData to send the data with the image
      formData.append('name', data.name);
      if (image) {
        formData.append('image', image); // Append image if present
      }

      const result = await addCategory(formData); // Call the addCategory function from api.js
      console.log(result); // Optionally log the response

      // Show toast notification
      reset();
      setImage(null); // Reset image after successful submission
      setImagePreview(null); // Reset image preview
      toast.success('Category added successfully!');
      // Reset form after successful submission
    } catch (error) {
      console.error('Error adding category:', error.response?.data || error.message);
      toast.error('Failed to add category'); // Show error toast if adding category fails
    }
  };

  useEffect(()=>{
    onsub
  })

  useEffect(() => {
      const getCategories = async () => {
        try {
          const categoriesData = await fetchCategories();  // Use fetchCategories from api.js
          setCategories(categoriesData);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      }
  
      getCategories()
    }, [setImagePreview])

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

            {/* Image Upload Field */}
            <FormField
              control={control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="p-2 border border-gray-300 rounded-md shadow-sm w-full"
                    />
                  </FormControl>
                  {image && <p className="text-sm text-gray-500 mt-2">Selected Image: {image.name}</p>}
                </FormItem>
              )}
            />

            {/* Image Preview */}
            {imagePreview && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Image Preview:</h4>
                <img
                  src={imagePreview}
                  alt="Category Preview"
                  className="mt-2 w-full max-w-sm rounded-md"
                />
              </div>
            )}

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
