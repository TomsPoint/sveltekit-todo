<script lang="ts">
  import * as api from "$lib/api/projects";
  import { closeModal } from "svelte-modals";

  // provided by Modals
  export let isOpen;
  export let project;

  const _onOkay = async () => {
    await api.projects.delete(project.id);
    closeModal();
    location.reload();
  };
  const _onCancel = () => close();
</script>

{#if isOpen}
  <h1>Remove Project: {project.name}</h1>
  <div class="grid  gap-4">
    <p class="span-2">
      Only remove a Project when you made a mistake adding it!<br />
      If you want to remove a project from the curriculum archive it!
    </p>
    <div class="grid grid-cols-3 gap-4 p-2 mt-2 pt-4 border-t">
      <button on:click={_onCancel}> Cancel </button>
      <button on:click={_onOkay}> Remove </button>
      <button on:click={_onOkay}> Archive </button>
    </div>
  </div>
{/if}

<style lang="postcss">
  button {
    @apply hover:scale-50;
  }
</style>
