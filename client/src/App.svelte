<script lang="ts">
    import "bootstrap/dist/css/bootstrap.min.css";
    import "normalize.css";
    import Tailwind from "./Tailwind.svelte";
    import type { SvelteComponent } from "svelte";
    import { Router, Route } from "svelte-routing";

    import { faChartLine } from "@fortawesome/free-solid-svg-icons";

    import type { IconDefinition } from "@fortawesome/free-solid-svg-icons";

    import TimeNow from "./routes/TimeNow.svelte";
    import TimeNowUTC from "./routes/TimeNowUTC.svelte";
    import Navbar from "./components/Navbar.svelte";

    interface NavLink {
        label: string;
        to: string;
        icon: IconDefinition;
        Component: typeof SvelteComponent;
    }

    const links: NavLink[] = [
        { label: "Now", to: "/", icon: faChartLine, Component: TimeNow },
        {
            label: "Now UTC",
            to: "/NowUTC",
            icon: faChartLine,
            Component: TimeNowUTC,
        },
    ];
</script>

<Tailwind />
<main class="flex w-full h-full">
    <Router>
        <Navbar {links} />
        <div class="flex-column py-5 px-5 w-full h-full overflow-y-auto">
            {#each links as link}
                <Route path={link.to} component={link.Component} />
            {/each}
        </div>
    </Router>
</main>
