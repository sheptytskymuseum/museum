import EventsPreview from "@/components/events_preview/events_preview";
import IntroSection from "@/components/intro_section/intro_section";
import HistoryPreview from "@/components/history_preview/history_peview";
import Partners from "@/components/partners/partners";

export default function Home() {
    return (
        <>
            <IntroSection />
            <EventsPreview />
            {/* <HistoryPreview /> */}
            {/* <Partners /> */}
        </>
    );
}
