<script lang="ts">
  import { closeModal } from "svelte-modals";
  import * as api from "$lib/api/student_camp_enrolment";

  // provided by Modals
  export let isOpen;

  let data = {};

  const _save = async () => {
    await api.enrolment.post(data);
    closeModal();
    location.reload();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Add Camp Enrolment</h2>

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
