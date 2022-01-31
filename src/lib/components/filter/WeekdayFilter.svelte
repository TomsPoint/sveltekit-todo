<script>
  import { WEEKDAY, WEEKDAYS, WEEKEND } from "$lib/basics/constants";

  let weekdays = [];

  export let filteredWeekdays;
  $: filteredWeekdays = weekdays.length === 0 ? WEEKDAYS : weekdays;
</script>

<div class="flex gap-2 p-1 place-items-center">
  <button class="text-xs" on:click={() => (weekdays = [])}>CLEAR</button>
  <button class="text-xs" on:click={() => (weekdays = WEEKDAY)}>WEEKDAY</button>
  <button class="text-xs" on:click={() => (weekdays = WEEKEND)}>WEEKEND</button>
  {#each WEEKDAYS as day}
    <label class="flex gap-2 place-items-center uppercase">
      <input type="checkbox" bind:group={weekdays} name="weekdays" value={day} />
      {day.slice(0, 3)}
    </label>
  {/each}
</div>
