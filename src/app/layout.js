import Header from "@/components/header/header";
import Footer from "@/components/footer/footer";
import AuthProvider from "@/components/auth_provider/auth_provider";
import "@/styles/global.css";
import { Nunito, Oswald } from "next/font/google";

const nunito = Nunito({
    subsets: ["cyrillic"],
    weight: ["400", "700"],
    variable: "--font-nunito",
});

const oswald = Oswald({
    subsets: ["cyrillic"],
    weight: ["400", "700"],
    variable: "--font-oswald",
});

export const metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://example.com",
    ),
    title: {
        default: "Музей митрополита Андрея",
        template: "%s | Музей митрополита Андрея",
    },
    description:
        "Музей митрополита Андрея Шептицького у Львові — простір пізнання української історії, ідентичності та духовних цінностей.",
};

export default function RootLayout({ children }) {
    return (
        <html lang="uk">
            <body className={`${nunito.variable} ${oswald.variable}`}>
                <AuthProvider>
                    <Header />
                    <main className="container">{children}</main>
                    <Footer />
                </AuthProvider>
            </body>
        </html>
    );
}
