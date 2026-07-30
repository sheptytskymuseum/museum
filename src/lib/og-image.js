import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import path from "path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadAssets() {
    const [bold, regular, logo] = await Promise.all([
        readFile(
            path.join(
                process.cwd(),
                "src/assets/fonts/Nunito-Bold-Cyrillic.ttf",
            ),
        ),
        readFile(
            path.join(
                process.cwd(),
                "src/assets/fonts/Nunito-Regular-Cyrillic.ttf",
            ),
        ),
        readFile(path.join(process.cwd(), "public/images/logo.png")),
    ]);

    return {
        bold,
        regular,
        logoDataUrl: `data:image/png;base64,${logo.toString("base64")}`,
    };
}

export async function renderOgImage({ title, subtitle }) {
    const { bold, regular, logoDataUrl } = await loadAssets();

    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    background: "#f6f1ea",
                }}
            >
                <div style={{ display: "flex", height: 12, background: "#8a2f22" }} />
                <div
                    style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        padding: "0 80px",
                        gap: 56,
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={logoDataUrl}
                        alt=""
                        width={220}
                        height={220}
                        style={{ objectFit: "contain" }}
                    />
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <div
                            style={{
                                fontFamily: "Nunito",
                                fontWeight: 700,
                                fontSize: 56,
                                color: "#2b2320",
                                lineHeight: 1.15,
                            }}
                        >
                            {title}
                        </div>
                        {subtitle && (
                            <div
                                style={{
                                    marginTop: 20,
                                    fontFamily: "Nunito",
                                    fontWeight: 400,
                                    fontSize: 30,
                                    color: "#8a2f22",
                                }}
                            >
                                {subtitle}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
            fonts: [
                { name: "Nunito", data: bold, weight: 700, style: "normal" },
                {
                    name: "Nunito",
                    data: regular,
                    weight: 400,
                    style: "normal",
                },
            ],
        },
    );
}
