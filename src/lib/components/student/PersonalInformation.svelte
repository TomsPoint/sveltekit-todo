<script lang="ts">
  import { page } from "$app/stores";
  import { GENDER, WEEKLY_STATUS } from "$lib/basics/constants";
  import { back } from "$lib/basics/utils";
  import * as api from "$lib/api/students";
  import Input from "$lib/ui/Input.svelte";
  import Radio from "$lib/ui/Radio.svelte";
  import InputPhones from "$lib/ui/InputPhones.svelte";
  import InputEmails from "$lib/ui/InputEmails.svelte";
  import { addressObj, emailObj, phoneObj, studentObj } from "$lib/basics/objects";

  export let data;
  let { email = [emailObj], phone = [phoneObj], address = [addressObj], student = studentObj, ...person } = data;

  const person_id = person?.id || null;
  const student_id = student?.id || null;

  const save = async () => {
    const promises = [];
    // enrich data with person_id
    phone = phone.map((el) => ({ ...el, person_id }));
    email = email.map((el) => ({ ...el, person_id }));
    // what to delete
    const phoneToDelete = data.phone.filter((o) => !phone.find((o2) => o.id === o2.id)).map((el) => el.id);
    const emailToDelete = data.email.filter((o) => !email.find((o2) => o.id === o2.id)).map((el) => el.id);
    if (phoneToDelete.length > 0) phoneToDelete.forEach(async (id) => promises.push(await api.phone.delete(id)));
    if (emailToDelete.length > 0) emailToDelete.forEach(async (id) => promises.push(await api.email.delete(id)));
    // what to add
    const phoneToAdd = phone.filter((el) => !el.hasOwnProperty("id"));
    const emailToAdd = email.filter((el) => !el.hasOwnProperty("id"));
    // const addressToAdd = address.filter((el) => !el.hasOwnProperty("id"));
    if (phoneToAdd.length > 0) phoneToAdd.forEach(async (phone) => promises.push(await api.phone.post(phone)));
    if (emailToAdd.length > 0) emailToAdd.forEach(async (email) => promises.push(await api.email.post(email)));
    // what to update
    const phoneToUpdate = phone.filter((el) => el.hasOwnProperty("id"));
    const emailToUpdate = email.filter((el) => el.hasOwnProperty("id"));
    if (phoneToUpdate.length > 0) promises.push(await api.phone.update(phoneToUpdate));
    if (emailToUpdate.length > 0) promises.push(await api.email.update(emailToUpdate));

    promises.push(await api.person.update(person));
    promises.push(
      await api.students.update({
        id: student.id,
        short_name: student.short_name,
        certificate_name: student.certificate_name,
        school: student.school,
        weekly_status: student.weekly_status,
        portfolio: student.portfolio,
        git_username: student.git_username,
        scratch_username: student.scratch_username,
      })
    );

    Promise.all(promises);
    back($page.url.pathname);
  };

  const removeFromStudent = async () => {
    await api.person.update({ id: person.id, student_id: null });
    await api.students.delete(student_id);
    back($page.url.pathname);
  };
</script>

<Input bind:value={person.first_name} label="First Name" placeholder="First Name" />
<Input bind:value={person.last_name} label="Last Name" placeholder="Last Name" />
<Input bind:value={student.short_name} label="Preferred Name" placeholder="Preferred Name" />
<Input bind:value={student.certificate_name} label="Name for Certificates" placeholder="Name for Certificates" />
<Input bind:value={person.birthday} label="Birthday" placeholder="Birthday" type="date" />
<Radio bind:value={person.gender} items={GENDER} label="Gender" labelFieldName="name" valueFieldName="value" />
<InputEmails bind:value={email} label="Email" />
<InputPhones bind:value={phone} label="Phone" />
<Input bind:value={student.school} label="School" placeholder="Name of School" />
<Radio bind:value={student.weekly_status} items={WEEKLY_STATUS} label="Status" labelFieldName="weekly_status" />
<Input bind:value={student.scratch_username} label="Scratch Username" placeholder=" Scratch Username" multiple />
<Input bind:value={student.git_username} label="Git Username" placeholder=" Git Username" multiple />
<Input bind:value={student.portfolio} label="Portfolio" placeholder=" Portfolio" multiple />
<hr class="col-span-full" />
<button class="rounded-l-none" on:click={removeFromStudent}>Remove from Students</button>
<button class="rounded-l-none" on:click={() => back($page.url.pathname)}>Cancel</button>
<button class="rounded-l-none" on:click={save}>Save Changes</button>
