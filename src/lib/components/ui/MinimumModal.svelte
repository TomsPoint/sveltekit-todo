<script>
  // @ts-nocheck
  import { closeModal } from "svelte-modals";
  import { put } from "$lib/api";

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
      <h2>HEADLINE</h2>

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
