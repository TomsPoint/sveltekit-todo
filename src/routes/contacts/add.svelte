<script lang="ts">
  import * as api from "$lib/api/contacts";

  import { page } from "$app/stores";
  import { GENDER } from "$lib/basics/constants";
  import { back } from "$lib/basics/utils";
  import { addressObj, emailObj, personObj, phoneObj } from "$lib/basics/objects";
  import Input from "$lib/ui/Input.svelte";
  import Radio from "$lib/ui/Radio.svelte";
  import InputPhones from "$lib/ui/InputPhones.svelte";
  import InputEmails from "$lib/ui/InputEmails.svelte";
  import InputAddress from "$lib/ui/InputAddress.svelte";

  let person = personObj;
  let email = [emailObj];
  let phone = [phoneObj];
  let address = [addressObj];

  const add = async () => {
    const promises = [];
    const res_person = await api.person.post(person);
    const person_id = res_person[0].id;

    if (phone.length > 0) {
      phone = phone.map((el) => ({ ...el, person_id }));
      promises.push(await api.phone.post(phone));
    }
    if (email.length > 0) {
      email = email.map((el) => ({ ...el, person_id }));
      promises.push(await api.email.post(email));
    }
    if (address.length > 0) {
      address = address.map((el) => ({ ...el, person_id }));
      promises.push(await api.address.post(address));
    }

    await Promise.all([promises]);

    back($page.url.pathname);
  };
</script>

<svelte:head>
  <title>Add Contact</title>
</svelte:head>

<section>
  <div class="grid gap-4 grid-cols-2">
    <h1 class="text-center">Add New Contact:</h1>
    <h2>Personal Information:</h2>
    <Input bind:value={person.first_name} label="First Name" placeholder="First Name" />
    <Input bind:value={person.last_name} label="Last Name" placeholder="Last Name" />
    <Input bind:value={person.birthday} label="Birthday" placeholder="Birthday" type="date" />
    <Radio bind:value={person.gender} items={GENDER} label="Gender" labelFieldName="name" valueFieldName="value" />
    <InputEmails bind:value={email} label="Email" />
    <InputPhones bind:value={phone} label="Phone" />
    <InputAddress bind:value={address} label="Address" />

    <hr class="col-span-full" />
    <button class="rounded-l-none" on:click={add}>Add Contact</button>
    <button class="rounded-l-none" on:click={() => back($page.url.pathname)}>Cancel</button>
  </div>
</section>
