<script>
  // @ts-nocheck
  import ProgramDetails from "./ProgramDetails.svelte";

  export let programs;
  export let date;
  export let time_slot;
  export let updateData;

  $: unique_programs = [...new Set(time_slot.classroom.map((item) => item.program_id))];
</script>

{#each programs.filter((program) => unique_programs.includes(program.id)) as program (program.id)}
  <ProgramDetails {program} {date} {time_slot} {updateData} />
{/each}
