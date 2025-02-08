"use client";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ImageIcon, XCircleIcon } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import Dropzone from "react-dropzone";

export default function DropzoneProfilePicture({
    onChange,
    initialImageUrl,
}: {
    onChange?: (file: File | null) => void;
    initialImageUrl?: string | null;
}) {
    const [profilePicture, setProfilePicture] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(initialImageUrl || null);

    useEffect(() => {
        setImagePreview(initialImageUrl || null);
    }, [initialImageUrl]);

    const handleDrop = (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (file) {
            setProfilePicture(file);
            setImagePreview(URL.createObjectURL(file));
            if (onChange) {
                onChange(file);
            }
        }
    };

    const handleRemove = () => {
        setProfilePicture(null);
        setImagePreview(null);
        if (onChange) {
            onChange(null);
        }
    };

    return (
        <div className="w-full max-w-40">
            <Label htmlFor="profile">Profile Picture</Label>
            <div className="mt-1 w-full">
                {imagePreview ? (
                    <div className="relative aspect-square">
                        <button
                            className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2"
                            onClick={handleRemove}
                        >
                            <XCircleIcon className="h-5 w-5 fill-primary text-primary-foreground" />
                        </button>
                        <Image
                            src={imagePreview}
                            alt="Profile"
                            className="border border-border h-full w-full rounded-md object-cover"
                            height={500}
                            width={500}
                        />
                    </div>
                ) : (
                    <Dropzone
                        onDrop={handleDrop}
                        accept={{
                            "image/png": [".png", ".jpg", ".jpeg", ".webp"],
                        }}
                        maxFiles={1}
                    >
                        {({
                            getRootProps,
                            getInputProps,
                            isDragActive,
                            isDragAccept,
                            isDragReject,
                        }) => (
                            <div
                                {...getRootProps()}
                                className={cn(
                                    "border border-dashed flex items-center justify-center aspect-square rounded-md focus:outline-none focus:border-primary",
                                    {
                                        "border-primary bg-secondary": isDragActive && isDragAccept,
                                        "border-destructive bg-destructive/20":
                                            isDragActive && isDragReject,
                                    }
                                )}
                            >
                                <input {...getInputProps()} id="profile" />
                                <ImageIcon className="h-16 w-16" strokeWidth={1.25} />
                            </div>
                        )}
                    </Dropzone>
                )}
            </div>
        </div>
    );
}