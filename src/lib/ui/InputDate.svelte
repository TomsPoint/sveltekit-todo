<script lang="ts">
  import { uid } from "$lib/utils";

  import dayjs from "dayjs";

  export let id = uid();
  export let format = "YYYY-MM-DD";
  export let date = new Date();
  export let label = "";

  let internal;

  const input = (x) => (internal = dayjs(x).format(format));
  const output = (x) => (date = dayjs(x, format).toDate());

  $: input(date);
  $: output(internal);
</script>

<div class="grid gap-0 mb-2 content-start ">
  {#if label.length > 0}
    <label class="text-sm" for={id}>
      {label}
    </label>
  {/if}
  <input class="p-1 border rounded text-sm" type="date" bind:value={internal} {id} />
</div>
