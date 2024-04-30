"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { listImageUnsplash } from "@/constants/image";

import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { FormErrors } from "./form-errors";

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  //   const [isLoading, setIsLoading] = useState(false);
  //   const [images, setImages] = useState<ImageUnsplash[]>([]);

  //   useEffect(() => {
  //     const fetchImages = async () => {
  //       setIsLoading(true);
  //       try {
  //         const result = await unsplash.photos.getRandom({
  //           count: 9,
  //           collectionIds: ["317099"],
  //         });

  //         if (result && result.response) {
  //           const newImages = result.response as ImageUnsplash[];

  //           setImages(newImages);
  //         } else {
  //           console.log("no result");
  //           setImages([]);
  //         }
  //       } catch (error) {
  //         console.error(error);
  //         setImages([]);
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     };

  //     fetchImages();
  //   }, []);

  //   if (isLoading) {
  //     return <div>Loading...</div>;
  //   }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {listImageUnsplash.map((image) => (
          <div
            className={cn(
              "cursor-pointer relative aspect-video group hover:opacity-75  transition bg-muted rounded-sm",
              pending && "opacity-50 hover:opacity-50 cursor-auto"
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
            key={image.id}
          >
            <input
              type="radio"
              name={id}
              id={id}
              className="hidden"
              disabled={pending}
              checked={selectedImageId === image.id}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
            />
            <Image
              fill
              src={image.urls.thumb}
              alt="Unsplash image"
              className="object-cover rounded-sm"
            />
            {selectedImageId === image.id && (
              <div className=" absolute inset-y-0 h-full w-full bg-black/30 flex items-center justify-center rounded-sm">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-0.5 bg-black/50"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id={id} errors={errors} />
    </div>
  );
};
