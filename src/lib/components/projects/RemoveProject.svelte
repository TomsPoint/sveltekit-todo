<script>
  import { del } from "$lib/api_old";
  import { getContext } from "svelte";
  const { close } = getContext("simple-modal");

  export let project;

  const _onCancel = () => close();

  const _onOkay = async () => {
    await del("projects", project.id);
    close();
    location.reload();
  };
</script>

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

<style lang="postcss">
  button {
    @apply hover:scale-50;
  }
</style>
