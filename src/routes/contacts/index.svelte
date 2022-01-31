<script context="module" lang="ts">
  import * as api from "$lib/api/contacts";
  export async function load() {
    return { props: { persons: await api.contacts.get() } };
  }
</script>

<script lang="ts">
  import type { Person } from "$lib/basics/interface";

  import { page } from "$app/stores";
  import Input from "$lib/ui/Input.svelte";
  import TypeFilter from "$lib/components/filter/TypeFilter.svelte";

  export let persons: Person[];

  let filter = "";
  let filteredTypes = [];

  let data = persons.map((person) => {
    return {
      ...person,
      name: person.first_name + " " + person.last_name,

      phone: person.phone.length === 0 ? [{ phone: "", primary: false, whatsapp: false }] : person.phone,
      email: person.email.length === 0 ? [{ email: "", primary: false }] : person.email,
    };
  });

  $: prefilteredContact = data.filter((obj) => filteredTypes.some((el) => obj[el] !== null));

  $: filteredContacts =
    filter.length === 0 ? prefilteredContact : prefilteredContact.filter((person) => person.name.toLowerCase().includes(filter.toLowerCase()));
</script>

<svelte:head>
  <title>Contacts</title>
</svelte:head>

<section>
  <h1>Contacts:</h1>
  <div class="grid gap-4 grid-cols-4 pb-8">
    <Input bind:value={filter} label="Filter" />
    <!-- <ProgramFilter bind:filteredPrograms /> -->
    <TypeFilter bind:filteredTypes class="col-span-2" />
    <span class=" place-self-center">
      <a class="button w-max justify-self-start" href="{$page.url.pathname}/add">Add Contact</a>
    </span>
  </div>
  <ul class="data-table">
    <li class="table-header">
      <span class="left">Name</span>
      <span class="left">Email</span>
      <span class="left">Phone</span>
      <span>Student</span>
      <span>Teacher</span>
      <span>Guardian</span>
      <span>Billing</span>
      <span>Lead</span>
      <span>&nbsp;</span>
    </li>
    {#each filteredContacts as { id, first_name, last_name, phone, email, birthday, student_id, teacher_id, billing_contact_id, contact_person_id, lead_id }}
      <li>
        <span class="left">{first_name} {last_name}</span>
        <span class="left">{email.find((el) => el.primary === true)?.email || email[0]?.email || ""}</span>
        <span class="left">{phone.find((el) => el.primary === true)?.phone || phone[0]?.phone || ""}</span>
        <span>{student_id === null ? "no" : "yes"}</span>
        <span>{teacher_id === null ? "no" : "yes"}</span>
        <span>{contact_person_id === null ? "no" : "yes"}</span>
        <span>{billing_contact_id === null ? "no" : "yes"}</span>
        <span>{lead_id === null ? "no" : "yes"}</span>
        <button class="edit"><a href="{$page.url.pathname}/edit-{id}">✐</a></button>
      </li>
    {/each}
    <p class="mt-4">
      <a class="button w-max justify-self-start" href="{$page.url.pathname}/add">Add Contact</a>
    </p>
  </ul>
</section>

<style lang="postcss">
  li {
    @apply grid gap-4 p-1 grid-cols-[repeat(1,20ch)repeat(1,25ch)repeat(1,15ch)repeat(5,6ch)repeat(1,auto)];
  }
</style>
