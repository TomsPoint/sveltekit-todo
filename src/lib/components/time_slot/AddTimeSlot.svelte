<script>
  // @ts-nocheck

  import { createEventDispatcher, getContext } from "svelte";
  import { TIMESLOTS, WEEKDAYS } from "$lib/constants";
  // import Select from "simple-svelte-autocomplete";
  import Select from "$lib/ui/Select.svelte";

  const dispatch = createEventDispatcher();

  let newData = {
    weekday: "",
    time: "",
    programs: [],
  };

  let programs = getContext("programs").map((a) => a.label);

  const add = async () => {
    dispatch("add", newData);
  };
</script>

<form on:submit|preventDefault={add}>
  <label for="">
    Weekday:
    <Select items={WEEKDAYS} bind:selectedItem={newData.weekday} />
  </label>
  <label for="">
    Timeslot:
    <Select items={TIMESLOTS} bind:selectedItem={newData.time} />
  </label>
  <label for="">
    Program(s):
    <Select items={programs} bind:selectedItem={newData.programs} multiple />
  </label>

  <button class="rounded-l-none place-self-end h-10">Add Time Slot</button>
</form>

<style lang="postcss">
  form {
    @apply flex gap-2;
  }
  label {
    @apply grid text-sm;
  }
</style>
