<script>
  import { LOCAL_MODE } from "$lib/common-library/utils/local-dev/modes";
</script>

{#if LOCAL_MODE}
  <div class="ViewportHelper fixed right-0 top-0 z-120 text-sm font-bold text-background uppercase">
    <p class="block bg-purple-500 sm:hidden">XS</p>
    <p class="hidden bg-red-500 sm:block md:hidden">SM</p>
    <p class="hidden bg-blue-500 md:block lg:hidden">MD</p>
    <p class="hidden bg-green-500 lg:block xl:hidden">LG</p>
    <p class="hidden bg-yellow-500 xl:block 2xl:hidden">XL</p>
    <p class="hidden bg-red-500 2xl:block 3xl:hidden">2XL</p>
    <p class="hidden bg-blue-500 3xl:block 4xl:hidden">3XL</p>
    <p class="5xl:hidden hidden bg-green-500 4xl:block">4XL</p>
  </div>
{/if}

<style>
  p {
    padding: 2px 4px;
    border-radius: 3px;
    margin-right: 0rem;
    margin-bottom: 1rem;
  }
</style>
