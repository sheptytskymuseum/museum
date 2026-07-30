import { renderOgImage } from "@/lib/og-image";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return renderOgImage({
        title: "Музей митрополита Андрея",
        subtitle: "Львів, вул. Максима Кривоноса 1",
    });
}
