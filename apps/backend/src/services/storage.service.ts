import { supabase, STORAGE_BUCKETS } from '../config/supabase';

export class StorageService {
    /**
     * Upload file to Supabase Storage
     */
    async uploadFile(
        bucket: string,
        path: string,
        file: Buffer,
        contentType: string
    ): Promise<{ url: string; path: string }> {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(path, file, {
                contentType,
                upsert: false,
            });

        if (error) {
            throw new Error(`Failed to upload file: ${error.message}`);
        }

        const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        return {
            url: urlData.publicUrl,
            path: data.path,
        };
    }

    /**
     * Upload KYC document
     */
    async uploadKYCDocument(
        userId: string,
        documentType: string,
        file: Buffer,
        contentType: string
    ): Promise<{ url: string; path: string }> {
        const timestamp = Date.now();
        const path = `${userId}/${documentType}_${timestamp}`;

        return this.uploadFile(
            STORAGE_BUCKETS.KYC_DOCUMENTS,
            path,
            file,
            contentType
        );
    }

    /**
     * Upload proof of delivery photo
     */
    async uploadProofOfDelivery(
        deliveryId: string,
        file: Buffer,
        contentType: string
    ): Promise<{ url: string; path: string }> {
        const timestamp = Date.now();
        const path = `${deliveryId}/pod_${timestamp}`;

        return this.uploadFile(
            STORAGE_BUCKETS.PROOF_OF_DELIVERY,
            path,
            file,
            contentType
        );
    }

    /**
     * Upload profile photo
     */
    async uploadProfilePhoto(
        userId: string,
        file: Buffer,
        contentType: string
    ): Promise<{ url: string; path: string }> {
        const path = `${userId}/profile`;

        return this.uploadFile(
            STORAGE_BUCKETS.PROFILE_PHOTOS,
            path,
            file,
            contentType
        );
    }

    /**
     * Delete file from storage
     */
    async deleteFile(bucket: string, path: string): Promise<void> {
        const { error } = await supabase.storage.from(bucket).remove([path]);

        if (error) {
            throw new Error(`Failed to delete file: ${error.message}`);
        }
    }

    /**
     * Get signed URL for private file
     */
    async getSignedUrl(
        bucket: string,
        path: string,
        expiresIn: number = 3600
    ): Promise<string> {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresIn);

        if (error) {
            throw new Error(`Failed to create signed URL: ${error.message}`);
        }

        return data.signedUrl;
    }
}
