<script lang="ts">
    import Icon from "svelte-awesome";
    import { Link } from "svelte-routing";

    export let links = [];
    let path: string = window.location.pathname;

    const updatePath = (newPath) => (path = newPath);
</script>

<nav>
    <header>
        <h1>Svelte Go Template</h1>
    </header>
    <ul class="m-0 p-0 h-full">
        {#each links as l}
            <li class:selected={l.to === path}>
                <Link
                    on:click={() => updatePath(l.to)}
                    class="flex flex-col justify-center text-gray-300 hover:text-gray-500 no-underline"
                    to={l.to}
                >
                    <Icon
                        class="w-full text-gray-300"
                        data={l.icon}
                        label={l.label}
                        scale="1.75"
                    />
                    <span class="text-sm">{l.label}</span>
                </Link>
            </li>
        {/each}
    </ul>
</nav>

<style lang="postcss">
    nav {
        width: 150px;
        @apply bg-gray-700 text-gray-300 py-5 px-0 shadow-md;
    }

    nav h1 {
        @apply text-sm text-center pb-4;
    }

    li {
        @apply my-0 py-4 flex justify-center no-underline;
    }

    li span {
        margin-top: 5px;
        @apply no-underline;
    }

    .selected {
        @apply bg-gray-600 shadow-md;
    }
</style>
