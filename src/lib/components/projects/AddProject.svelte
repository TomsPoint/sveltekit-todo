<script>
  // @ts-nocheck
  import { closeModal } from "svelte-modals";
  import { put } from "$lib/api_old";
  import Input from "../../ui/Input.svelte";
  import Radio from "../../ui/Radio.svelte";

  // provided by Modals
  export let isOpen;
  export let program;
  console.log("🚀  ~ file: AddProject.svelte ~ line 9 ~ program", program);

  let data = {
    program_id: program.id,
    name: "",
    level: 0,
    status: "active",
    learning_points: [{}],
    progress: [{}],
  };
  $: console.log("🚀  ~ file: AddProject.svelte ~ line 15 ~ data", data);

  const _save = async () => {
    await put("project", data);
    closeModal();
    location.reload();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>HEADLINE</h2>
      <Input bind:value={data.name} label="Project name" placeholder="Project name" />
      <Input bind:value={data.level} type="range" label="Level: {program.level[data.level]}" min="0" max={program.level.length - 1} hideRangeValue />
      <Radio bind:value={data.status} items={["in development", "active", "paused", "retired"]} label="Project status:" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
