import React from "react";
import { StoryFn, Meta } from "@storybook/react";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "./accordion";

export default {
  title: "ui/Accordion",
  component: Accordion,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'Type of accordion (single or multiple open)',
    },
    collapsible: {
      control: 'boolean',
      description: 'Allow closing the open item in single type',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
} as Meta<typeof Accordion>;

const Template: StoryFn<typeof Accordion> = (args) => (
  <Accordion type={args.type} collapsible={args.collapsible} className={args.className ?? 'w-full'}>
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Is it styled?</AccordionTrigger>
      <AccordionContent>
        Yes. It comes with default styles that matches the other
        components&apos; aesthetic.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Is it animated?</AccordionTrigger>
      <AccordionContent>
        Yes. It's animated by default, but you can disable it if you prefer.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const AccordionDefault = Template.bind({});
AccordionDefault.args = {
  type: 'single',
  collapsible: true,
  className: 'w-full',
};