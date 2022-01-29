<script lang="ts">
  import type { Program } from "$lib/interface";

  import { getContext } from "svelte";

  const PROGRAMS: Program[] = getContext("programs");
  let programs = [];

  export let filteredPrograms;
  $: filteredPrograms = programs.length === 0 ? PROGRAMS : programs;
</script>

<div class="flex gap-2 p-1 place-items-center">
  <button class="text-xs" on:click={() => (programs = [])}>CLEAR</button>
  {#each PROGRAMS as program}
    <label class="flex gap-2 place-items-center uppercase">
      <input type="checkbox" bind:group={programs} name="programs" value={program} />
      {program.label}
    </label>
  {/each}
</div>
