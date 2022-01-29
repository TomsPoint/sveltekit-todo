<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { ROUTES, PROTECTED_ROUTES } from "$lib/constants";
  import { supabase, user } from "$lib/db";

  const signOut = async () => {
    await supabase.auth.signOut();
    goto("/auth");
  };
</script>

<nav class="flex justify-evenly ">
  <ul class="flex">
    {#each ROUTES as { route, label }}
      {#if !PROTECTED_ROUTES.includes(route)}
        <li class="hover:text-yellow-400 p-2" class:active={$page.url.pathname === route}><a sveltekit:prefetch href={route}>{label}</a></li>
      {:else if PROTECTED_ROUTES.includes(route) && $user}
        <li class="hover:text-yellow-400 p-2" class:active={$page.url.pathname === route}><a sveltekit:prefetch href={route}>{label}</a></li>
      {/if}
    {/each}
  </ul>
  {#if $user}
    <span class="inline-block p-2 cursor-pointer" on:click={signOut}>Sign Out</span>
  {:else}
    <a class="inline-block p-2 cursor-pointer" sveltekit:prefetch href="/auth"> Sign In </a>
  {/if}
</nav>

<style lang="postcss">
  .active {
    @apply border-b-2 border-yellow-400;
  }
</style>
