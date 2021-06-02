<script lang="ts">
    import { time, serverTime } from "../store";
    import { format } from "date-fns";
    import ServerError from "../components/ServerError.svelte";
</script>

<section>
    <h2>Time Now</h2>
    <section>
        The time is {format($time, "ppp")}. <br />
        The server says {$serverTime.now}.
        <ServerError error={$serverTime.error} />
    </section>
</section>
