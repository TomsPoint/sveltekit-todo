<script lang="ts" context="module">
  import * as api from "$lib/api/ideas";

  export async function load() {
    return { props: { ideas: await api.ideas.get() } };
  }
</script>

<script>
  import { user } from "$lib/db";
  import AddIdea from "$lib/components/ideas/AddIdea.svelte";
  import Idea from "$lib/components/ideas/Idea.svelte";

  export let ideas = [];

  const getIdeas = async () => (ideas = await api.ideas.get());

  const add = async (e) => {
    await api.ideas.post({ task: e.detail, user_id: $user.id });
    getIdeas();
  };
  const remove = async (e) => {
    await api.ideas.delete(e.detail.id);
    getIdeas();
  };

  const update = async (e) => {
    await api.ideas.update(e.detail);
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
