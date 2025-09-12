import Link from "next/link";
import PageWrapper from "../components/page_wrapper/page_wrapper";

export default function notFound() {
    return (
        <PageWrapper>
            <h1>Сторінку не знайдено</h1>
            <p>
                Можливо, ви шукали щось важливе, як митрополит Шептицький шукав
                істину. Ми допоможемо вам її знайти.
            </p>
            <br />
            <Link href="/">Перейти на головну сторінку</Link>
        </PageWrapper>
    );
}
