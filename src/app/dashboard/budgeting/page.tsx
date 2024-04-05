import { Metadata } from "next";
import { FullNav } from "../components/nav/full-nav";

export const metadata: Metadata = {
    title: "Budgeting",
    description: "Example budgeting app built using the components.",
}

export default function Budgeting() {
    return (
        <div>
            <FullNav />
        </div>
    );
} 