export const DROPDOWN_STYLES = {
  container: "relative",
  triggerBase: "flex items-center justify-between rounded-[4px] border border-neutral-6 bg-neutral-0 px-[12px] py-[8px] font-sans text-[14px] font-normal leading-[19px] text-neutral-6 transition-colors focus-visible:outline-none focus:border-brand-6 focus-visible:border-brand-6 hover:border-neutral-6",
  disabled: "border-neutral-5 bg-neutral-1 text-neutral-5 cursor-not-allowed",
  popup: "absolute z-50 w-[284px] overflow-hidden rounded-[4px] bg-neutral-0 shadow-[0_8px_25px_-5px_rgba(0,0,0,0.1),0_4px_10px_-2px_rgba(0,0,0,0.04)] border border-neutral-2 top-full mt-1 max-h-[200px] flex flex-col",
  scrollContent: "overflow-y-auto flex-1 custom-scrollbar",
  footer: "flex justify-center py-[2px] flex-shrink-0 cursor-pointer group",
  itemBase: "relative flex w-full cursor-default select-none items-center py-[8px] px-[12px] text-[14px] text-neutral-6 outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
} as const;

