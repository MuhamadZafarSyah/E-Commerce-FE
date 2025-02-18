import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Head from "next/head"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Navbar } from "@/components/Navbar";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AlertCircle, Loader, Loader2 } from "lucide-react";
import DropzoneProfilePicture from "@/components/DropzoneProfilePicture";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import createInstance from "@/axios/instance";
import Footer from "@/components/Footer";

const formSchema = z.object({
    fullname: z.string().min(4, {
        message: "Full name must be at least 4 characters.",
    }).max(50),
    phone: z.string(),
    address: z.string().min(10, {
        message: "Address must be at least 10 characters.",
    }).max(100),
    image: z
        .instanceof(File)
        .nullable()
        .refine(
            (file) => file === null || ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/webp"].includes(file.type) && file.size < 5000000,
            "Only .jpg, .jpeg, .png, .webp and .gif formats are supported with max size 5MB."
        ),
});

function ProfileAlert({ onClose, missingFields }: { onClose: () => void; missingFields: string[] }) {
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
            <div className="bg-background p-6 rounded-lg max-w-md w-full mx-4 shadow-xl">
                <div className="flex flex-col items-center gap-4">
                    <AlertCircle className="w-12 h-12 text-primary" />
                    <div className="text-center">
                        <h2 className="text-xl font-semibold mb-2">Complete Your Profile</h2>
                        {missingFields.length > 0 && (
                            <p className="text-muted-foreground mb-4">
                                Please fill in the following required fields:{" "}
                                <span className="font-medium text-foreground">
                                    {missingFields.join(", ")}
                                </span>
                            </p>
                        )}
                        <Button onClick={onClose} className="mt-2">
                            I Understand
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function MyProfilePage() {
    const queryClient = useQueryClient();
    const [missingFields, setMissingFields] = useState<string[]>([]);

    const { data: profileData, isSuccess } = useQuery({
        queryKey: ["myProfile"],
        queryFn: async () => {
            const response = await createInstance().get("/profile/my-profile");
            return response.data.data;
        },
        refetchOnWindowFocus: false,
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullname: "",
            phone: "",
            address: "",
            image: null,
        },
    });

    useEffect(() => {
        if (isSuccess && profileData) {
            const initialValues = {
                fullname: profileData.fullname || "",
                phone: profileData.phone || "",
                address: profileData.address || "",
                image: null,
            };

            form.reset(initialValues);

            // Check for missing required fields
            const missing = [];
            if (!initialValues.fullname) missing.push("Full Name");
            if (!initialValues.address) missing.push("Address");
            if (!initialValues.phone) missing.push("Phone");
            setMissingFields(missing);
        }
    }, [isSuccess, profileData, form]);

    const { mutateAsync, isLoading } = useMutation(
        (values: FormData) =>
            createInstance().post('/profile/edit-profile', values, {
                headers: { 'Content-Type': 'multipart/form-data' }
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['myProfile'] });
                toast.success("Profile updated successfully");
            },
            onError: (error: { response?: { data?: { message?: string } } }) => {
                toast.error(error.response?.data?.message || "An error occurred");
            },
        }
    );

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });

        await mutateAsync(formData);
    }

    const isFormDirty = form.formState.isDirty;
    const showAlert = missingFields.length > 0;

    return (
        <>
            <Head>
                <title>My Profile</title>
            </Head>

            {showAlert && (
                <ProfileAlert
                    onClose={() => setMissingFields([])}
                    missingFields={missingFields}
                />
            )}

            <div className="flex min-h-screen w-full flex-col">
                <Navbar />
                <main className="container mx-auto flex-1 max-w-6xl p-4 md:p-6">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
                        <p className="text-muted-foreground">
                            Manage your profile information and preferences
                        </p>
                    </div>

                    <div className="border-t pt-6">
                        <div className="flex flex-col gap-8 lg:flex-row lg:gap-16">
                            <nav className="flex gap-2 lg:flex-col lg:w-1/5">
                                <Link
                                    href="/user/my-profile"
                                    className="px-4 py-2 font-medium bg-muted  rounded-lg"
                                >
                                    Profile
                                </Link>

                            </nav>

                            <div className="flex-1 lg:max-w-2xl">
                                <Form {...form}>
                                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-lg font-medium">Public Profile</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    This information will be displayed publicly
                                                </p>
                                            </div>

                                            <DropzoneProfilePicture
                                                initialImageUrl={profileData?.image}
                                                onChange={(file) => form.setValue("image", file, { shouldDirty: true })}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="image"
                                                render={() => <FormMessage />}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="fullname"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Full Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="shadcn" {...field} />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Your name as it appears on your account
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone Number</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Your phone number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Your address" {...field} rows={4} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <Button
                                                type="submit"
                                                disabled={!isFormDirty || isLoading}
                                                className="w-full sm:w-auto"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                ) : "Save Changes"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </>
    )
}