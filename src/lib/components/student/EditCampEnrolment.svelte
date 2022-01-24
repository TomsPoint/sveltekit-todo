<script>
  import { put } from "$lib/api_old";

  // @ts-nocheck
  import { closeModal } from "svelte-modals";

  // provided by Modals
  export let isOpen;

  let data = {};

  const _save = async () => {
    await put("tablename", data);
    closeModal();
    location.reload();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Edit Camp Enrolment</h2>

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
