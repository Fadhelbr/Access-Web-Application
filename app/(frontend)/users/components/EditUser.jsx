import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@uidotdev/usehooks"
import { EditIcon } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { set, useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useEffect, useState } from "react"
import { dateFormat } from "../../utils/dateFormat"
import { Checkbox } from "@/components/ui/checkbox"

const FormSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be less than 15 digits")
        .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
    password: z.string().min(7).optional().or(z.literal('')),
    status: z.string().min(1),
})

export function UpdateUserDialog({ id, refresh, setRefresh, }) {
    const [open, setOpen] = useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className={"bg-transparent cursor-pointer hover:bg-gray-100 border text-black"}>
                        <EditIcon />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Update User</DialogTitle>
                        <DialogDescription>
                            change the details to Update the user.
                        </DialogDescription>
                    </DialogHeader>
                    <UpdateUserForm id={id} refresh={refresh} setRefresh={setRefresh} setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Update User</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Update User</DrawerTitle>
                    <DrawerDescription>
                        change the details to Update the user.
                    </DrawerDescription>
                </DrawerHeader>
                <UpdateUserForm className="px-4" setOpen={setOpen} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const UpdateUserForm = ({ id, refresh, setRefresh, className, setOpen }) => {
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editPassword, setEditPassword] = useState(false);

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            status: "",
        },
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/users/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch user data');
                }
                const data = await response.json();
                form.reset({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: "", // Keep password empty by default
                    status: data.status,
                });
                setUserData(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching user data:", err);
                setError(err.message);
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id, refresh]);

    console.log(editPassword);


    async function onSubmit(data) {
        try {
            if (!editPassword) {
                form.setValue("password", "")
            }

            const response = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            console.log(("Error submitting form:", response));
            const statusText = await response.statusText
            if (!response.ok) {
                throw new Error(statusText)
            }
            const result = await response.json()
            toast.success("Form submitted", {
                description: `User ${result.name} updated successfully`,
            });
            console.log(result);

            setOpen(false)
            setRefresh(!refresh)
        } catch (err) {
            toast.error("Form failed to submit", {
                description: err.message,
            });
            console.error("Error submitting form:", err);
        }
    }

    const handleReset = () => {
        if (userData) {
            form.reset({
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                password: "", // Keep password empty by default
                status: userData.status,
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
                <div className="flex gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="name" {...field} />
                                </FormControl>
                                <FormMessage className={"text-xs"} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="status"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className={"text-xs"} />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid gap-2">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone</FormLabel>
                                <FormControl>
                                    <Input type={"tel"} placeholder="phone" {...field} />
                                </FormControl>
                                <FormMessage className={"text-xs"} />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="email" {...field} />
                                </FormControl>
                                <FormMessage className={"text-xs"} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>

                                <FormLabel>
                                    Password
                                    <Checkbox id="terms1" onClick={() => setEditPassword(!editPassword)} className={"border-2 border-gray-900"} />
                                </FormLabel>

                                <FormControl>
                                    <Input disabled={!editPassword} type={"password"}
                                        placeholder={editPassword ? "Enter new password" : "Check to edit"} {...field} />

                                </FormControl>
                                <FormMessage className={"text-xs"} />
                            </FormItem>
                        )}
                    />

                </div>

                <div className="flex justify-between">
                    <Button type="button" onClick={handleReset} className={"bg-transparent cursor-pointer hover:bg-gray-100 border text-black"}>
                        Reset
                    </Button>
                    <Button type="submit" className={"cursor-pointer hover:bg-gray-500"}>
                        Submit
                        <span className="text-xs font-extralight">(last update at: {dateFormat(userData?.updatedAt)})</span>
                    </Button>
                </div>

            </form>
        </Form>
    )
}

export default UpdateUserDialog