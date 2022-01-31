<script lang="ts">
  import { page } from "$app/stores";
  import { GENDER } from "$lib/basics/constants";
  import { back } from "$lib/basics/utils";
  import * as api from "$lib/api/teachers";
  import Input from "$lib/ui/Input.svelte";
  import Radio from "$lib/ui/Radio.svelte";
  import InputPhones from "$lib/ui/InputPhones.svelte";
  import InputEmails from "$lib/ui/InputEmails.svelte";
  import InputAddress from "$lib/ui/InputAddress.svelte";
  import { addressObj, emailObj, phoneObj } from "$lib/basics/objects";

  export let data;
  let { email = [emailObj], phone = [phoneObj], address = [addressObj], ...person } = data;

  const person_id = person?.id || null;

  const save = async () => {
    const promises = [];
    // enrich data with person_id
    phone = phone.map((el) => ({ ...el, person_id }));
    email = email.map((el) => ({ ...el, person_id }));
    address = address.map((el) => ({ ...el, person_id }));
    // what to delete
    const phoneToDelete = data.phone.filter((o) => !phone.find((o2) => o.id === o2.id)).map((el) => el.id);
    const emailToDelete = data.email.filter((o) => !email.find((o2) => o.id === o2.id)).map((el) => el.id);
    const addressToDelete = data.address.filter((o) => !address.find((o2) => o.id === o2.id)).map((el) => el.id);
    if (phoneToDelete.length > 0) promises.push(await api.phone.delete(phoneToDelete));
    if (emailToDelete.length > 0) promises.push(await api.email.delete(emailToDelete));
    if (addressToDelete.length > 0) promises.push(await api.address.delete(addressToDelete));

    // what to add
    const phoneToAdd = phone.filter((el) => !el.hasOwnProperty("id"));
    const emailToAdd = email.filter((el) => !el.hasOwnProperty("id"));
    const addressToAdd = address.filter((el) => !el.hasOwnProperty("id"));
    if (phoneToAdd.length > 0) promises.push(await api.phone.post(phoneToAdd));
    if (emailToAdd.length > 0) promises.push(await api.email.post(emailToAdd));
    if (addressToAdd.length > 0) promises.push(await api.address.post(addressToAdd));

    // what to update
    const phoneToUpdate = phone.filter((el) => el.hasOwnProperty("id"));
    const emailToUpdate = email.filter((el) => el.hasOwnProperty("id"));
    const addressToUpdate = address.filter((el) => el.hasOwnProperty("id"));
    if (phoneToUpdate.length > 0) promises.push(await api.phone.update(phoneToUpdate));
    if (emailToUpdate.length > 0) promises.push(await api.email.update(emailToUpdate));
    if (addressToUpdate.length > 0) promises.push(await api.address.update(addressToUpdate));

    promises.push(await api.person.update(person));

    Promise.all(promises);
    back($page.url.pathname);
  };
  const remove = async () => {
    await Promise.all([await api.phone.delete(person_id), await api.email.delete(person_id), await api.address.delete(person_id)]);
    await api.person.delete(person_id);
    back($page.url.pathname);
  };
</script>

<Input bind:value={person.first_name} label="First Name" placeholder="First Name" />
<Input bind:value={person.last_name} label="Last Name" placeholder="Last Name" />
<Input bind:value={person.birthday} label="Birthday" placeholder="Birthday" type="date" />
<Radio bind:value={person.gender} items={GENDER} label="Gender" labelFieldName="name" valueFieldName="value" />
<InputEmails bind:value={email} label="Email" />
<InputPhones bind:value={phone} label="Phone" />
<InputAddress bind:value={address} label="Address" />

<span class="col-span-full" />
<button class="rounded-l-none" on:click={save}>Save Changes</button>
<button class="rounded-l-none" on:click={() => back($page.url.pathname)}>Cancel</button>
<button class="rounded-l-none" on:click={remove}>Delete Contact</button>
