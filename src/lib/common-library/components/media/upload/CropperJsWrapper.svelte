<script lang="ts">
  import Cropper from "cropperjs";
  import { tick } from "svelte";
  import type { Attachment } from "svelte/attachments";
  import Button from "$lib/components/ui/button/button.svelte";
  import { cn } from "$lib/utils";

  let {
    id = "cropperWrapper",
    sourceSrc = $bindable(),
    actionsToShow = { done: true, cancel: true },
    showCropper = $bindable(),
    class: className,
    handleCropped,
  }: {
    id?: string;
    showCropper: boolean;
    sourceSrc: string;
    actionsToShow?: {
      done?: boolean;
      cancel?: boolean;
    };
    class?: string;
    handleCropped: (dataUri: string) => any;
  } = $props();
  let cropper: Cropper;

  function getDataUri() {
    const result = cropper.getCropperSelection();

    result?.$toCanvas().then((d) => {
      const croppedDataUri = d.toDataURL("image/png", 1);
      handleCropped(croppedDataUri);
    });

    showCropper = false;
  }

  // onMount(() => {
  //   document.querySelector("cropper-image")?.addEventListener("transform", limitBoundaries);

  //   return () => {
  //     document.querySelector("cropper-image")?.removeEventListener("transform", limitBoundaries);
  //   };
  // });

  // function limitBoundaries(event: any) {
  //   //TODO: THIS NEEDS IMPLEMENTATION. WORK IN PROGRESS
  //   const cropperCanvasRect = cropper.getCropperImage()?.getBoundingClientRect()!;
  //   const cropperImageClone = cropper.getCropperImage()?.cloneNode() as CropperImage;
  //   const cropperImageRect = cropperImageClone.getBoundingClientRect();

  //   if (
  //     (cropperImageRect.top > cropperCanvasRect.top && cropperImageRect.right < cropperCanvasRect.right) ||
  //     (cropperImageRect.right < cropperCanvasRect.right && cropperImageRect.bottom < cropperCanvasRect.bottom) ||
  //     (cropperImageRect.bottom < cropperCanvasRect.bottom && cropperImageRect.left > cropperCanvasRect.left) ||
  //     (cropperImageRect.left > cropperCanvasRect.left && cropperImageRect.top > cropperCanvasRect.top)
  //   ) {
  //     event.preventDefault();
  //   }
  // }

  function setupCropper(content: string): Attachment {
    return (img) => {
      const cropperTemplate = `<cropper-canvas style="height:300px" class="w-full" background>
  <cropper-image rotatable scalable skewable translatable initial-center-size="contain"></cropper-image>
  <cropper-shade hidden></cropper-shade>
  <cropper-handle action="select" plain></cropper-handle>
  <cropper-selection id="cropper-selection"  initial-coverage="1"  resizable>
    <cropper-grid role="grid" bordered covered></cropper-grid>
    <cropper-crosshair centered></cropper-crosshair>
    <cropper-handle action="move" theme-color="rgba(255, 255, 255, 0.35)"></cropper-handle>
    <cropper-handle action="n-resize"></cropper-handle>
    <cropper-handle action="e-resize"></cropper-handle>
    <cropper-handle action="s-resize"></cropper-handle>
    <cropper-handle action="w-resize"></cropper-handle>
    <cropper-handle action="ne-resize"></cropper-handle>
    <cropper-handle action="nw-resize"></cropper-handle>
    <cropper-handle action="se-resize"></cropper-handle>
    <cropper-handle action="sw-resize"></cropper-handle>
  </cropper-selection>
</cropper-canvas>`;

      if (!cropper) cropper = new Cropper(img as HTMLImageElement, { template: cropperTemplate });

      return async () => {
        cropper?.destroy();
        await tick();
        cropper = new Cropper(img as HTMLImageElement, { template: cropperTemplate });
      };
    };
  }
</script>

<div {id} class={cn("rounded overflow-hidden", className)}>
  <img {@attach setupCropper(sourceSrc)} src={sourceSrc} alt="CropperPic" />
  <div class="bg-muted justify-center p-2 flex gap-2">
    {#if actionsToShow?.done}
      <Button type="button" size="sm" onclick={getDataUri}>Done</Button>
    {/if}

    {#if actionsToShow?.cancel}
      <Button
        size="sm"
        variant="destructive"
        onclick={() => {
          cropper.destroy();
          showCropper = false;
        }}>Cancel</Button
      >
    {/if}
  </div>
</div>
