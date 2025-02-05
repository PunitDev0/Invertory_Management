import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchProducts } from "@/lib/Apis";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CubeIcon } from "@radix-ui/react-icons";

export default function AllProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    getProducts();
  }, []);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", variant: "destructive" };
    if (stock < 5) return { label: "Low Stock", variant: "warning" };
    return { label: "In Stock", variant: "success" };
  };

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 min-h-screen">
      <Card className="w-full  shadow-lg rounded-xl bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6">
            <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
              <CubeIcon className="h-8 w-8" />
              Product Inventory
            </h2>
          </div>

          <div className="p-6">
            {error ? (
              <Alert variant="destructive" className="mb-6">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>Error loading products: {error}</AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table className="w-full">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="w-[300px] font-medium text-gray-600">Product Name</TableHead>
                      <TableHead className="text-gray-600">Category</TableHead>
                      <TableHead className="text-gray-600">Company</TableHead>
                      <TableHead className="text-right text-gray-600">Price</TableHead>
                      <TableHead className="text-gray-600">Stock</TableHead>
                      <TableHead className="text-right text-gray-600">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <TableRow
                          key={product.id}
                          className="transition-colors hover:bg-gray-50/50 group border-t"
                        >
                          <TableCell className="font-medium py-4">{product.productName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-gray-600">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell>{product.companyName}</TableCell>
                          <TableCell className="text-right font-mono">${product.price}</TableCell>
                          <TableCell>
                            <Badge variant={getStockStatus(product.stock_quantity).variant}>
                              {getStockStatus(product.stock_quantity).label}
                              <span className="ml-2 font-mono">({product.stock_quantity})</span>
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right text-sm text-gray-500">
                            {new Date(product.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="6" className="h-24 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <CubeIcon className="h-8 w-8 text-gray-400" />
                            No products found in inventory
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}