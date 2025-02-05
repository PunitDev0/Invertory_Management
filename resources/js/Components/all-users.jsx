import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { fetchUsers } from "@/lib/Apis";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon, CubeIcon } from "@radix-ui/react-icons";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData.users);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  return (
    <div className="p-6 flex flex-col items-center bg-gray-50 min-h-screen">
      <Card className="w-full shadow-lg rounded-xl bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-6 text-center">
            <h2 className="text-3xl font-bold flex items-center justify-center gap-2">
              <CubeIcon className="h-8 w-8" /> All Users
            </h2>
          </div>

          <div className="p-6">
            {error ? (
              <Alert variant="destructive" className="mb-6">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>Error loading users: {error}</AlertDescription>
              </Alert>
            ) : isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                {/* Yahan overflow-x-auto add kiya hai taaki table chhoti screens par scroll ho sake */}
                <Table className="w-full min-w-[600px]">
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="text-left text-gray-600">ID</TableHead>
                      <TableHead className="text-left text-gray-600">Name</TableHead>
                      <TableHead className="text-left text-gray-600">Email</TableHead>
                      <TableHead className="text-left text-gray-600">Role</TableHead>
                      <TableHead className="text-left text-gray-600">Created At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <TableRow key={user.id} className="hover:bg-gray-50 border-t">
                          <TableCell className="py-4">{user.id}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-gray-600">
                              {user.name}
                            </Badge>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell className="font-mono">{user.role}</TableCell>
                          <TableCell className="text-sm text-gray-500">
                            {new Date(user.created_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="5" className="h-24 text-center text-gray-500">
                          <div className="flex flex-col items-center justify-center py-8 gap-2">
                            <CubeIcon className="h-8 w-8 text-gray-400" />
                            No users found
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
