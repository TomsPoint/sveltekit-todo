<script>
  import DateInput from "$lib/components/date/DateInput.svelte";
  import dayjs from "dayjs";
  import weekOfYear from "dayjs/plugin/weekOfYear";
  import isoWeek from "dayjs/plugin/isoWeek";
  import { DATEFORMAT } from "$lib/constants";

  dayjs.extend(weekOfYear);
  dayjs.extend(isoWeek);

  export let date = new Date();
  export let week = dayjs(date).week();
  export let start = dayjs(date).isoWeekday(1);
  export let end = dayjs(date).isoWeekday(7);

  const lastWeek = () => (date = dayjs(date).subtract(7, "day").toDate());
  const nextWeek = () => (date = dayjs(date).add(7, "day").toDate());

  $: week = dayjs(date).isoWeek();
  $: start = dayjs(date).isoWeekday(1);
  $: end = dayjs(date).isoWeekday(7);
</script>

<section class="grid grid-cols-3 gap-2 p-2 m-2 place-items-center mx-auto ">
  <span class="flex gap-2"> <DateInput bind:date /> <button on:click={() => (date = new Date())}>Today</button></span>
  <span class="flex gap-2 place-items-center">
    <span class=" w-[8ch]">Week: {week}</span>
    <span class="cursor-pointer text-2xl w-auto" on:click={lastWeek}>⊝</span>
    <span class="cursor-pointer text-2xl w-auto" on:click={nextWeek}>⊕</span>
  </span>
  <span class="justify-self-start">
    <span class="mr-4">{dayjs(start).format("dddd " + DATEFORMAT)}</span>
    <span class="">{dayjs(end).format("dddd " + DATEFORMAT)}</span>
  </span>
</section>
