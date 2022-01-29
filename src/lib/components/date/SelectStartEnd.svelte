<script lang="ts">
  import DateInput from "$lib/components/date/DateInput.svelte";

  export let start;
  export let end;
</script>

<div>
  <p>Select start and end Date:</p>
  <DateInput bind:date={start} />
  <DateInput bind:date={end} />
</div>
