<script>
  import { page, session } from "$app/stores";
  import { supabase } from "$lib/db";
</script>

<nav class="grid gap-2 grid-flow-col">
  <a sveltekit:prefetch href="/" class:active={$page.path === "/"}>Home</a>
  <a sveltekit:prefetch href="/about" class:active={$page.path === "/about"}> About </a>
  <a sveltekit:prefetch href="/profile" class:active={$page.path === "/profile"}> Profile </a>
  {#if $session.user.aud === "authenticated"}
    <span on:click={async () => await supabase.auth.signOut()}>Sign Out</span>
  {:else}
    <a sveltekit:prefetch href="/auth" class:active={$page.path === "/auth"}> Sign In </a>
  {/if}
</nav>

<style>
  .active {
    color: var(--clr-primary, red);
  }
</style>
