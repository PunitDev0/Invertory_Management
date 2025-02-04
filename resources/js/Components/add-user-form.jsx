import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddUserForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Set up React Hook Form
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      role: "",
      password: "",
    },
  });

  // Function to generate a password starting with the username
  const generatePassword = (name) => {
    if (!name) return "";
    const randomNumbers = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
    return `${name.replace(/\s+/g, "")}@${randomNumbers}`;
  };

  // Handle name input change to auto-generate password
  const handleNameChange = (event) => {
    const name = event.target.value;
    form.setValue("name", name);
    form.setValue("password", generatePassword(name));
  };

  // Handle form submission
  const onSubmit = async (values) => {
    setIsLoading(true);
    try {
        const response = await axios.post("/store", {
            name: values.name,
            email: values.email,
            role: values.role,
            password: values.password,
        });
        setMessage(response.data.message);
        // setFormData({ name: "", email: "", role: "", password: "" });
        form.reset();
      } catch (error) {
        console.error("Error adding user:", error);
        setMessage("Failed to add user");
      } finally {
        setIsLoading(false);
      }
  };

  return (
    <div className="h-[90vh] flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} onChange={handleNameChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role Field */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field (Auto-generated) */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password (Auto-generated)</FormLabel>
                    <FormControl>
                      <Input type="text" readOnly placeholder="Generated password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-[#7C3AED] hover:bg-[#6D28D9]" disabled={isLoading}>
                {isLoading ? "Adding User..." : "Add User"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
