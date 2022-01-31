<script lang="ts">
  import * as api from "$lib/api/_api";
  import { closeModal } from "svelte-modals";

  // provided by Modals
  export let isOpen;

  let data = {};

  const _save = async () => {
    await api.API.update(data);
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
