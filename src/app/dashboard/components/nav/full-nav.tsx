import { MobileProfile } from "./mobile-profile";
import { Nav } from "./nav";
import { UserNav } from "./user-nav";

export async function FullNav() {

    return (
        <Nav
            desktopProfile={<UserNav />}
            mobileNav={<MobileProfile />}>
        </Nav>
    )
}