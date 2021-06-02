<script lang="ts">
    import { Alert } from "sveltestrap";

    export let error: string = null;
</script>

<div class="my-4">
    {#if error}
        <Alert fade={false} color="danger">
            <h4>There was a problem</h4>
            {error}
        </Alert>
    {/if}
</div>
