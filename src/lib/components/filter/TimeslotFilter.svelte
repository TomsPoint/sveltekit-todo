<script>
  let times = [];

  export let TIMESLOTS = [];

  let min60 = TIMESLOTS.filter((el) => el.duration === 60);
  let min90 = TIMESLOTS.filter((el) => el.duration === 90);

  let uniqueMin60 = [...new Set(min60.map((el) => el.time))];
  let uniqueMin90 = [...new Set(min90.map((el) => el.time))];

  export let filteredTimeslots;
  $: filteredTimeslots = times.length === 0 ? TIMESLOTS : TIMESLOTS.filter((el) => times.includes(el.time));
</script>

<div class="flex gap-x-4 flex-wrap place-items-center">
  <span>60 min</span>
  <button class="text-xs" on:click={() => (times = [])}>CLEAR</button>
  {#each uniqueMin60 as time}
    <label class="flex gap-2 place-items-center whitespace-nowrap ">
      <input type="checkbox" bind:group={times} name="weekdays" value={time} />
      {time.slice(0, -8)}
    </label>
  {/each}
</div>

<div class="flex gap-x-4 flex-wrap place-items-center">
  <span>90 min</span>
  <button class="text-xs" on:click={() => (times = [])}>CLEAR</button>
  {#each uniqueMin90 as time}
    <label class="flex gap-2 place-items-center whitespace-nowrap ">
      <input type="checkbox" bind:group={times} name="weekdays" value={time} />
      {time.slice(0, -8)}
    </label>
  {/each}
</div>
