<?php

namespace App\Http\Controllers;

class ImageController extends Controller
{
    public function thumbnail(string $path)
    {
        $fullPath = storage_path('app/public/'.$path);

        if (! file_exists($fullPath)) {
            abort(404);
        }

        $thumbnailPath = storage_path('app/thumbnails/'.$path);
        $thumbnailDir = dirname($thumbnailPath);

        // Create thumbnail if it doesn't exist
        if (! file_exists($thumbnailPath)) {
            if (! file_exists($thumbnailDir)) {
                mkdir($thumbnailDir, 0755, true);
            }

            // Use GD for simple image resizing
            $image = imagecreatefromjpeg($fullPath);
            $width = imagesx($image);
            $height = imagesy($image);

            // Calculate new dimensions (max width 400px)
            $maxWidth = 400;
            $ratio = $maxWidth / $width;
            $newWidth = $maxWidth;
            $newHeight = intval($height * $ratio);

            // Create thumbnail
            $thumb = imagecreatetruecolor($newWidth, $newHeight);
            imagecopyresampled($thumb, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

            // Save thumbnail with compression
            imagejpeg($thumb, $thumbnailPath, 75);

            imagedestroy($image);
            imagedestroy($thumb);
        }

        return response()->file($thumbnailPath, [
            'Content-Type' => 'image/jpeg',
            'Cache-Control' => 'public, max-age=31536000',
        ]);
    }
}
