<script lang="ts">
    import { utctime, serverTime } from "../store";
    import { format } from "date-fns";
    import ServerError from "../components/ServerError.svelte";
</script>

<section>
    <h2>Time Now UTC</h2>
    <section>
        The time in UTC is {format($utctime, "pp")}. <br />
        The server says the UTC time is {$serverTime.nowUTC}.
        <ServerError error={$serverTime.error} />
    </section>
</section>
