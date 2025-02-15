import React, { useEffect, useState } from 'react';
import AddProductName from './Forms/add-product-name';
import { fetchCategories, fetchProductNames, deleteProductName } from '@/lib/Apis';
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

function ProductNamePage() {
  const [categories, setCategories] = useState([]);
  const [productNames, setProductNames] = useState([]);

  // Fetch categories
  const fetchCategoryData = async () => {
    const response = await fetchCategories();
    setCategories(response);
  };

  // Fetch product names
  const fetchProductNameData = async () => {
    const response = await fetchProductNames();
    setProductNames(response);
  };

  useEffect(() => {
    fetchCategoryData();
    fetchProductNameData();
  }, []);

  // Handle edit action
  const handleEdit = (productNameId) => {
    console.log('Edit product name:', productNameId);
    // Add your edit logic here
  };

  // Handle delete action
  const handleDelete = async (productNameId) => {
    console.log('Delete product name:', productNameId);
    const response = await deleteProductName(productNameId);
    console.log(response);

    // Refetch product names after deletion
    if (response.message) {
      toast.success(`${response.message}`);
      fetchProductNameData(); // Refetch product names
    } else {
      toast.error('Failed to delete product name');
    }
  };


  return (
    <div className="p-6 flex flex-col items-center w-full">
      <h1 className="text-2xl font-bold mb-6">Product Names</h1>
      <AddProductName categories={categories} onSuccess={fetchProductNameData} />

      {/* Centered Table */}
      <div className="mt-6 w-full flex justify-center">
        <div className="w-full max-w-4xl">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">ID</TableHead>
                <TableHead className="text-center">Product Name</TableHead>
                <TableHead className="text-center">Category</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productNames.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="text-center">{product.id}</TableCell>
                  <TableCell className="text-center">{product.name}</TableCell>
                  <TableCell className="text-center">
                    {categories.find((cat) => cat.id === product.category_id)?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex space-x-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(product.id)}
                      >
                        <Pencil className="h-4 w-4 mr-2" /> Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                      >
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

export default ProductNamePage;