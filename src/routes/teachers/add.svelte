<script>
  // @ts-nocheck
  import { page } from "$app/stores";
  import { getContext } from "svelte";
  import { post, put } from "$lib/api";
  import { GENDER } from "$lib/constants";
  import { back } from "$lib/utils";
  import { addressObj, emailObj, personObj, phoneObj, teacherObj } from "$lib/objects";
  import Input from "$lib/components/ui/Input.svelte";
  import Radio from "$lib/components/ui/Radio.svelte";
  import Select from "$lib/components/ui/Select.svelte";
  import InputPhones from "$lib/components/ui/InputPhones.svelte";
  import InputEmails from "$lib/components/ui/InputEmails.svelte";
  import InputAddress from "$lib/components/ui/InputAddress.svelte";

  const PROGRAM = getContext("programs");

  let person = personObj;
  let email = [emailObj];
  let phone = [phoneObj];
  let address = [addressObj];
  let teacher = teacherObj;

  const add = async () => {
    const res_person = await post("person", person);
    const res_teacher = await post("teacher", teacher);
    const person_id = res_person[0].id;
    const teacher_id = res_teacher[0].id;
    const promises = [];

    if (phone.length > 0) {
      phone = phone.map((el) => ({ ...el, person_id }));
      promises.push(await post("phone", phone));
    }
    if (email.length > 0) {
      email = email.map((el) => ({ ...el, person_id }));
      promises.push(await post("email", email));
    }
    if (address.length > 0) {
      address = address.map((el) => ({ ...el, person_id }));
      promises.push(await post("address", address));
    }

    promises.push(await put("person", { id: person_id, teacher_id }));

    await Promise.all([promises]);

    back($page.url.pathname);
  };
</script>

<svelte:head>
  <title>Add Teacher</title>
</svelte:head>

<section>
  <div class="grid gap-4 grid-cols-2">
    <h1 class="text-center">Add New Teacher:</h1>
    <h2>Personal Information:</h2>
    <Input bind:value={person.first_name} label="First Name" placeholder="First Name" />
    <Input bind:value={person.last_name} label="Last Name" placeholder="Last Name" />
    <Input bind:value={person.birthday} label="Birthday" placeholder="Birthday" type="date" />
    <Radio bind:value={person.gender} items={GENDER} label="Gender" labelFieldName="name" valueFieldName="value" />
    <InputEmails bind:value={email} label="Email" />
    <InputPhones bind:value={phone} label="Phone" />
    <InputAddress bind:value={address} label="Address" />
    <h2>Teaching Information:</h2>
    <Select items={PROGRAM} bind:value={teacher.programs} multiple labelFieldName="name" valueFieldName="label" tagFieldName="label" />

    <hr class="col-span-full" />
    <button class="rounded-l-none" on:click={add}>Add Teacher</button>
    <button class="rounded-l-none" on:click={() => back($page.url.pathname)}>Cancel</button>
  </div>
</section>
