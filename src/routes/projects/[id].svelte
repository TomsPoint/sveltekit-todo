<script lang="ts" context="module">
  import * as api from "$lib/api/projects";

  export async function load({ params }) {
    return {
      props: { project: await api.projects.getById(params.idparams.id) },
    };
  }
</script>

<script lang="ts">
  import type { Program } from "$lib/basics/interface";

  import { goto } from "$app/navigation";
  import { getContext } from "svelte";
  import { uuid } from "$lib/basics/utils";

  import Tree from "$lib/ui/treeview/Tree.svelte";
  import Select from "$lib/ui/Select.svelte";

  export let project;
  const programs: Program[] = getContext("programs");

  let isEditing = false;

  const _onBack = () => goto("/projects");

  const toggleEditing = () => (isEditing = !isEditing);

  const _onOkay = async () => {
    await api.projects.update(project);
    toggleEditing();
  };
</script>

<svelte:head>
  <title>Add Projects</title>
</svelte:head>

<section>
  <div class="grid grid-cols-2 gap-4">
    <h1 class="mb-4 col-span-1">{project.name}</h1>
    <div class="flex gap-2 place-items-end">
      {#if isEditing}
        <button class="ml-auto" on:click={toggleEditing}> Cancel </button>
        <button on:click={() => _onOkay()}> Save </button>
      {:else}
        <button class="ml-auto" on:click={_onBack}> Back </button>
        <button class="cursor-pointer" on:click={toggleEditing}> ✎ </button>
      {/if}
    </div>
    <hr />
    <div>
      <span>Sort Order:</span>
      {#if isEditing}
        <input type="number" bind:value={project.sort_order} />
      {:else}
        <span>{project.sort_order}</span>
      {/if}
    </div>
    <div>
      <span>Program:</span>
      {#if isEditing}
        <Select items={programs} bind:value={project.program_id} />
      {:else}
        <span>{programs.find((el) => el.id === project.program_id).name}</span>
      {/if}
    </div>
    <hr />
    <Tree item={{ id: uuid(), name: "Progress" }} bind:items={project.progress} readonly expanded bind:isEditing />
    <Tree item={{ id: uuid(), name: "Learning Points" }} bind:items={project.learningpoints} readonly expanded bind:isEditing />
    <hr />
  </div>
</section>

<style lang="postcss">
  hr {
    @apply col-span-full my-2;
  }
</style>
