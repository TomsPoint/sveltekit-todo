<script>
  // @ts-nocheck
  import { get, put } from "$lib/api_old";
  import { MODI } from "$lib/constants";
  import { onMount } from "svelte";
  import { closeModal } from "svelte-modals";
  import Input from "$lib/ui/Input.svelte";
  import InputDate from "$lib/ui/InputDate.svelte";
  import Radio from "$lib/ui/Radio.svelte";

  // provided by Modals
  export let isOpen;
  export let programs;
  console.log("🚀  ~ file: EditClass.svelte ~ line 14 ~ programs", programs);
  export let item;
  console.log("🚀  ~ file: EditClass.svelte ~ line 15 ~ item", item);

  let newClass = {
    id: item.id,
    time_slot_id: item.time_slot_id,
    teacher_id: item.teacher_id,
    program_id: item.program_id,
    mode: item.mode,
    capacity: item.capacity,
    start_date: item.start_date,
    end_date: item.end_date,
  };

  const setMaxCapacity = () => (newClass.capacity = newClass.mode === "offline" ? 6 : 4);

  const saveClass = async () => {
    const res = await put("classroom", newClass);
    console.log("🚀  ~ file: EditClass.svelte ~ line 32 ~ res", res);
    closeModal();
    location.reload();
  };

  $: console.log("🚀  ~~ newClass", newClass);
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Edit Class</h2>
      <h3>{programs.find((el) => el.id === item.program_id).name} - {item.time_slot.weekday} {item.time_slot.time}</h3>
      <Radio bind:value={newClass.mode} items={MODI} label="Mode" labelFieldName="name" valueFieldName="value" on:change={setMaxCapacity} />
      <Input
        bind:value={newClass.capacity}
        label="Capacity"
        type="range"
        min="0"
        max={newClass.program_id === 4 ? 6 : newClass.mode === "offline" ? 6 : 4}
        step="1"
      />
      <InputDate bind:date={newClass.start_date} label="Start Date" />
      <InputDate bind:date={newClass.end_date} label="End Date" />

      <div class="actions">
        <button on:click={closeModal}>Cancel</button>
        <button on:click={saveClass}>Save</button>
      </div>
    </div>
  </div>
{/if}
