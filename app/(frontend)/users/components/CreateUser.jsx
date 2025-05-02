import * as React from "react"
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
import { UserPlus } from "lucide-react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"

const FormSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string()
        .min(10, "Phone number must be at least 10 digits")
        .max(15, "Phone number must be less than 15 digits")
        .regex(/^[0-9+\-\s()]*$/, "Invalid phone number format"),
    password: z.string().min(7),
    status: z.string().min(1),
})

export function CreateUserDialog() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className={"outline cursor-pointer hover:bg-gray-500"}>
                        Create
                        <UserPlus />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create User</DialogTitle>
                        <DialogDescription>
                            Fill in the details to create a new user.
                        </DialogDescription>
                    </DialogHeader>
                    <CreateUserForm setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline">Create User</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create User</DrawerTitle>
                    <DrawerDescription>
                        Fill in the details to create a new user.
                    </DrawerDescription>
                </DrawerHeader>
                <CreateUserForm className="px-4" setOpen={setOpen} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function CreateUserForm({ className, setOpen }) {

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            status: "active",
        },
    })

    async function onSubmit(data) {
        try {
            const response = await fetch("/api/users", {
                method: "POST",
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
            toast.success("Soft phone", {
                description: `User ${result.name} created successfully`,
            });
            console.log(result); // For debugging

            setOpen(false) // Close the dialog after successful submission
        } catch (err) {
            toast.error("Form failed to submit", {
                description: err.message,
            });
            console.error("Error submitting form:", err);
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type={"password"} placeholder="password" {...field} />
                                </FormControl>
                                <FormMessage className={"text-xs"} />
                            </FormItem>
                        )}
                    />
                </div>

                <Button type="submit" className={"cursor-pointer hover:bg-gray-500"}>Submit</Button>
            </form>
        </Form>
    )
}

export default CreateUserDialog