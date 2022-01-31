<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { ROUTES, PROTECTED_ROUTES } from "$lib/basics/constants";
  import { supabase, user } from "$lib/basics/db";

  const signOut = async () => {
    await supabase.auth.signOut();
    goto("/auth");
  };
</script>

<a href="/"><img src="/images/logo.svg" alt="LCCL Coding Academy" class=" w-24" /></a>
<nav>
  <ul class="flex">
    {#each ROUTES as { route, label }}
      {#if !PROTECTED_ROUTES.includes(route)}
        <li class:active={$page.url.pathname.includes(route)}>
          <a sveltekit:prefetch href={route}>{label}</a>
        </li>
      {:else if PROTECTED_ROUTES.includes(route) && $user}
        <li class:active={$page.url.pathname.includes(route)}>
          <a sveltekit:prefetch href={route}>{label}</a>
        </li>
      {/if}
    {/each}
  </ul>
</nav>
{#if $user}
  <span class="inline-block p-2 cursor-pointer" on:click={signOut}>Sign Out</span>
{:else}
  <a class="inline-block p-2 cursor-pointer" sveltekit:prefetch href="/auth"> Sign In </a>
{/if}

<style lang="postcss">
  li {
    @apply hover:border-b-2 hover:border-gray-400;
    a {
      @apply inline-block p-2;
    }
  }
  .active {
    @apply border-b-2 border-yellow-400;
  }
</style>
