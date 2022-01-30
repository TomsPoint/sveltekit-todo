<script lang="ts">
  import ProgramDetails from "./ProgramDetails.svelte";

  export let programs;
  export let date;
  export let time_slot;

  $: unique_programs = [...new Set(time_slot.classroom.map((item) => item.program_id))];
  $: filteredPrograms = programs.filter((program) => unique_programs.includes(program.id));
</script>

{#each filteredPrograms as program (program.id)}
  <ProgramDetails {program} {date} {time_slot} />
{/each}
