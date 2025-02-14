import React, { useEffect, useState } from "react";
import { AddProductForm } from "./Forms/add-product-form";
import AddCategoryForm from "./Forms/add-category-form";
import AddProductName from "./Forms/add-product-name";
import { fetchProducts } from "@/lib/Apis";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import AddShopForm from "./Forms/add-shops-form";

export default function MainForm({productData}) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setrefetch] = useState(false)
    const [categories, setCategories] = useState([])
    const [productsName, setProductsName] = useState([]);
  
  console.log();
  
  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData.slice(0, 5)); // Get only top 5 products
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  return (
    <div className=" p-6">
      {/* Left Side - Forms */}
      <div className="space-y-6 grid xl:grid-cols-3 lg:grid-cols-2">
        <AddProductForm productData={productData} productsName={productsName}/>
        <div className="w-full">
        <AddCategoryForm setrefetch={setrefetch} setCategories={setCategories} />
        <AddProductName refetch={refetch} categories={categories} setProductsName={setProductsName}/>
        </div>
        <AddShopForm/>
      </div>

      {/* Right Side - Table */}
      <Card className="shadow-lg rounded-xl bg-white">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">Recently Added</h2>

          {error ? (
            <Alert variant="destructive" className="mb-4">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <AlertDescription>Error loading products: {error}</AlertDescription>
            </Alert>
          ) : isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <div className="border rounded-lg overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader className="bg-gray-100">
                  <TableRow>
                    <TableHead className="text-left text-gray-600">ID</TableHead>
                    <TableHead className="text-left text-gray-600">Name</TableHead>
                    <TableHead className="text-left text-gray-600">Category</TableHead>
                    <TableHead className="text-left text-gray-600">Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id} className="hover:bg-gray-50 border-t">
                        <TableCell className="py-4">{product.id}</TableCell>
                        <TableCell className="font-medium">{product.productName}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell className="font-mono">{product.price}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="4" className="h-24 text-center text-gray-500">
                        No products found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
