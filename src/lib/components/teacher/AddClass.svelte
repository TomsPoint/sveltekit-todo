<script lang="ts">
  import type { Classroom, Program, Teacher, TimeSlot } from "$lib/basics/interface";

  import * as api from "$lib/api/classrooms";
  import { MODI } from "$lib/basics/constants";
  import { onMount } from "svelte";
  import { closeModal } from "svelte-modals";
  import Input from "$lib/ui/Input.svelte";
  import InputDate from "$lib/ui/InputDate.svelte";
  import Radio from "$lib/ui/Radio.svelte";
  import Select from "$lib/ui/Select.svelte";

  // provided by Modals
  export let isOpen;

  export let programs: Program[];
  export let teacher: Teacher;

  let time_slots;
  let filteredTimeslots;
  let program: Program[];
  let time_slot: TimeSlot[];

  onMount(async () => (time_slots = await api.classrooms.getTimeSlot()));

  let newClass: Classroom = {
    teacher_id: teacher.id,
    program_id: null,
    time_slot_id: null,
    mode: "offline",
    capacity: 6,
    start_date: new Date(),
    end_date: new Date("December 31, 2025 23:59:59"),
  };

  const setMaxCapacity = () => (newClass.capacity = newClass.mode === "offline" ? 6 : 4);
  const clearTimeslot = () => (time_slot = null);

  const saveClass = async () => {
    await api.classrooms.post(newClass);
    closeModal();
    location.reload();
  };

  // @ts-ignore
  $: newClass.program_id !== undefined && time_slots !== undefined && (filteredTimeslots = time_slots.filter((ts) => ts.duration === program.slot_duration));
  $: filteredPrograms = programs.filter((el) => {
    console.log("el", el);

    return el;
  });
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Add Class</h2>
      <Select
        bind:items={filteredPrograms}
        bind:selectedItem={program}
        bind:value={newClass.program_id}
        valueFieldName="id"
        labelFieldName="name"
        label="Program"
        onChange={clearTimeslot}
      />
      {#if newClass.program_id !== undefined}
        <Select
          bind:items={filteredTimeslots}
          bind:selectedItem={time_slot}
          bind:value={newClass.time_slot_id}
          valueFieldName="id"
          labelFieldName="label"
          label="Time Slot"
        />
      {/if}
      {#if newClass.time_slot_id !== null}
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
      {/if}
      <div class="actions">
        <button on:click={closeModal}>Cancel</button>
        <button on:click={saveClass}>Save</button>
      </div>
    </div>
  </div>
{/if}
