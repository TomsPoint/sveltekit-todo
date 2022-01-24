<script lang="ts" context="module">
  import { getFiltered, put } from "$lib/api_old";

  export async function load({ params }) {
    return {
      props: { project: await getFiltered("projects", "*", { column: "id", value: params.id }) },
    };
  }
</script>

<script>
  // @ts-nocheck
  import { goto } from "$app/navigation";
  import { getContext } from "svelte";

  const curricula = getContext("curricula");

  import Tree from "$lib/components/treeview/Tree.svelte";
  import Select from "$lib/ui/Select.svelte";
  import { uuid } from "$lib/utils";

  export let project;
  console.log("🚀  ~ file: [id].svelte ~ line 18 ~ project", project);

  let isEditing = false;

  const _onBack = () => goto("/projects");

  const toggleEditing = () => (isEditing = !isEditing);

  const _onOkay = async () => {
    await put("projects", project);
    toggleEditing();
  };
</script>

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
      <span>Curricula:</span>
      {#if isEditing}
        <Select items={curricula} bind:value={project.curricula_id} />
      {:else}
        <span>{curricula.find((el) => el.id === project.curricula_id).name}</span>
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
