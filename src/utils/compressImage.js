const MAX_DIMENSION = 1920;
const JPEG_QUALITY = 0.85;

export async function compressImage(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.onload = (e) => {
            const img = new Image();
            img.onerror = () => reject(new Error("Failed to load image"));
            img.onload = () => {
                let { width, height } = img;

                if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
                    if (width >= height) {
                        height = Math.round((height * MAX_DIMENSION) / width);
                        width = MAX_DIMENSION;
                    } else {
                        width = Math.round((width * MAX_DIMENSION) / height);
                        height = MAX_DIMENSION;
                    }
                }

                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, width, height);

                const isPng = file.type === "image/png";
                const outputType = isPng ? "image/png" : "image/jpeg";

                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error("Compression failed"));
                            return;
                        }
                        resolve(
                            new File([blob], file.name, {
                                type: outputType,
                                lastModified: Date.now(),
                            }),
                        );
                    },
                    outputType,
                    isPng ? undefined : JPEG_QUALITY,
                );
            };
            img.src = e.target.result;
        };

        reader.readAsDataURL(file);
    });
}
