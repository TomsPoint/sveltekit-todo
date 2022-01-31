<script context="module" lang="ts">
  import * as api from "$lib/api/projects";

  export async function load() {
    return {
      props: { projects: await api.projects.get() },
    };
  }
</script>

<script lang="ts">
  import type { Program } from "$lib/basics/interface";

  import { openModal } from "svelte-modals";
  import { getContext } from "svelte";

  import AddProject from "$lib/components/projects/AddProject.svelte";
  import RemoveProject from "$lib/components/projects/RemoveProject.svelte";
  import Select from "$lib/ui/Select.svelte";

  export let projects = [];
  $: projects_filtered = !!selectedProgram ? projects.filter((obj) => obj.program_id === selectedProgram.id) : projects;

  const programs: Program[] = getContext("programs");
  let selectedProgram: Program = programs[0];

  const addProject = () => openModal(AddProject, { program: selectedProgram });
  const removeProject = (project) => openModal(RemoveProject, { project });
</script>

<svelte:head>
  <title>Projects</title>
</svelte:head>

<section>
  <h1 class="mb-8">Projects</h1>

  <Select items={programs} bind:value={selectedProgram} labelFieldName="name" label="Program" placeholder="Please select a program" />
  {#if !!selectedProgram}
    <button on:click={addProject}>Add Project</button>

    <div class="grid grid-cols-4 gap-4">
      {#each selectedProgram.level as level, lvl}
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
