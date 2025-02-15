import React, { useEffect, useState } from 'react';
import AddCategoryForm from './Forms/add-category-form';
import { deleteCategory, fetchCategories } from '@/lib/Apis';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Import shadcn table components
import { Button } from '@/components/ui/button'; // Import shadcn button component
import { Pencil, Trash } from 'lucide-react'; // Icons for edit and delete actions
import { toast } from 'react-toastify';

function CategoryPage() {
  const [categories, setCategories] = useState([]);

  // Fetch categories
  const fetchData = async () => {
    const response = await fetchCategories();
    setCategories(response);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle edit action
  const handleEdit = (categoryId) => {
    console.log('Edit category:', categoryId);
    // Add your edit logic here
  };

  // Handle delete action
  const handleDelete = async (categoryId) => {
    console.log('Delete category:', categoryId);
    const response = await deleteCategory(categoryId);
    console.log(response);

    // Refetch categories after deletion
    toast.success(`${response.message}`)
    if (response.message) {
      fetchData();
    }
  };

  // Handle add category success
  const handleAddCategorySuccess = () => {
    fetchData(); // Refetch categories after adding a new one
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
  <div className='sticky top-0'>
  <AddCategoryForm onSuccess={handleAddCategorySuccess} />
     
    </div>  
      {/* Centered Table */}
      <div className="mt-6 w-full flex justify-center">
  <div className="w-full max-w-6xl">
    <Table className="w-full border">
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="text-center">ID</TableHead>
          <TableHead className="text-center">Name</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category) => (
          <TableRow key={category.id}>
            <TableCell className="text-center">{category.id}</TableCell>
            <TableCell className="text-center">{category.name}</TableCell>
            <TableCell>
              <div className="flex justify-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(category.id)}>
                  <Pencil className="h-4 w-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                  <Trash className="h-4 w-4 mr-2" /> Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
</div>

    </div>
  );
}

export default CategoryPage;