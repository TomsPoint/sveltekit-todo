<script lang="ts">
  import TreeView from "$lib/ui/treeview/TreeView.svelte";
  import TreeEdit from "$lib/ui/treeview/TreeEdit.svelte";

  export let item;
  export let items;
  export let readonly;
  export let expanded;

  export let isEditing = false;
</script>

<div>
  {#if isEditing}
    <TreeEdit {item} bind:items {readonly} {expanded} />
  {:else}
    <TreeView {item} bind:items {readonly} {expanded} />
  {/if}
</div>
