import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
    // Define endpoint for avatars
    avatarUploader: f({ image: { maxFileSize: "2MB", maxFileCount: 1 } })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Avatar upload complete for userId:", metadata.userId);
            console.log("File URL:", file.url);
            return { uploadedBy: metadata.userId };
        }),

    // Define endpoint for banners
    bannerUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;