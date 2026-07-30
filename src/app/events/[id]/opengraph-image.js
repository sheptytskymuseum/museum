import { renderOgImage } from "@/lib/og-image";
import { getEvent } from "@/lib/events";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
    const { id } = await params;
    const event = await getEvent(id);

    return renderOgImage({
        title: event?.title || "Подія",
        subtitle: "Музей митрополита Андрея",
    });
}
