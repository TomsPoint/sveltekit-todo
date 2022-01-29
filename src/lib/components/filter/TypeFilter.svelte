<script lang="ts">
  const TYPES = [
    { name: "Student", value: "student_id" },
    { name: "Teacher", value: "teacher_id" },
    { name: "Guardian", value: "contact_person_id" },
    { name: "Billing", value: "billing_contact_id" },
    { name: "Lead", value: "lead_id" },
  ];

  let types = [];

  export let filteredTypes;
  $: filteredTypes = types.length === 0 ? TYPES : types;
</script>

<div class="flex gap-2 p-1 place-items-center {$$props.class}">
  <button class="text-xs" on:click={() => (types = [])}>CLEAR</button>
  {#each TYPES as type}
    <label class="flex gap-2 place-items-center uppercase">
      <input type="checkbox" bind:group={types} name="programs" value={type.value} />
      {type.name}
    </label>
  {/each}
</div>
