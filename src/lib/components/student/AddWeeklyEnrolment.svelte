<script lang="ts">
  import type { Program } from "$lib/basics/interface";

  import { getContext } from "svelte";
  import { closeModal } from "svelte-modals";
  import Input from "$lib/ui/Input.svelte";
  import InputDate from "$lib/ui/InputDate.svelte";
  import Select from "$lib/ui/Select.svelte";

  import * as api from "$lib/api/student_weekly_enrolment";

  // provided by Modals
  export let isOpen;
  export let student_id;

  const programs: Program[] = getContext("programs");

  let item = {
    frequency: 1,
    start_date: new Date(),
    end_date: new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ * 365 * 2),
    program_id: 0,
    student_id,
  };

  const _save = async () => {
    await api.enrolment.post(item);
    closeModal();
    location.reload();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Add Program Enrolment</h2>

      <Select items={programs} bind:value={item.program_id} label="Programs" labelFieldName="name" valueFieldName="id" />
      <Input bind:value={item.frequency} label="Frequency" type="number" />
      <InputDate bind:date={item.start_date} label="Start" />
      <InputDate bind:date={item.end_date} label="End" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
