<script lang="ts" context="module">
  import { get, post, deleteId, put } from "$lib/api";

  export async function load() {
    return {
      props: { ideas: await get("idea") },
    };
  }
</script>

<script>
  import { session } from "$app/stores";
  import AddIdea from "$lib/components/ideas/AddIdea.svelte";
  import Idea from "$lib/components/ideas/Idea.svelte";

  export let ideas = [];

  const getIdeas = async () => (ideas = await get("idea"));

  const add = async (e) => {
    await post("idea", { task: e.detail, user_id: $session.user.id });
    getIdeas();
  };
  const remove = async (e) => {
    await deleteId("idea", e.detail.id);
    getIdeas();
  };

  const update = async (e) => {
    await put("idea", e.detail);
  };
</script>

<section>
  <h2>Ideas</h2>
  <AddIdea on:add={add} />
  {#if ideas.length > 0}
    <h2>Things you have to do:</h2>
  {:else}
    <h2>You have nothing to do!</h2>
  {/if}
  <ul>
    {#each ideas as idea}
      <Idea {idea} on:update={update} on:remove={remove} />
    {/each}
  </ul>
</section>
