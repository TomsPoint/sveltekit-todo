<script>
  import { page } from "$app/stores";
  import { post, put } from "$lib/api_old";
  import { GENDER, WEEKLY_STATUS } from "$lib/constants";
  import { back } from "$lib/utils";
  import Input from "$lib/ui/Input.svelte";
  import Radio from "$lib/ui/Radio.svelte";
  import InputPhones from "$lib/ui/InputPhones.svelte";
  import InputEmails from "$lib/ui/InputEmails.svelte";
  import { emailObj, personObj, phoneObj, studentObj } from "$lib/objects";

  let person = personObj;
  let email = [emailObj];
  let phone = [phoneObj];
  let student = studentObj;

  const add = async () => {
    const res_person = await post("person", person);
    const res_student = await post("student", student);
    const person_id = res_person[0].id;
    const student_id = res_student[0].id;
    const promises = [];

    if (phone.length > 0) {
      phone = phone.map((el) => ({ ...el, person_id }));
      promises.push(await post("phone", phone));
    }
    if (email.length > 0) {
      email = email.map((el) => ({ ...el, person_id }));
      promises.push(await post("email", email));
    }

    promises.push(await put("person", { id: person_id, student_id }));

    await Promise.all([promises]);

    back($page.url.pathname);
  };
</script>

<svelte:head>
  <title>Add Student</title>
</svelte:head>

<section>
  <div class="grid gap-4 grid-cols-2">
    <h1 class="text-center">Add New Student:</h1>
    <h2>Personal Information:</h2>
    <Input bind:value={person.first_name} label="First Name" placeholder="First Name" />
    <Input bind:value={person.last_name} label="Last Name" placeholder="Last Name" />
    <Input bind:value={student.short_name} label="Short Name" placeholder="Short Name" />
    <Input bind:value={student.certificate_name} label="Name for Certificates" placeholder="Name for Certificates" />

    <Input bind:value={person.birthday} label="Birthday" placeholder="Birthday" type="date" />
    <Radio bind:value={person.gender} items={GENDER} label="Gender" labelFieldName="name" valueFieldName="value" />
    <InputEmails bind:value={email} label="Email" />
    <InputPhones bind:value={phone} label="Phone" />
    <h2>Student Information:</h2>
    <Input bind:value={student.school} label="School" placeholder="Name of School" />
    <Radio bind:value={student.weekly_status} items={WEEKLY_STATUS} label="Status" labelFieldName="weekly_status" />
    <Input bind:value={student.scratch_username} label="Scratch Username" placeholder=" Scratch Username" multiple />
    <Input bind:value={student.git_username} label="Git Username" placeholder=" Git Username" multiple />
    <Input bind:value={student.portfolio} label="Portfolio" placeholder=" Portfolio" multiple />

    <hr class="col-span-full" />
    <button class="rounded-l-none" on:click={add}>Add Student</button>
    <button class="rounded-l-none" on:click={() => back($page.url.pathname)}>Cancel</button>
  </div>
</section>
