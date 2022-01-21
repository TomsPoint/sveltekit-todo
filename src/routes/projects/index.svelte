<script context="module">
  import { get } from "$lib/api";

  export async function load() {
    return {
      props: { projects: await get("project") },
    };
  }
</script>

<script>
  // @ts-nocheck
  import { openModal } from "svelte-modals";
  import { getContext } from "svelte";

  import AddProject from "$lib/components/projects/AddProject.svelte";
  import RemoveProject from "$lib/components/projects/RemoveProject.svelte";
  import Select from "$lib/components/ui/Select.svelte";

  export let projects = [];
  $: projects_filtered = !!program ? projects.filter((obj) => obj.program_id === program.id) : projects;

  const programs = getContext("programs");
  let program = programs[1];

  const addProject = () => openModal(AddProject, { program });
  const removeProject = (project) => openModal(RemoveProject, { project });
</script>

<section>
  <h1 class="mb-8">Projects</h1>

  <Select items={programs} bind:selectedItem={program} labelFieldName="name" valueFieldName="id" label="Program" placeholder="Please select a program" />
  {#if !!program}
    <button on:click={addProject}>Add Project</button>

    <div class="grid grid-cols-4 gap-4">
      {#each program.level as level, lvl}
        <ul class="data-table col-span-1">
          <li class="table-header">
            <h3>{level}</h3>
          </li>
          {#each projects_filtered.filter((project) => project.level === lvl) as project}
            <li>{project.name}</li>
          {/each}
        </ul>
      {/each}
    </div>
  {/if}
</section>

<style lang="postcss">
  ul {
    @apply mt-8;
    counter-reset: counter;
    & li {
      counter-increment: counter;
    }
    & li::marker {
      @apply text-base;
      content: counter(counter) ". ";
    }
  }
</style>
