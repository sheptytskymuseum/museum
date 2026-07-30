import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return renderOgImage({
        title: "Контакти",
        subtitle: "Музей митрополита Андрея",
    });
}
